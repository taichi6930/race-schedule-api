import 'reflect-metadata';

import { inject, injectable } from 'tsyringe';

import { KeirinRaceData } from '../../domain/keirinRaceData';
import { KeirinRacePlayerData } from '../../domain/keirinRacePlayerData';
import { IS3Gateway } from '../../gateway/interface/iS3Gateway';
import { KeirinRacePlayerRecord } from '../../gateway/record/keirinRacePlayerRecord';
import { KeirinRaceRecord } from '../../gateway/record/keirinRaceRecord';
import { getJSTDate } from '../../utility/date';
import { Logger } from '../../utility/logger';
import { KeirinPlaceEntity } from '../entity/keirinPlaceEntity';
import { KeirinRaceEntity } from '../entity/keirinRaceEntity';
import { SearchRaceFilterEntity } from '../entity/searchRaceFilterEntity';
import { IRaceRepository } from '../interface/IRaceRepository';

/**
 * 競輪場開催データリポジトリの実装
 */
@injectable()
export class KeirinRaceRepositoryFromStorageImpl
    implements IRaceRepository<KeirinRaceEntity, KeirinPlaceEntity>
{
    private readonly raceListFileName = 'raceList.csv';
    private readonly racePlayerListFileName = 'racePlayerList.csv';

    constructor(
        @inject('KeirinRaceS3Gateway')
        private readonly raceS3Gateway: IS3Gateway<KeirinRaceRecord>,
        @inject('KeirinRacePlayerS3Gateway')
        private readonly racePlayerS3Gateway: IS3Gateway<KeirinRacePlayerRecord>,
    ) {}

    /**
     * 開催データを取得する
     * @param searchFilter
     */
    @Logger
    async fetchRaceEntityList(
        searchFilter: SearchRaceFilterEntity<KeirinPlaceEntity>,
    ): Promise<KeirinRaceEntity[]> {
        // ファイル名リストから選手データを取得する
        const racePlayerRecordList: KeirinRacePlayerRecord[] =
            await this.getRacePlayerRecordListFromS3();

        // レースデータを取得する
        const raceRaceRecordList: KeirinRaceRecord[] =
            await this.getRaceRecordListFromS3();

        // RaceEntityに変換
        const raceEntityList: KeirinRaceEntity[] = raceRaceRecordList.map(
            (raceRecord) => {
                // raceIdに対応したracePlayerRecordListを取得
                const filteredRacePlayerRecordList: KeirinRacePlayerRecord[] =
                    racePlayerRecordList.filter((racePlayerRecord) => {
                        return racePlayerRecord.raceId === raceRecord.id;
                    });
                // KeirinRacePlayerDataのリストを生成
                const racePlayerDataList: KeirinRacePlayerData[] =
                    filteredRacePlayerRecordList.map((racePlayerRecord) => {
                        return KeirinRacePlayerData.create(
                            racePlayerRecord.positionNumber,
                            racePlayerRecord.playerNumber,
                        );
                    });
                // KeirinRaceDataを生成
                const raceData = KeirinRaceData.create(
                    raceRecord.name,
                    raceRecord.stage,
                    raceRecord.dateTime,
                    raceRecord.location,
                    raceRecord.grade,
                    raceRecord.number,
                );
                return KeirinRaceEntity.create(
                    raceRecord.id,
                    raceData,
                    racePlayerDataList,
                    raceRecord.updateDate,
                );
            },
        );
        // フィルタリング処理（日付の範囲指定）
        const filteredRaceEntityList: KeirinRaceEntity[] =
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
        raceEntityList: KeirinRaceEntity[],
    ): Promise<void> {
        // 既に登録されているデータを取得する
        const existFetchRaceRecordList: KeirinRaceRecord[] =
            await this.getRaceRecordListFromS3();

        const existFetchRacePlayerRecordList: KeirinRacePlayerRecord[] =
            await this.getRacePlayerRecordListFromS3();

        // RaceEntityをRaceRecordに変換する
        const raceRecordList: KeirinRaceRecord[] = raceEntityList.map(
            (raceEntity) => raceEntity.toRaceRecord(),
        );

        // RaceEntityをRacePlayerRecordに変換する
        const racePlayerRecordList = raceEntityList
            .map((raceEntity) => raceEntity.toPlayerRecordList())
            .flat();

        // raceデータでidが重複しているデータは上書きをし、新規のデータは追加する
        for (const raceRecord of raceRecordList) {
            // 既に登録されているデータがある場合は上書きする
            const index = existFetchRaceRecordList.findIndex(
                (record) => record.id === raceRecord.id,
            );
            if (index !== -1) {
                existFetchRaceRecordList[index] = raceRecord;
            } else {
                existFetchRaceRecordList.push(raceRecord);
            }
        }

        // racePlayerデータでidが重複しているデータは上書きをし、新規のデータは追加する
        for (const racePlayerRecord of racePlayerRecordList) {
            // 既に登録されているデータがある場合は上書きする
            const index = existFetchRacePlayerRecordList.findIndex(
                (record) => record.id === racePlayerRecord.id,
            );
            if (index !== -1) {
                existFetchRacePlayerRecordList[index] = racePlayerRecord;
            } else {
                existFetchRacePlayerRecordList.push(racePlayerRecord);
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
    private async getRaceRecordListFromS3(): Promise<KeirinRaceRecord[]> {
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

                    return KeirinRaceRecord.create(
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
                    console.error('KeirinRaceRecord create error', error);
                    return undefined;
                }
            })
            .filter(
                (raceData): raceData is KeirinRaceRecord =>
                    raceData !== undefined,
            );
    }

    /**
     * レースプレイヤーデータをS3から取得する
     */
    @Logger
    private async getRacePlayerRecordListFromS3(): Promise<
        KeirinRacePlayerRecord[]
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

        // データ行を解析してKeirinRaceDataのリストを生成
        const keirinRacePlayerRecordList: KeirinRacePlayerRecord[] = lines
            .slice(1)
            .map((line: string) => {
                try {
                    const columns = line.split(',');

                    const updateDate = columns[indices.updateDate]
                        ? new Date(columns[indices.updateDate])
                        : getJSTDate(new Date());

                    return KeirinRacePlayerRecord.create(
                        columns[indices.id],
                        columns[indices.raceId],
                        Number.parseInt(columns[indices.positionNumber]),
                        Number.parseInt(columns[indices.playerNumber]),
                        updateDate,
                    );
                } catch (error) {
                    console.error('KeirinRacePlayerRecord create error', error);
                    return undefined;
                }
            })
            .filter(
                (
                    racePlayerRecord,
                ): racePlayerRecord is KeirinRacePlayerRecord =>
                    racePlayerRecord !== undefined,
            );
        return keirinRacePlayerRecordList;
    }
}
