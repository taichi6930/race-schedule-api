import '../../utility/format';

import { inject, injectable } from 'tsyringe';

import { RaceType } from '../../../../src/utility/raceType';
import { IS3Gateway } from '../../gateway/interface/iS3Gateway';
import { HeldDayRecord } from '../../gateway/record/heldDayRecord';
import { PlaceGradeRecord } from '../../gateway/record/placeGradeRecord';
import { PlaceRecord } from '../../gateway/record/placeRecord';
import { CSV_FILE_NAME, CSV_HEADER_KEYS } from '../../utility/constants';
import { getJSTDate } from '../../utility/date';
import { Logger } from '../../utility/logger';
import { PlaceEntityForAWS } from '../entity/placeEntity';
import { SearchPlaceFilterEntityForAWS } from '../entity/searchPlaceFilterEntity';
import { IPlaceRepositoryForAWS } from '../interface/IPlaceRepository';

@injectable()
export class PlaceRepositoryFromStorageForAWS
    implements IPlaceRepositoryForAWS
{
    // S3にアップロードするファイル名
    private readonly placeFileName = CSV_FILE_NAME.PLACE_LIST;
    private readonly heldDayFileName = CSV_FILE_NAME.HELD_DAY_LIST;
    private readonly placeGradeFileName = CSV_FILE_NAME.GRADE_LIST;

    public constructor(
        @inject('S3Gateway')
        private readonly s3Gateway: IS3Gateway,
    ) {}

    // small helper: convert array of records with id to a Map for O(1) lookups
    private toIdMap<T extends { id: string }>(list: T[]): Map<string, T> {
        return new Map(list.map((item) => [item.id, item]));
    }

    /**
     * 開催データを取得する
     * このメソッドで日付の範囲を指定して開催データを取得する
     * @param searchFilter
     */
    @Logger
    public async fetchPlaceEntityList(
        searchFilter: SearchPlaceFilterEntityForAWS,
    ): Promise<PlaceEntityForAWS[]> {
        // 海外競馬はまだ対応していない
        if (searchFilter.raceType === RaceType.OVERSEAS) {
            return [];
        }
        // 開催データを取得
        const placeRecordList: PlaceRecord[] =
            await this.getPlaceRecordListFromS3(searchFilter.raceType);
        const filteredPlaceRecordList = placeRecordList.filter(
            (placeRecord) =>
                placeRecord.dateTime >= searchFilter.startDate &&
                placeRecord.dateTime <= searchFilter.finishDate,
        );

        switch (searchFilter.raceType) {
            case RaceType.JRA: {
                const heldDayRecordList: HeldDayRecord[] =
                    await this.getHeldDayRecordListFromS3(
                        searchFilter.raceType,
                    );

                // placeRecordListのidと、heldDayRecordListのidが一致するものを取得
                const heldDayMap = this.toIdMap(heldDayRecordList);

                // placeRecordをplaceEntityに変換
                const placeEntityList: PlaceEntityForAWS[] =
                    filteredPlaceRecordList
                        .map((placeRecord) => {
                            const heldDayRecordItem = heldDayMap.get(
                                placeRecord.id,
                            );
                            if (!heldDayRecordItem) return null;
                            return { placeRecord, heldDayRecordItem };
                        })
                        .filter(
                            (
                                v,
                            ): v is {
                                placeRecord: PlaceRecord;
                                heldDayRecordItem: HeldDayRecord;
                            } => v !== null,
                        )
                        .map(({ placeRecord, heldDayRecordItem }) => {
                            return PlaceEntityForAWS.create(
                                placeRecord.id,
                                placeRecord.toPlaceData(),
                                heldDayRecordItem.toHeldDayData(),
                                undefined, // グレードは未指定
                                // placeRecordとheldDayRecordのupdateDateの早い方を使用
                                new Date(
                                    Math.min(
                                        placeRecord.updateDate.getTime(),
                                        heldDayRecordItem.updateDate.getTime(),
                                    ),
                                ),
                            );
                        });
                return placeEntityList;
            }
            case RaceType.NAR: {
                return filteredPlaceRecordList.map((placeRecord) =>
                    PlaceEntityForAWS.create(
                        placeRecord.id,
                        placeRecord.toPlaceData(),
                        undefined,
                        undefined,
                        placeRecord.updateDate,
                    ),
                );
            }
            case RaceType.KEIRIN:
            case RaceType.AUTORACE:
            case RaceType.BOATRACE: {
                const placeGradeRecordList: PlaceGradeRecord[] =
                    await this.getPlaceGradeRecordListFromS3(
                        searchFilter.raceType,
                    );

                // placeRecordListのidと、placeRecordListのidが一致するものを取得
                const placeGradeMap = this.toIdMap(placeGradeRecordList);

                // raceEntityListに変換
                const placeEntityList: PlaceEntityForAWS[] =
                    filteredPlaceRecordList
                        .map((placeRecord) => {
                            const placeGradeRecord = placeGradeMap.get(
                                placeRecord.id,
                            );
                            if (!placeGradeRecord) return null;
                            return { placeRecord, placeGradeRecord };
                        })
                        .filter(
                            (
                                v,
                            ): v is {
                                placeRecord: PlaceRecord;
                                placeGradeRecord: PlaceGradeRecord;
                            } => v !== null,
                        )
                        .map(({ placeRecord, placeGradeRecord }) => {
                            return PlaceEntityForAWS.create(
                                placeRecord.id,
                                placeRecord.toPlaceData(),
                                undefined,
                                placeGradeRecord.grade,
                                // placeRecordとplaceRecordのupdateDateの早い方を使用
                                new Date(
                                    Math.min(
                                        placeRecord.updateDate.getTime(),
                                        placeGradeRecord.updateDate.getTime(),
                                    ),
                                ),
                            );
                        });
                return placeEntityList;
            }
        }
    }

    @Logger
    public async registerPlaceEntityList(
        raceType: RaceType,
        placeEntityList: PlaceEntityForAWS[],
    ): Promise<{
        code: number;
        message: string;
        successData: PlaceEntityForAWS[];
        failureData: PlaceEntityForAWS[];
    }> {
        if (raceType === RaceType.OVERSEAS) {
            return {
                code: 404,
                message: `Race type ${raceType} is not supported by this repository`,
                successData: [],
                failureData: placeEntityList,
            };
        }
        try {
            // 既に登録されているデータを取得する
            const existFetchPlaceRecordList: PlaceRecord[] =
                await this.getPlaceRecordListFromS3(raceType);

            const placeRecordList: PlaceRecord[] = placeEntityList.map(
                (placeEntity) => placeEntity.toPlaceRecord(),
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
                    (placeEntity) => placeEntity.toHeldDayRecord(),
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
            if (
                raceType === RaceType.KEIRIN ||
                raceType == RaceType.AUTORACE ||
                raceType === RaceType.BOATRACE
            ) {
                // 既に登録されているデータを取得する
                const existFetchPlaceGradeRecordList: PlaceGradeRecord[] =
                    await this.getPlaceGradeRecordListFromS3(raceType);

                // PlaceEntityをPlaceRecordに変換する
                const placeGradeRecordList: PlaceGradeRecord[] =
                    placeEntityList.map((placeEntity) =>
                        placeEntity.toPlaceGradeRecord(),
                    );

                // idが重複しているデータは上書きをし、新規のデータは追加する
                for (const placeGradeRecord of placeGradeRecordList) {
                    // 既に登録されているデータがある場合は上書きする
                    const index = existFetchPlaceGradeRecordList.findIndex(
                        (record) => record.id === placeGradeRecord.id,
                    );
                    if (index === -1) {
                        existFetchPlaceGradeRecordList.push(placeGradeRecord);
                    } else {
                        existFetchPlaceGradeRecordList[index] =
                            placeGradeRecord;
                    }
                }

                // 日付の最新順にソート
                existFetchPlaceGradeRecordList.sort(
                    (a, b) => b.updateDate.getTime() - a.updateDate.getTime(),
                );

                await this.s3Gateway.uploadDataToS3(
                    existFetchPlaceGradeRecordList,
                    `${raceType.toLowerCase()}/`,
                    this.placeGradeFileName,
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

        // データ行を解析して HeldDayRecord のリストを生成
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

    /**
     * 開催場データをS3から取得する
     * @param raceType - レース種別
     */
    @Logger
    private async getPlaceGradeRecordListFromS3(
        raceType: RaceType,
    ): Promise<PlaceGradeRecord[]> {
        // S3からデータを取得する
        const csv = await this.s3Gateway.fetchDataFromS3(
            `${raceType.toLowerCase()}/`,
            this.placeGradeFileName,
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
            grade: headers.indexOf(CSV_HEADER_KEYS.GRADE),
            updateDate: headers.indexOf(CSV_HEADER_KEYS.UPDATE_DATE),
        };

        // データ行を解析して PlaceGradeRecord のリストを生成
        const placeGradeRecordList: PlaceGradeRecord[] = lines
            .slice(1)
            .flatMap((line: string): PlaceGradeRecord[] => {
                try {
                    const columns = line.split(',');

                    const updateDate = columns[indices.updateDate]
                        ? new Date(columns[indices.updateDate])
                        : getJSTDate(new Date());

                    if (columns[indices.raceType] !== raceType) {
                        return [];
                    }

                    return [
                        PlaceGradeRecord.create(
                            columns[indices.id],
                            raceType,
                            columns[indices.grade],
                            updateDate,
                        ),
                    ];
                } catch (error) {
                    console.error(error);
                    return [];
                }
            });
        return placeGradeRecordList;
    }
}
