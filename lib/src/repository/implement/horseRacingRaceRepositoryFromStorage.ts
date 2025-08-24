import '../../utility/format';

import { inject, injectable } from 'tsyringe';

import { HeldDayData } from '../../domain/heldDayData';
import { HorseRaceConditionData } from '../../domain/houseRaceConditionData';
import { RaceData } from '../../domain/raceData';
import { IS3Gateway } from '../../gateway/interface/iS3Gateway';
import { HeldDayRecord } from '../../gateway/record/heldDayRecord';
import { HorseRacingRaceRecord } from '../../gateway/record/horseRacingRaceRecord';
import { CSV_FILE_NAME, CSV_HEADER_KEYS } from '../../utility/constants';
import { getJSTDate } from '../../utility/date';
import { Logger } from '../../utility/logger';
import { RaceType } from '../../utility/raceType';
import { RaceEntity } from '../entity/raceEntity';
import { SearchRaceFilterEntity } from '../entity/searchRaceFilterEntity';
import { IRaceRepository } from '../interface/IRaceRepository';

@injectable()
export class HorseRacingRaceRepositoryFromStorage implements IRaceRepository {
    private readonly raceFileName = CSV_FILE_NAME.RACE_LIST;
    private readonly heldDayFileName = CSV_FILE_NAME.HELD_DAY_LIST;

    public constructor(
        @inject('S3Gateway')
        private readonly s3Gateway: IS3Gateway,
    ) {}

