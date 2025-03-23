import 'reflect-metadata';

import { inject, injectable } from 'tsyringe';

import { BoatraceRaceData } from '../../domain/boatraceRaceData';
import { BoatraceRacePlayerData } from '../../domain/boatraceRacePlayerData';
import { IS3Gateway } from '../../gateway/interface/iS3Gateway';
import { BoatraceRacePlayerRecord } from '../../gateway/record/boatraceRacePlayerRecord';
import { BoatraceRaceRecord } from '../../gateway/record/boatraceRaceRecord';
import { getJSTDate } from '../../utility/date';
import { Logger } from '../../utility/logger';
import { BoatracePlaceEntity } from '../entity/boatracePlaceEntity';
import { BoatraceRaceEntity } from '../entity/boatraceRaceEntity';
import { SearchRaceFilterEntity } from '../entity/searchRaceFilterEntity';
import { IRaceRepository } from '../interface/IRaceRepository';

/**
 * ボートレース場開催データリポジトリの実装
 */
@injectable()
export class BoatraceRaceRepositoryFromStorageImpl
    implements IRaceRepository<BoatraceRaceEntity, BoatracePlaceEntity>
{
    private readonly raceListFileName = 'raceList.csv';
    private readonly racePlayerListFileName = 'racePlayerList.csv';

    constructor(
        @inject('BoatraceRaceS3Gateway')
        private readonly raceS3Gateway: IS3Gateway<BoatraceRaceRecord>,
        @inject('BoatraceRacePlayerS3Gateway')
        private readonly racePlayerS3Gateway: IS3Gateway<BoatraceRacePlayerRecord>,
    ) {}

    /**
     * 開催データを取得する
     * @param searchFilter
     */
    @Logger
    async fetchRaceEntityList(
        searchFilter: SearchRaceFilterEntity<BoatracePlaceEntity>,
    ): Promise<BoatraceRaceEntity[]> {
        // ファイル名リストからボートレース選手データを取得する
        const racePlayerRecordList: BoatraceRacePlayerRecord[] =
            await this.getRacePlayerRecordListFromS3();

        // レースデータを取得する
        const raceRaceRecordList: BoatraceRaceRecord[] =
            await this.getRaceRecordListFromS3();

        // RaceEntityに変換
        const raceEntityList: BoatraceRaceEntity[] = raceRaceRecordList.map(
            (raceRecord) => {
                // raceIdに対応したracePlayerRecordListを取得
                const filteredRacePlayerRecordList: BoatraceRacePlayerRecord[] =
                    racePlayerRecordList.filter((racePlayerRecord) => {
                        return racePlayerRecord.raceId === raceRecord.id;
                    });
                // BoatraceRacePlayerDataのリストを生成
                const racePlayerDataList: BoatraceRacePlayerData[] =
                    filteredRacePlayerRecordList.map((racePlayerRecord) => {
                        return BoatraceRacePlayerData.create(
                            racePlayerRecord.positionNumber,
                            racePlayerRecord.playerNumber,
                        );
                    });
                // BoatraceRaceDataを生成
                const raceData = BoatraceRaceData.create(
                    raceRecord.name,
                    raceRecord.stage,
                    raceRecord.dateTime,
                    raceRecord.location,
                    raceRecord.grade,
                    raceRecord.number,
                );
                return BoatraceRaceEntity.create(
                    raceRecord.id,
                    raceData,
                    racePlayerDataList,
                    raceRecord.updateDate,
                );
            },
        );
        // フィルタリング処理（日付の範囲指定）
        const filteredRaceEntityList: BoatraceRaceEntity[] =
            raceEntityList.filter(
                (raceEntity) =>
                    raceEntity.raceData.dateTime >= searchFilter.startDate &&
                    raceEntity.raceData.dateTime <= searchFilter.finishDate,
            );

        return filteredRaceEntityList;
    }

    /**
     * レースデータを登録する
     * @param raceEntityList
     */
    @Logger
    async registerRaceEntityList(
        raceEntityList: BoatraceRaceEntity[],
    ): Promise<void> {
        // 既に登録されているデータを取得する
        const existFetchRaceRecordList: BoatraceRaceRecord[] =
            await this.getRaceRecordListFromS3();

        const existFetchRacePlayerRecordList: BoatraceRacePlayerRecord[] =
            await this.getRacePlayerRecordListFromS3();

        // RaceEntityをRaceRecordに変換する
        const raceRecordList: BoatraceRaceRecord[] = raceEntityList.map(
            (raceEntity) => raceEntity.toRaceRecord(),
        );

        // RaceEntityをRacePlayerRecordに変換する
        const racePlayerRecordList = raceEntityList
            .map((raceEntity) => raceEntity.toPlayerRecordList())
            .flat();

        // raceデータでidが重複しているデータは上書きをし、新規のデータは追加する
        raceRecordList.forEach((raceRecord) => {
            // 既に登録されているデータがある場合は上書きする
            const index = existFetchRaceRecordList.findIndex(
                (record) => record.id === raceRecord.id,
            );
            if (index !== -1) {
                existFetchRaceRecordList[index] = raceRecord;
            } else {
                existFetchRaceRecordList.push(raceRecord);
            }
        });

        // racePlayerデータでidが重複しているデータは上書きをし、新規のデータは追加する
        racePlayerRecordList.forEach((racePlayerRecord) => {
            // 既に登録されているデータがある場合は上書きする
            const index = existFetchRacePlayerRecordList.findIndex(
                (record) => record.id === racePlayerRecord.id,
            );
            if (index !== -1) {
                existFetchRacePlayerRecordList[index] = racePlayerRecord;
            } else {
                existFetchRacePlayerRecordList.push(racePlayerRecord);
            }
        });

        // 日付の最新順にソート
        existFetchRaceRecordList.sort(
            (a, b) => b.dateTime.getTime() - a.dateTime.getTime(),
        );

        // raceDataをS3にアップロードする
        await this.raceS3Gateway.uploadDataToS3(
            existFetchRaceRecordList,
            this.raceListFileName,
        );
        await this.racePlayerS3Gateway.uploadDataToS3(
            existFetchRacePlayerRecordList,
            this.racePlayerListFileName,
        );
    }

    /**
     * レースデータをS3から取得する
     */
    @Logger
    private async getRaceRecordListFromS3(): Promise<BoatraceRaceRecord[]> {
        // S3からデータを取得する
        const csv = await this.raceS3Gateway.fetchDataFromS3(
            this.raceListFileName,
        );

        // ファイルが空の場合は空のリストを返す
        if (!csv) {
            return [];
        }

        // CSVを行ごとに分割
        const lines = csv.split('\n');

        // ヘッダー行を解析
        const headers = lines[0].split(',');

        // ヘッダーに基づいてインデックスを取得
        const indices = {
            id: headers.indexOf('id'),
            name: headers.indexOf('name'),
            stage: headers.indexOf('stage'),
            dateTime: headers.indexOf('dateTime'),
            location: headers.indexOf('location'),
            grade: headers.indexOf('grade'),
            number: headers.indexOf('number'),
            updateDate: headers.indexOf('updateDate'),
        };

        // データ行を解析してRaceDataのリストを生成
        return lines
            .slice(1)
            .map((line: string) => {
                try {
                    const columns = line.split(',');

                    const updateDate = columns[indices.updateDate]
                        ? new Date(columns[indices.updateDate])
                        : getJSTDate(new Date());

                    return BoatraceRaceRecord.create(
                        columns[indices.id],
                        columns[indices.name],
                        columns[indices.stage],
                        new Date(columns[indices.dateTime]),
                        columns[indices.location],
                        columns[indices.grade],
                        Number.parseInt(columns[indices.number]),
                        updateDate,
                    );
                } catch (error) {
                    console.error('BoatraceRaceRecord create error', error);
                    return undefined;
                }
            })
            .filter(
                (raceData): raceData is BoatraceRaceRecord =>
                    raceData !== undefined,
            );
    }

    /**
     * レースプレイヤーデータをS3から取得する
     */
    @Logger
    private async getRacePlayerRecordListFromS3(): Promise<
        BoatraceRacePlayerRecord[]
    > {
        // S3からデータを取得する
        const csv = await this.racePlayerS3Gateway.fetchDataFromS3(
            this.racePlayerListFileName,
        );

        // ファイルが空の場合は空のリストを返す
        if (!csv) {
            return [];
        }

        // CSVを行ごとに分割
        const lines = csv.split('\n');

        // ヘッダー行を解析
        const headers = lines[0].split(',');

        const indices = {
            id: headers.indexOf('id'),
            raceId: headers.indexOf('raceId'),
            positionNumber: headers.indexOf('positionNumber'),
            playerNumber: headers.indexOf('playerNumber'),
            updateDate: headers.indexOf('updateDate'),
        };

        // データ行を解析してBoatraceRaceDataのリストを生成
        const boatraceRacePlayerRecordList: BoatraceRacePlayerRecord[] = lines
            .slice(1)
            .map((line: string) => {
                try {
                    const columns = line.split(',');

                    const updateDate = columns[indices.updateDate]
                        ? new Date(columns[indices.updateDate])
                        : getJSTDate(new Date());

                    return BoatraceRacePlayerRecord.create(
                        columns[indices.id],
                        columns[indices.raceId],
                        Number.parseInt(columns[indices.positionNumber]),
                        Number.parseInt(columns[indices.playerNumber]),
                        updateDate,
                    );
                } catch (error) {
                    console.error(
                        'BoatraceRacePlayerRecord create error',
                        error,
                    );
                    return undefined;
                }
            })
            .filter(
                (
                    racePlayerRecord,
                ): racePlayerRecord is BoatraceRacePlayerRecord =>
                    racePlayerRecord !== undefined,
            );
        return boatraceRacePlayerRecordList;
    }
}
