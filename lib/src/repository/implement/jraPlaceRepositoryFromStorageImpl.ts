import '../../utility/format';

import { inject, injectable } from 'tsyringe';

import { HeldDayData } from '../../domain/heldDayData';
import { PlaceData } from '../../domain/placeData';
import { IS3Gateway } from '../../gateway/interface/iS3Gateway';
import { heldDayRecord } from '../../gateway/record/heldDayRecord';
import { PlaceRecord } from '../../gateway/record/placeRecord';
import { getJSTDate } from '../../utility/date';
import { Logger } from '../../utility/logger';
import { RaceType } from '../../utility/raceType';
import { JraPlaceEntity } from '../entity/jraPlaceEntity';
import { SearchPlaceFilterEntity } from '../entity/searchPlaceFilterEntity';
import { IPlaceRepository } from '../interface/IPlaceRepository';

@injectable()
export class JraPlaceRepositoryFromStorageImpl
    implements IPlaceRepository<JraPlaceEntity>
{
    // S3にアップロードするファイル名
    private readonly placeFileName = 'placeList.csv';
    private readonly heldDayFileName = 'heldDayList.csv';

    public constructor(
        @inject('PlaceS3Gateway')
        private readonly placeS3Gateway: IS3Gateway<PlaceRecord>,
        @inject('HeldDayS3Gateway')
        private readonly heldDayS3Gateway: IS3Gateway<heldDayRecord>,
    ) {}

    /**
     * 開催データを取得する
     * このメソッドで日付の範囲を指定して開催データを取得する
     * @param searchFilter
     */
    @Logger
    public async fetchPlaceEntityList(
        searchFilter: SearchPlaceFilterEntity,
    ): Promise<JraPlaceEntity[]> {
        // 開催データを取得
        const placeRecordList: PlaceRecord[] =
            await this.getPlaceRecordListFromS3(searchFilter.raceType);

        const heldDayRecordList: heldDayRecord[] =
            await this.getHeldDayRecordListFromS3(searchFilter.raceType);

        // placeRecordListのidと、heldDayRecordListのidが一致するものを取得
        const recordMap = new Map<
            string,
            {
                placeRecord: PlaceRecord;
                heldDayRecord: heldDayRecord;
            }
        >();

        // 量を減らすために、日付の範囲でフィルタリング
        for (const placeRecord of placeRecordList.filter(
            (_placeRecord) =>
                _placeRecord.dateTime >= searchFilter.startDate &&
                _placeRecord.dateTime <= searchFilter.finishDate,
        )) {
            const heldDayRecordItem = heldDayRecordList.find(
                (record) => record.id === placeRecord.id,
            );
            if (!heldDayRecordItem) {
                // heldDayRecordが見つからない場合はスキップ
                continue;
            }
            recordMap.set(placeRecord.id, {
                placeRecord,
                heldDayRecord: heldDayRecordItem,
            });
        }

        // raceEntityListに変換
        const placeEntityList: JraPlaceEntity[] = [...recordMap.values()].map(
            ({ placeRecord, heldDayRecord: heldDayRecordItem }) => {
                return JraPlaceEntity.create(
                    placeRecord.id,
                    PlaceData.create(
                        searchFilter.raceType,
                        placeRecord.dateTime,
                        placeRecord.location,
                    ),
                    HeldDayData.create(
                        heldDayRecordItem.heldTimes,
                        heldDayRecordItem.heldDayTimes,
                    ),
                    // placeRecordとheldDayRecordのupdateDateの早い方を使用
                    new Date(
                        Math.min(
                            placeRecord.updateDate.getTime(),
                            heldDayRecordItem.updateDate.getTime(),
                        ),
                    ),
                );
            },
        );
        return placeEntityList;
    }

    @Logger
    public async registerPlaceEntityList(
        raceType: RaceType,
        placeEntityList: JraPlaceEntity[],
    ): Promise<{
        code: number;
        message: string;
        successData: JraPlaceEntity[];
        failureData: JraPlaceEntity[];
    }> {
        try {
            // 既に登録されているデータを取得する
            const existFetchPlaceRecordList: PlaceRecord[] =
                await this.getPlaceRecordListFromS3(raceType);

            const placeRecordList: PlaceRecord[] = placeEntityList.map(
                (placeEntity) => placeEntity.toRecord(),
            );

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
                `${raceType.toLowerCase()}/`,
                this.placeFileName,
            );

            const existFetchHeldDayRecordList: heldDayRecord[] =
                await this.getHeldDayRecordListFromS3(raceType);

            const heldDayRecordList: heldDayRecord[] = placeEntityList.map(
                (placeEntity) =>
                    heldDayRecord.create(
                        placeEntity.id,
                        placeEntity.placeData.raceType,
                        placeEntity.heldDayData.heldTimes,
                        placeEntity.heldDayData.heldDayTimes,
                        placeEntity.updateDate,
                    ),
            );

            // idが重複しているデータは上書きをし、新規のデータは追加する
            for (const heldDayRecordItem of heldDayRecordList) {
                // 既に登録されているデータがある場合は上書きする
                const index = existFetchHeldDayRecordList.findIndex(
                    (record) => record.id === heldDayRecordItem.id,
                );
                if (index === -1) {
                    existFetchHeldDayRecordList.push(heldDayRecordItem);
                } else {
                    existFetchHeldDayRecordList[index] = heldDayRecordItem;
                }
            }

            // 日付の最新順にソート
            existFetchHeldDayRecordList.sort(
                (a, b) => b.updateDate.getTime() - a.updateDate.getTime(),
            );

            await this.heldDayS3Gateway.uploadDataToS3(
                existFetchHeldDayRecordList,
                `${raceType.toLowerCase()}/`,
                this.heldDayFileName,
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
    ): Promise<PlaceRecord[]> {
        // S3からデータを取得する
        const csv = await this.placeS3Gateway.fetchDataFromS3(
            `${raceType.toLowerCase()}/`,
            this.placeFileName,
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
            dateTime: headers.indexOf('dateTime'),
            location: headers.indexOf('location'),
            updateDate: headers.indexOf('updateDate'),
        };

        // データ行を解析して PlaceData のリストを生成
        const placeRecordList: PlaceRecord[] = lines
            .slice(1)
            .flatMap((line: string): PlaceRecord[] => {
                try {
                    const columns = line.split(',');

                    const updateDate = columns[indices.updateDate]
                        ? new Date(columns[indices.updateDate])
                        : getJSTDate(new Date());

                    return [
                        PlaceRecord.create(
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

    /**
     * 開催場データをS3から取得する
     * @param raceType - レース種別
     */
    @Logger
    private async getHeldDayRecordListFromS3(
        raceType: RaceType,
    ): Promise<heldDayRecord[]> {
        // S3からデータを取得する
        const csv = await this.heldDayS3Gateway.fetchDataFromS3(
            `${raceType.toLowerCase()}/`,
            this.heldDayFileName,
        );

        // ファイルが空の場合は空のリストを返す
        if (!csv) {
            return [];
        }

        // CSVを行ごとに分割
        const lines = csv.split('\n');
        console.log('lines:', lines);
        // ヘッダー行を解析
        const headers = lines[0].split(',');

        // ヘッダーに基づいてインデックスを取得
        const indices = {
            id: headers.indexOf('id'),
            raceType: headers.indexOf('raceType'),
            heldTimes: headers.indexOf('heldTimes'),
            heldDayTimes: headers.indexOf('heldDayTimes'),
            updateDate: headers.indexOf('updateDate'),
        };

        // データ行を解析して JraHeldDayRecord のリストを生成
        const heldDayRecordList: heldDayRecord[] = lines
            .slice(1)
            .flatMap((line: string): heldDayRecord[] => {
                try {
                    const columns = line.split(',');

                    const updateDate = columns[indices.updateDate]
                        ? new Date(columns[indices.updateDate])
                        : getJSTDate(new Date());

                    if (columns[indices.raceType] !== raceType) {
                        return [];
                    }

                    return [
                        heldDayRecord.create(
                            columns[indices.id],
                            raceType,
                            Number.parseInt(columns[indices.heldTimes], 10),
                            Number.parseInt(columns[indices.heldDayTimes], 10),
                            updateDate,
                        ),
                    ];
                } catch (error) {
                    console.error(error);
                    return [];
                }
            });
        return heldDayRecordList;
    }
}