    /**
     * 開催データを取得する
     * @param searchFilter
     */
    @Logger
    public async fetchRaceEntityList(
        searchFilter: SearchRaceFilterEntity,
    ): Promise<RaceEntity[]> {
        // ファイル名リストから開催データを取得する
        const raceRecordList: HorseRacingRaceRecord[] =
            await this.getRaceRecordListFromS3(searchFilter.raceType);

        if (
            searchFilter.raceType === RaceType.NAR ||
            searchFilter.raceType === RaceType.OVERSEAS
        ) {
            // フィルタリング処理（日付の範囲指定）
            return raceRecordList
                .map((raceRecord) =>
                    RaceEntity.create(
                        raceRecord.id,
                        RaceData.create(
                            raceRecord.raceType,
                            raceRecord.name,
                            raceRecord.dateTime,
                            raceRecord.location,
                            raceRecord.grade,
                            raceRecord.number,
                        ),
                        undefined,
                        HorseRaceConditionData.create(
                            raceRecord.surfaceType,
                            raceRecord.distance,
                        ),
                        undefined, // stage は未指定
                        undefined, // racePlayerDataList は未指定
                        raceRecord.updateDate,
                    ),
                )
                .filter(
                    (raceEntity) =>
                        raceEntity.raceData.dateTime >=
                            searchFilter.startDate &&
                        raceEntity.raceData.dateTime <= searchFilter.finishDate,
                );
        } else {
            const heldDayRecordList: HeldDayRecord[] =
                await this.getHeldDayRecordListFromS3(searchFilter.raceType);

            const recordMap = new Map<
                string,
                {
                    raceRecord: HorseRacingRaceRecord;
                    heldDayRecord: HeldDayRecord;
                }
            >();

            // 量を減らすために、日付の範囲でフィルタリング
            for (const raceRecord of raceRecordList.filter(
                (_raceRecord) =>
                    _raceRecord.dateTime >= searchFilter.startDate &&
                    _raceRecord.dateTime <= searchFilter.finishDate,
            )) {
                const heldDayRecordItem = heldDayRecordList.find(
                    // raceRecord.idの下2桁を切り離したものと、heldDayRecord.idを比較
                    (_heldDayRecord) =>
                        _heldDayRecord.id === raceRecord.id.slice(0, -2),
                );
                if (!heldDayRecordItem) {
                    // heldDayRecordが見つからない場合はスキップ
                    continue;
                }
                recordMap.set(raceRecord.id, {
                    raceRecord,
                    heldDayRecord: heldDayRecordItem,
                });
            }

            // RaceRecordをRaceEntityに変換
            const raceEntityList: RaceEntity[] = [...recordMap.values()].map(
                ({ raceRecord, heldDayRecord }) =>
                    RaceEntity.create(
                        raceRecord.id,
                        RaceData.create(
                            raceRecord.raceType,
                            raceRecord.name,
                            raceRecord.dateTime,
                            raceRecord.location,
                            raceRecord.grade,
                            raceRecord.number,
                        ),
                        HeldDayData.create(
                            heldDayRecord.heldTimes,
                            heldDayRecord.heldDayTimes,
                        ),
                        HorseRaceConditionData.create(
                            raceRecord.surfaceType,
                            raceRecord.distance,
                        ),
                        undefined, // stage は未指定
                        undefined, // racePlayerDataList は未指定
                        // raceRecordとheldDayRecordのupdateDateの早い方を使用
                        new Date(
                            Math.min(
                                raceRecord.updateDate.getTime(),
                                heldDayRecord.updateDate.getTime(),
                            ),
                        ),
                    ),
            );
            return raceEntityList;
        }
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
        const csv = await this.s3Gateway.fetchDataFromS3(
            `${raceType.toLowerCase()}/`,
            this.raceFileName,
        );

        // ファイルが空の場合は空のリストを返す
        if (!csv) {
            return [];
        }

        // CSVを行ごとに分割
        const lines = csv.split('\n');

        // ヘッダー行を解析
        const headers = lines[0].split('\r').join('').split(',');

        // ヘッダーに基づいてインデックスを取得
        const indices = {
            id: headers.indexOf(CSV_HEADER_KEYS.ID),
            name: headers.indexOf(CSV_HEADER_KEYS.NAME),
            dateTime: headers.indexOf(CSV_HEADER_KEYS.DATE_TIME),
            location: headers.indexOf(CSV_HEADER_KEYS.LOCATION),
            surfaceType: headers.indexOf(CSV_HEADER_KEYS.SURFACE_TYPE),
            distance: headers.indexOf(CSV_HEADER_KEYS.DISTANCE),
            grade: headers.indexOf(CSV_HEADER_KEYS.GRADE),
            number: headers.indexOf(CSV_HEADER_KEYS.NUMBER),
            updateDate: headers.indexOf(CSV_HEADER_KEYS.UPDATE_DATE),
        };

        // データ行を解析してRaceDataのリストを生成
        return lines
            .slice(1)
            .flatMap((line: string): HorseRacingRaceRecord[] => {
                try {
                    const columns = line.split('\r').join('').split(',');

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
     * レースデータを登録する
     * @param raceType - レース種別
     * @param raceEntityList
     */
    @Logger
    public async registerRaceEntityList(
        raceType: RaceType,
        raceEntityList: RaceEntity[],
    ): Promise<{
        code: number;
        message: string;
        successData: RaceEntity[];
        failureData: RaceEntity[];
    }> {
        try {
            // 既に登録されているデータを取得する
            const existFetchRaceRecordList: HorseRacingRaceRecord[] =
                await this.getRaceRecordListFromS3(raceType);

            // RaceEntityをRaceRecordに変換する
            const raceRecordList: HorseRacingRaceRecord[] = raceEntityList.map(
                (raceEntity) =>
                    HorseRacingRaceRecord.create(
                        raceEntity.id,
                        raceEntity.raceData.raceType,
                        raceEntity.raceData.name,
                        raceEntity.raceData.dateTime,
                        raceEntity.raceData.location,
                        raceEntity.conditionData.surfaceType,
                        raceEntity.conditionData.distance,
                        raceEntity.raceData.grade,
                        raceEntity.raceData.number,
                        raceEntity.updateDate,
                    ),
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

            await this.s3Gateway.uploadDataToS3(
                existFetchRaceRecordList,
                `${raceType.toLowerCase()}/`,
                this.raceFileName,
            );

            return {
                code: 200,
                message: 'Successfully registered race data',
                successData: raceEntityList,
                failureData: [],
            };
        } catch (error) {
            console.error(error);
            return {
                code: 500,
                message: 'Failed to register race data',
                successData: [],
                failureData: raceEntityList,
            };
        }
    }
}
