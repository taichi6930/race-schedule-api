import '../../utility/format';

import { inject, injectable } from 'tsyringe';

import { HeldDayData } from '../../domain/heldDayData';
import { PlaceData } from '../../domain/placeData';
import { IS3Gateway } from '../../gateway/interface/iS3Gateway';
import { HeldDayRecord } from '../../gateway/record/heldDayRecord';
import { PlaceRecord } from '../../gateway/record/placeRecord';
import { CSV_FILE_NAME, CSV_HEADER_KEYS } from '../../utility/constants';
import { getJSTDate } from '../../utility/date';
import { Logger } from '../../utility/logger';
import { RaceType } from '../../utility/raceType';
import { PlaceEntity } from '../entity/placeEntity';
import { SearchPlaceFilterEntity } from '../entity/searchPlaceFilterEntity';
import { IPlaceRepository } from '../interface/IPlaceRepository';

@injectable()
export class PlaceRepositoryFromStorageImpl
    implements IPlaceRepository<PlaceEntity>
{
    // S3にアップロードするファイル名
    private readonly placeFileName = CSV_FILE_NAME.PLACE_LIST;
    private readonly heldDayFileName = CSV_FILE_NAME.HELD_DAY_LIST;

    public constructor(
        @inject('S3Gateway')
        private readonly s3Gateway: IS3Gateway,
    ) {}

    /**
     * 開催データを取得する
     * このメソッドで日付の範囲を指定して開催データを取得する
     * @param searchFilter
     */
    @Logger
    public async fetchPlaceEntityList(
        searchFilter: SearchPlaceFilterEntity,
    ): Promise<PlaceEntity[]> {
        // 開催データを取得
        const placeRecordList: PlaceRecord[] =
            await this.getPlaceRecordListFromS3(searchFilter.raceType);

        if (
            searchFilter.raceType === RaceType.NAR ||
            searchFilter.raceType === RaceType.OVERSEAS
        ) {
            return placeRecordList
                .map((placeRecord) =>
                    PlaceEntity.create(
                        placeRecord.id,
                        PlaceData.create(
                            placeRecord.raceType,
                            placeRecord.dateTime,
                            placeRecord.location,
                        ),
                        undefined, // TODO: JRAの場合は開催日データを取得する必要がある
                        undefined, // grade は未指定
                        placeRecord.updateDate,
                    ),
                )
                .filter(
                    (placeEntity) =>
                        placeEntity.placeData.dateTime >=
                            searchFilter.startDate &&
                        placeEntity.placeData.dateTime <=
                            searchFilter.finishDate,
                );
        }

        const heldDayRecordList: HeldDayRecord[] =
            await this.getHeldDayRecordListFromS3(searchFilter.raceType);

        // placeRecordListのidと、heldDayRecordListのidが一致するものを取得
        const recordMap = new Map<
            string,
            {
                placeRecord: PlaceRecord;
                heldDayRecord: HeldDayRecord;
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

        // placeRecordをplaceEntityに変換
        const placeEntityList: PlaceEntity[] = [...recordMap.values()].map(
            ({ placeRecord, heldDayRecord: heldDayRecordItem }) => {
                return PlaceEntity.create(
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
                    undefined, // グレードは未指定
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
        placeEntityList: PlaceEntity[],
    ): Promise<{
        code: number;
        message: string;
        successData: PlaceEntity[];
        failureData: PlaceEntity[];
    }> {
        try {
            // 既に登録されているデータを取得する
            const existFetchPlaceRecordList: PlaceRecord[] =
                await this.getPlaceRecordListFromS3(raceType);

            const placeRecordList: PlaceRecord[] = placeEntityList.map(
                (placeEntity) =>
                    PlaceRecord.create(
                        placeEntity.id,
                        placeEntity.placeData.raceType,
                        placeEntity.placeData.dateTime,
                        placeEntity.placeData.location,
                        placeEntity.updateDate,
                    ),
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

            await this.s3Gateway.uploadDataToS3(
                existFetchPlaceRecordList,
                `${raceType.toLowerCase()}/`,
                this.placeFileName,
            );

            if (raceType === RaceType.JRA) {
                const existFetchHeldDayRecordList: HeldDayRecord[] =
                    await this.getHeldDayRecordListFromS3(raceType);

                const heldDayRecordList: HeldDayRecord[] = placeEntityList.map(
                    (placeEntity) =>
                        HeldDayRecord.create(
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

                await this.s3Gateway.uploadDataToS3(
                    existFetchHeldDayRecordList,
                    `${raceType.toLowerCase()}/`,
                    this.heldDayFileName,
                );
            }
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
        const csv = await this.s3Gateway.fetchDataFromS3(
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
            id: headers.indexOf(CSV_HEADER_KEYS.ID),
            dateTime: headers.indexOf(CSV_HEADER_KEYS.DATE_TIME),
            location: headers.indexOf(CSV_HEADER_KEYS.LOCATION),
            updateDate: headers.indexOf(CSV_HEADER_KEYS.UPDATE_DATE),
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
    ): Promise<HeldDayRecord[]> {
        // S3からデータを取得する
        const csv = await this.s3Gateway.fetchDataFromS3(
            `${raceType.toLowerCase()}/`,
            this.heldDayFileName,
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
            id: headers.indexOf(CSV_HEADER_KEYS.ID),
            raceType: headers.indexOf(CSV_HEADER_KEYS.RACE_TYPE),
            heldTimes: headers.indexOf(CSV_HEADER_KEYS.HELD_TIMES),
            heldDayTimes: headers.indexOf(CSV_HEADER_KEYS.HELD_DAY_TIMES),
            updateDate: headers.indexOf(CSV_HEADER_KEYS.UPDATE_DATE),
        };

        // データ行を解析して JraHeldDayRecord のリストを生成
        const heldDayRecordList: HeldDayRecord[] = lines
            .slice(1)
            .flatMap((line: string): HeldDayRecord[] => {
                try {
                    const columns = line.split(',');

                    const updateDate = columns[indices.updateDate]
                        ? new Date(columns[indices.updateDate])
                        : getJSTDate(new Date());

                    if (columns[indices.raceType] !== raceType) {
                        return [];
                    }

                    return [
                        HeldDayRecord.create(
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
