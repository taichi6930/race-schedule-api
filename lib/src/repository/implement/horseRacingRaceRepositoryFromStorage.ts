import '../../utility/format';

import { parse } from 'csv-parse/sync';
import { inject, injectable } from 'tsyringe';

import { RaceType } from '../../../../src/utility/raceType';
import { IS3Gateway } from '../../gateway/interface/iS3Gateway';
import { HeldDayRecord } from '../../gateway/record/heldDayRecord';
import { HorseRacingRaceRecord } from '../../gateway/record/horseRacingRaceRecord';
import { CSV_FILE_NAME, CSV_HEADER_KEYS } from '../../utility/constants';
import { getJSTDate } from '../../utility/date';
import { Logger } from '../../utility/logger';
import { RaceEntityForAWS } from '../entity/raceEntity';
import { SearchRaceFilterEntityForAWS } from '../entity/searchRaceFilterEntity';
import { IRaceRepositoryForAWS } from '../interface/IRaceRepository';

@injectable()
export class HorseRacingRaceRepositoryFromStorage
    implements IRaceRepositoryForAWS
{
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
        searchFilter: SearchRaceFilterEntityForAWS,
    ): Promise<RaceEntityForAWS[]> {
        // ファイル名リストから開催データを取得する
        const raceRecordList: HorseRacingRaceRecord[] =
            await this.getRaceRecordListFromS3(
                searchFilter.raceType,
                searchFilter.startDate,
            );
        const filteredRaceRecordList = raceRecordList.filter(
            (raceRecord) =>
                raceRecord.dateTime >= searchFilter.startDate &&
                raceRecord.dateTime <= searchFilter.finishDate,
        );

        if (
            searchFilter.raceType === RaceType.NAR ||
            searchFilter.raceType === RaceType.OVERSEAS
        ) {
            // フィルタリング処理（日付の範囲指定）
            return filteredRaceRecordList.map((raceRecord) =>
                RaceEntityForAWS.create(
                    raceRecord.id,
                    raceRecord.toRaceData(),
                    undefined,
                    raceRecord.toHorseRaceConditionData(),
                    undefined, // stage は未指定
                    undefined, // racePlayerDataList は未指定
                    raceRecord.updateDate,
                ),
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
            for (const raceRecord of filteredRaceRecordList) {
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
            const raceEntityList: RaceEntityForAWS[] = [
                ...recordMap.values(),
            ].map(({ raceRecord, heldDayRecord }) =>
                RaceEntityForAWS.create(
                    raceRecord.id,
                    raceRecord.toRaceData(),
                    heldDayRecord.toHeldDayData(),
                    raceRecord.toHorseRaceConditionData(),
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
     * @param borderDate
     */
    @Logger
    private async getRaceRecordListFromS3(
        raceType: RaceType,
        borderDate?: Date,
    ): Promise<HorseRacingRaceRecord[]> {
        // S3からデータを取得する
        const csv = await this.s3Gateway.fetchDataFromS3(
            `${raceType.toLowerCase()}/`,
            this.raceFileName,
        );

        if (!csv) {
            return [];
        }

        // csv-parseでパース
        const records: Record<string, string>[] = parse(csv, {
            columns: true,
            skip_empty_lines: true,
            relax_column_count: true,
        });
        const result: HorseRacingRaceRecord[] = records
            .map((row) => {
                try {
                    const dateTime = new Date(row[CSV_HEADER_KEYS.DATE_TIME]);
                    if (borderDate && borderDate > dateTime) {
                        // borderDateより前のデータはスキップ
                        return undefined;
                    }
                    const updateDate = row[CSV_HEADER_KEYS.UPDATE_DATE]
                        ? new Date(row[CSV_HEADER_KEYS.UPDATE_DATE])
                        : getJSTDate(new Date());
                    return HorseRacingRaceRecord.create(
                        row[CSV_HEADER_KEYS.ID],
                        raceType,
                        row[CSV_HEADER_KEYS.NAME],
                        dateTime,
                        row[CSV_HEADER_KEYS.LOCATION],
                        row[CSV_HEADER_KEYS.SURFACE_TYPE],
                        Number.parseInt(row[CSV_HEADER_KEYS.DISTANCE]),
                        row[CSV_HEADER_KEYS.GRADE],
                        Number.parseInt(row[CSV_HEADER_KEYS.NUMBER]),
                        updateDate,
                    );
                } catch (error) {
                    console.error(error);
                    return undefined;
                }
            })
            .filter((v): v is HorseRacingRaceRecord => v !== undefined);
        return result;
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

        if (!csv) {
            return [];
        }

        // csv-parseでパース
        const records: Record<string, string>[] = parse(csv, {
            columns: true,
            skip_empty_lines: true,
            relax_column_count: true,
        });
        const heldDayRecordList: HeldDayRecord[] = records
            .map((row) => {
                try {
                    if (row[CSV_HEADER_KEYS.RACE_TYPE] !== raceType) {
                        return undefined;
                    }
                    const updateDate = row[CSV_HEADER_KEYS.UPDATE_DATE]
                        ? new Date(row[CSV_HEADER_KEYS.UPDATE_DATE])
                        : getJSTDate(new Date());
                    return HeldDayRecord.create(
                        row[CSV_HEADER_KEYS.ID],
                        raceType,
                        Number.parseInt(row[CSV_HEADER_KEYS.HELD_TIMES], 10),
                        Number.parseInt(
                            row[CSV_HEADER_KEYS.HELD_DAY_TIMES],
                            10,
                        ),
                        updateDate,
                    );
                } catch (error) {
                    console.error(error);
                    return undefined;
                }
            })
            .filter((v): v is HeldDayRecord => v !== undefined);
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
        raceEntityList: RaceEntityForAWS[],
    ): Promise<{
        code: number;
        message: string;
        successData: RaceEntityForAWS[];
        failureData: RaceEntityForAWS[];
    }> {
        try {
            // 既に登録されているデータを取得する
            const existFetchRaceRecordList: HorseRacingRaceRecord[] =
                await this.getRaceRecordListFromS3(raceType);

            // RaceEntityをRaceRecordに変換する
            const raceRecordList: HorseRacingRaceRecord[] = raceEntityList.map(
                (raceEntity) => raceEntity.toHorseRacingRaceRecord(),
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
