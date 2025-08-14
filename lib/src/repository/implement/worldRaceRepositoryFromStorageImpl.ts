import 'reflect-metadata';

import { inject, injectable } from 'tsyringe';

import { IS3Gateway } from '../../gateway/interface/iS3Gateway';
import { HorseRacingRaceRecord } from '../../gateway/record/horseRacingRaceRecord';
import { getJSTDate } from '../../utility/date';
import { Logger } from '../../utility/logger';
import { RaceType } from '../../utility/raceType';
import { HorseRacingPlaceEntity } from '../entity/horseRacingPlaceEntity';
import { HorseRacingRaceEntity } from '../entity/horseRacingRaceEntity';
import { SearchRaceFilterEntity } from '../entity/searchRaceFilterEntity';
import { IRaceRepository } from '../interface/IRaceRepository';

/**
 * 競馬場開催データリポジトリの実装
 */
@injectable()
export class WorldRaceRepositoryFromStorageImpl
    implements IRaceRepository<HorseRacingRaceEntity, HorseRacingPlaceEntity>
{
    private readonly fileName = 'raceList.csv';

    public constructor(
        @inject('WorldRaceS3Gateway')
        private readonly s3Gateway: IS3Gateway<HorseRacingRaceRecord>,
    ) {}

    /**
     * 開催データを取得する
     * @param searchFilter
     */
    @Logger
    public async fetchRaceEntityList(
        searchFilter: SearchRaceFilterEntity<HorseRacingPlaceEntity>,
    ): Promise<HorseRacingRaceEntity[]> {
        // ファイル名リストから開催データを取得する
        const raceRecordList: HorseRacingRaceRecord[] =
            await this.getRaceRecordListFromS3(searchFilter.raceType);

        // RaceRecordをRaceEntityに変換
        const raceEntityList: HorseRacingRaceEntity[] = raceRecordList.map(
            (raceRecord) => raceRecord.toEntity(),
        );

        // フィルタリング処理（日付の範囲指定）
        const filteredRaceEntityList: HorseRacingRaceEntity[] =
            raceEntityList.filter(
                (raceEntity) =>
                    raceEntity.raceData.dateTime >= searchFilter.startDate &&
                    raceEntity.raceData.dateTime <= searchFilter.finishDate,
            );

        return filteredRaceEntityList;
    }

    /**
     * レースデータを登録する
     * @param raceType - レース種別
     * @param raceEntityList
     */
    @Logger
    public async registerRaceEntityList(
        raceType: RaceType,
        raceEntityList: HorseRacingRaceEntity[],
    ): Promise<void> {
        // 既に登録されているデータを取得する
        const existFetchRaceRecordList: HorseRacingRaceRecord[] =
            await this.getRaceRecordListFromS3(raceType);

        // RaceEntityをRaceRecordに変換する
        const raceRecordList: HorseRacingRaceRecord[] = raceEntityList.map(
            (raceEntity) => raceEntity.toRaceRecord(),
        );

        // idが重複しているデータは上書きをし、新規のデータは追加する
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

        // 日付の最新順にソート
        existFetchRaceRecordList.sort(
            (a, b) => b.dateTime.getTime() - a.dateTime.getTime(),
        );

        // 月毎に分けられたplaceをS3にアップロードする
        await this.s3Gateway.uploadDataToS3(
            existFetchRaceRecordList,
            this.fileName,
        );
    }

    /**
     * レースデータをS3から取得する
     * @param raceType - レース種別
     */
    @Logger
    private async getRaceRecordListFromS3(
        raceType: RaceType,
    ): Promise<HorseRacingRaceRecord[]> {
        // S3からデータを取得する
        const csv = await this.s3Gateway.fetchDataFromS3(this.fileName);

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
            dateTime: headers.indexOf('dateTime'),
            location: headers.indexOf('location'),
            surfaceType: headers.indexOf('surfaceType'),
            distance: headers.indexOf('distance'),
            grade: headers.indexOf('grade'),
            number: headers.indexOf('number'),
            updateDate: headers.indexOf('updateDate'),
        };

        // データ行を解析してRaceDataのリストを生成
        return lines
            .slice(1)
            .flatMap((line: string): HorseRacingRaceRecord[] => {
                try {
                    const columns = line.split(',');

                    // updateDateが存在しない場合は現在時刻を設定
                    const updateDate = columns[indices.updateDate]
                        ? new Date(columns[indices.updateDate])
                        : getJSTDate(new Date());

                    return [
                        HorseRacingRaceRecord.create(
                            columns[indices.id],
                            raceType,
                            columns[indices.name],
                            new Date(columns[indices.dateTime]),
                            columns[indices.location],
                            columns[indices.surfaceType],
                            Number.parseInt(columns[indices.distance]),
                            columns[indices.grade],
                            Number.parseInt(columns[indices.number]),
                            updateDate,
                        ),
                    ];
                } catch (error) {
                    console.error(error);
                    return [];
                }
            });
    }
}
