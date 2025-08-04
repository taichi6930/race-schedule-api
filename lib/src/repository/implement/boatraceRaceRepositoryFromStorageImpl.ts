import 'reflect-metadata';

import { inject, injectable } from 'tsyringe';

import { RaceData } from '../../domain/raceData';
import { RacePlayerData } from '../../domain/racePlayerData';
import { IS3Gateway } from '../../gateway/interface/iS3Gateway';
import { RacePlayerRecord } from '../../gateway/record/racePlayerRecord';
import { RaceRecord } from '../../gateway/record/raceRecord';
import { getJSTDate } from '../../utility/date';
import { Logger } from '../../utility/logger';
import { RaceType } from '../../utility/raceType';
import { BoatraceRaceEntity } from '../entity/boatraceRaceEntity';
import { PlaceEntity } from '../entity/placeEntity';
import { SearchRaceFilterEntity } from '../entity/searchRaceFilterEntity';
import { IRaceRepository } from '../interface/IRaceRepository';

/**
 * ボートレース場開催データリポジトリの実装
 */
@injectable()
export class BoatraceRaceRepositoryFromStorageImpl
    implements IRaceRepository<BoatraceRaceEntity, PlaceEntity>
{
    private readonly raceListFileName = 'raceList.csv';
    private readonly racePlayerListFileName = 'racePlayerList.csv';

    public constructor(
        @inject('BoatraceRaceS3Gateway')
        private readonly raceS3Gateway: IS3Gateway<RaceRecord>,
        @inject('BoatraceRacePlayerS3Gateway')
        private readonly racePlayerS3Gateway: IS3Gateway<RacePlayerRecord>,
    ) {}

    /**
     * 開催データを取得する
     * @param searchFilter
     */
    @Logger
    public async fetchRaceEntityList(
        searchFilter: SearchRaceFilterEntity<PlaceEntity>,
    ): Promise<BoatraceRaceEntity[]> {
        // ファイル名リストからボートレース選手データを取得する
        const racePlayerRecordList: RacePlayerRecord[] =
            await this.getRacePlayerRecordListFromS3();

        // レースデータを取得する
        const raceRaceRecordList: RaceRecord[] =
            await this.getRaceRecordListFromS3();

        // RaceEntityに変換
        const raceEntityList: BoatraceRaceEntity[] = raceRaceRecordList.map(
            (raceRecord) => {
                // raceIdに対応したracePlayerRecordListを取得
                const filteredRacePlayerRecordList: RacePlayerRecord[] =
                    racePlayerRecordList.filter((racePlayerRecord) => {
                        return racePlayerRecord.raceId === raceRecord.id;
                    });
                // BoatraceRacePlayerDataのリストを生成
                const racePlayerDataList: RacePlayerData[] =
                    filteredRacePlayerRecordList.map((racePlayerRecord) => {
                        return RacePlayerData.create(
                            RaceType.BOATRACE,
                            racePlayerRecord.positionNumber,
                            racePlayerRecord.playerNumber,
                        );
                    });
                // BoatraceRaceDataを生成
                const raceData = RaceData.create(
                    RaceType.BOATRACE,
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
    public async registerRaceEntityList(
        raceEntityList: BoatraceRaceEntity[],
    ): Promise<void> {
        // 既に登録されているデータを取得する
        const existFetchRaceRecordList: RaceRecord[] =
            await this.getRaceRecordListFromS3();

        const existFetchRacePlayerRecordList: RacePlayerRecord[] =
            await this.getRacePlayerRecordListFromS3();

        // RaceEntityをRaceRecordに変換する
        const raceRecordList: RaceRecord[] = raceEntityList.map((raceEntity) =>
            raceEntity.toRaceRecord(),
        );

        // RaceEntityをRacePlayerRecordに変換する
        const racePlayerRecordList = raceEntityList.flatMap((raceEntity) =>
            raceEntity.toPlayerRecordList(),
        );

        // raceデータでidが重複しているデータは上書きをし、新規のデータは追加する
        for (const raceRecord of raceRecordList) {
            // 既に登録されているデータがある場合は上書きする
            const index = existFetchRaceRecordList.findIndex(
                (record) => record.id === raceRecord.id,
            );
            if (index === -1) {
                existFetchRaceRecordList.push(raceRecord);
            } else {
                existFetchRaceRecordList[index] = raceRecord;
            }
        }

        // racePlayerデータでidが重複しているデータは上書きをし、新規のデータは追加する
        for (const racePlayerRecord of racePlayerRecordList) {
            // 既に登録されているデータがある場合は上書きする
            const index = existFetchRacePlayerRecordList.findIndex(
                (record) => record.id === racePlayerRecord.id,
            );
            if (index === -1) {
                existFetchRacePlayerRecordList.push(racePlayerRecord);
            } else {
                existFetchRacePlayerRecordList[index] = racePlayerRecord;
            }
        }

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
    private async getRaceRecordListFromS3(): Promise<RaceRecord[]> {
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
        return lines.slice(1).flatMap((line: string): RaceRecord[] => {
            try {
                const columns = line.split(',');

                const updateDate = columns[indices.updateDate]
                    ? new Date(columns[indices.updateDate])
                    : getJSTDate(new Date());

                return [
                    RaceRecord.create(
                        columns[indices.id],
                        RaceType.BOATRACE,
                        columns[indices.name],
                        columns[indices.stage],
                        new Date(columns[indices.dateTime]),
                        columns[indices.location],
                        columns[indices.grade],
                        Number.parseInt(columns[indices.number]),
                        updateDate,
                    ),
                ];
            } catch (error) {
                console.error('RaceRecord create error', error);
                return [];
            }
        });
    }

    /**
     * レースプレイヤーデータをS3から取得する
     */
    @Logger
    private async getRacePlayerRecordListFromS3(): Promise<RacePlayerRecord[]> {
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
        const boatraceRacePlayerRecordList: RacePlayerRecord[] = lines
            .slice(1)
            .flatMap((line: string): RacePlayerRecord[] => {
                try {
                    const columns = line.split(',');

                    const updateDate = columns[indices.updateDate]
                        ? new Date(columns[indices.updateDate])
                        : getJSTDate(new Date());

                    return [
                        RacePlayerRecord.create(
                            columns[indices.id],
                            RaceType.BOATRACE,
                            columns[indices.raceId],
                            Number.parseInt(columns[indices.positionNumber]),
                            Number.parseInt(columns[indices.playerNumber]),
                            updateDate,
                        ),
                    ];
                } catch (error) {
                    console.error('RacePlayerRecord create error', error);
                    return [];
                }
            });
        return boatraceRacePlayerRecordList;
    }
}
