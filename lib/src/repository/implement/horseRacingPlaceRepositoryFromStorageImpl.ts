import '../../utility/format';

import { inject, injectable } from 'tsyringe';

import { IS3Gateway } from '../../gateway/interface/iS3Gateway';
import { HorseRacingPlaceRecord } from '../../gateway/record/horseRacingPlaceRecord';
import { getJSTDate } from '../../utility/date';
import { Logger } from '../../utility/logger';
import { RaceType } from '../../utility/raceType';
import { HorseRacingPlaceEntity } from '../entity/horseRacingPlaceEntity';
import { SearchPlaceFilterEntity } from '../entity/searchPlaceFilterEntity';
import { IPlaceRepository } from '../interface/IPlaceRepository';

@injectable()
export class PlaceRepositoryFromStorageImpl
    implements IPlaceRepository<HorseRacingPlaceEntity>
{
    // S3にアップロードするファイル名
    private readonly fileName = 'placeList.csv';

    public constructor(
        @inject('NarPlaceS3Gateway')
        private readonly placeS3Gateway: IS3Gateway<HorseRacingPlaceRecord>,
    ) {}

    /**
     * 開催データを取得する
     * このメソッドで日付の範囲を指定して開催データを取得する
     * @param searchFilter
     */
    @Logger
    public async fetchPlaceEntityList(
        searchFilter: SearchPlaceFilterEntity,
    ): Promise<HorseRacingPlaceEntity[]> {
        // 年ごとの開催データを取得
        const placeRecordList: HorseRacingPlaceRecord[] =
            await this.getPlaceRecordListFromS3(searchFilter.raceType);

        // Entityに変換
        const placeEntityList: HorseRacingPlaceEntity[] = placeRecordList.map(
            (placeRecord) => placeRecord.toEntity(),
        );

        // filterで日付の範囲を指定
        const filteredPlaceEntityList = placeEntityList.filter(
            (placeEntity) =>
                placeEntity.placeData.dateTime >= searchFilter.startDate &&
                placeEntity.placeData.dateTime <= searchFilter.finishDate,
        );

        return filteredPlaceEntityList;
    }

    @Logger
    public async registerPlaceEntityList(
        raceType: RaceType,
        placeEntityList: HorseRacingPlaceEntity[],
    ): Promise<{
        code: number;
        message: string;
        successData: HorseRacingPlaceEntity[];
        failureData: HorseRacingPlaceEntity[];
    }> {
        try {
            // 既に登録されているデータを取得する
            const existFetchPlaceRecordList: HorseRacingPlaceRecord[] =
                await this.getPlaceRecordListFromS3(raceType);

            // PlaceEntityをPlaceRecordに変換する
            const placeRecordList: HorseRacingPlaceRecord[] =
                placeEntityList.map((placeEntity) => placeEntity.toRecord());

            // idが重複しているデータは上書きをし、新規のデータは追加する
            for (const placeRecord of placeRecordList) {
                // 既に登録されているデータがある場合は上書きする
                const index = existFetchPlaceRecordList.findIndex(
                    (record) => record.id === placeRecord.id,
                );
                if (index === -1) {
                    existFetchPlaceRecordList.push(placeRecord);
                } else {
                    existFetchPlaceRecordList[index] = placeRecord;
                }
            }

            // 日付の最新順にソート
            existFetchPlaceRecordList.sort(
                (a, b) => b.dateTime.getTime() - a.dateTime.getTime(),
            );

            await this.placeS3Gateway.uploadDataToS3(
                existFetchPlaceRecordList,
                this.fileName,
            );

            return {
                code: 200,
                message: 'データの保存に成功しました',
                successData: placeEntityList,
                failureData: [],
            };
        } catch (error) {
            console.error(error);
            return {
                code: 500,
                message: 'Internal Server Error',
                successData: [],
                failureData: placeEntityList,
            };
        }
    }

    /**
     * 開催場データをS3から取得する
     * @param raceType - レース種別
     */
    @Logger
    private async getPlaceRecordListFromS3(
        raceType: RaceType,
    ): Promise<HorseRacingPlaceRecord[]> {
        // S3からデータを取得する
        const csv = await this.placeS3Gateway.fetchDataFromS3(this.fileName);

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
            dateTime: headers.indexOf('dateTime'),
            location: headers.indexOf('location'),
            updateDate: headers.indexOf('updateDate'),
        };

        // データ行を解析してPlaceDataのリストを生成
        const placeRecordList: HorseRacingPlaceRecord[] = lines
            .slice(1)
            .flatMap((line: string): HorseRacingPlaceRecord[] => {
                try {
                    const columns = line.split(',');

                    const updateDate = columns[indices.updateDate]
                        ? new Date(columns[indices.updateDate])
                        : getJSTDate(new Date());

                    return [
                        HorseRacingPlaceRecord.create(
                            columns[indices.id],
                            raceType,
                            new Date(columns[indices.dateTime]),
                            columns[indices.location],
                            updateDate,
                        ),
                    ];
                } catch (error) {
                    console.error(error);
                    return [];
                }
            });
        return placeRecordList;
    }
}
