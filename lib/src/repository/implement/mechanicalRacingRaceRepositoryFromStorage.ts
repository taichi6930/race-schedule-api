import 'reflect-metadata';

import { inject, injectable } from 'tsyringe';

import { RacePlayerData } from '../../domain/racePlayerData';
import { IS3Gateway } from '../../gateway/interface/iS3Gateway';
import { MechanicalRacingRaceRecord } from '../../gateway/record/mechanicalRacingRaceRecord';
import { RacePlayerRecord } from '../../gateway/record/racePlayerRecord';
import { CSV_FILE_NAME, CSV_HEADER_KEYS } from '../../utility/constants';
import { getJSTDate } from '../../utility/date';
import { Logger } from '../../utility/logger';
import { RaceType } from '../../utility/raceType';
import { RaceEntity } from '../entity/raceEntity';
import { SearchRaceFilterEntity } from '../entity/searchRaceFilterEntity';
import { IRaceRepository } from '../interface/IRaceRepository';

/**
 * 開催データリポジトリの実装
 */
@injectable()
export class MechanicalRacingRaceRepositoryFromStorage
    implements IRaceRepository
{
    private readonly raceListFileName = CSV_FILE_NAME.RACE_LIST;
    private readonly racePlayerListFileName = CSV_FILE_NAME.RACE_PLAYER_LIST;

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
        // ファイル名リストから選手データを取得する
        const racePlayerRecordList: RacePlayerRecord[] =
            await this.getRacePlayerRecordListFromS3(
                searchFilter.raceType,
                searchFilter.startDate,
            );

        // レースデータを取得する
        const raceRaceRecordList: MechanicalRacingRaceRecord[] =
            await this.getRaceRecordListFromS3(
                searchFilter.raceType,
                searchFilter.startDate,
            );
        const filteredRaceRecordList = raceRaceRecordList.filter(
            (raceRecord) =>
                raceRecord.dateTime >= searchFilter.startDate &&
                raceRecord.dateTime <= searchFilter.finishDate,
        );

        // RaceEntityに変換
        const raceEntityList: RaceEntity[] = filteredRaceRecordList.map(
            (raceRecord) => {
                // raceIdに対応したracePlayerRecordListを取得
                const filteredRacePlayerRecordList: RacePlayerRecord[] =
                    racePlayerRecordList.filter((racePlayerRecord) => {
                        return racePlayerRecord.raceId === raceRecord.id;
                    });
                // RacePlayerDataのリストを生成
                const racePlayerDataList: RacePlayerData[] =
                    filteredRacePlayerRecordList.map((racePlayerRecord) =>
                        racePlayerRecord.toRacePlayerData(),
                    );
                return RaceEntity.create(
                    raceRecord.id,
                    raceRecord.toRaceData(),
                    undefined, // heldDayDataは未設定
                    undefined, // conditionDataは未設定
                    raceRecord.stage,
                    racePlayerDataList,
                    raceRecord.updateDate,
                );
            },
        );
        return raceEntityList;
    }

    /**
     * レースデータを登録する
     * @param raceType - レース種別
     * @param raceEntityList - 登録するレースエンティティ配列
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
            await this.registerRaceRecordList(raceType, raceEntityList);
            await this.registerRacePlayerRecordList(raceType, raceEntityList);

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

    private async registerRaceRecordList(
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
            const existFetchRaceRecordList: MechanicalRacingRaceRecord[] =
                await this.getRaceRecordListFromS3(raceType);

            // RaceEntityをRaceRecordに変換する
            const raceRecordList: MechanicalRacingRaceRecord[] =
                raceEntityList.map((raceEntity) =>
                    raceEntity.toMechanicalRacingRaceRecord(),
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
            // 日付の最新順にソート
            existFetchRaceRecordList.sort(
                (a, b) => b.dateTime.getTime() - a.dateTime.getTime(),
            );

            // raceDataをS3にアップロードする
            await this.s3Gateway.uploadDataToS3(
                existFetchRaceRecordList,
                `${raceType.toLowerCase()}/`,
                this.raceListFileName,
            );
            return {
                code: 200,
                message: 'Successfully registered raceRecord',
                successData: raceEntityList,
                failureData: [],
            };
        } catch (error) {
            console.error(error);
            return {
                code: 500,
                message: 'Failed to register raceRecord',
                successData: [],
                failureData: raceEntityList,
            };
        }
    }

    private async registerRacePlayerRecordList(
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
            const existFetchRacePlayerRecordList: RacePlayerRecord[] =
                await this.getRacePlayerRecordListFromS3(raceType);

            // RaceEntityをRacePlayerRecordに変換する
            const racePlayerRecordList = raceEntityList.flatMap((raceEntity) =>
                raceEntity.toPlayerRecordList(),
            );

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
            existFetchRacePlayerRecordList.sort((a, b) => {
                const aDateTimeStr = Number.parseInt(
                    a.id.substring(raceType.length),
                    10,
                );
                const bDateTimeStr = Number.parseInt(
                    b.id.substring(raceType.length),
                    10,
                );
                return bDateTimeStr - aDateTimeStr;
            });

            // raceDataをS3にアップロードする
            await this.s3Gateway.uploadDataToS3(
                existFetchRacePlayerRecordList,
                `${raceType.toLowerCase()}/`,
                this.racePlayerListFileName,
            );

            return {
                code: 200,
                message: 'Successfully registered racePlayerRecord',
                successData: raceEntityList,
                failureData: [],
            };
        } catch (error) {
            console.error(error);
            return {
                code: 500,
                message: 'Failed to register racePlayerRecord',
                successData: [],
                failureData: raceEntityList,
            };
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
    ): Promise<MechanicalRacingRaceRecord[]> {
        // S3からデータを取得する
        const csv = await this.s3Gateway.fetchDataFromS3(
            `${raceType.toLowerCase()}/`,
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
            id: headers.indexOf(CSV_HEADER_KEYS.ID),
            name: headers.indexOf(CSV_HEADER_KEYS.NAME),
            stage: headers.indexOf(CSV_HEADER_KEYS.STAGE),
            dateTime: headers.indexOf(CSV_HEADER_KEYS.DATE_TIME),
            location: headers.indexOf(CSV_HEADER_KEYS.LOCATION),
            grade: headers.indexOf(CSV_HEADER_KEYS.GRADE),
            number: headers.indexOf(CSV_HEADER_KEYS.NUMBER),
            updateDate: headers.indexOf(CSV_HEADER_KEYS.UPDATE_DATE),
        };

        // データ行を解析してRaceDataのリストを生成
        const result: MechanicalRacingRaceRecord[] = [];
        for (const line of lines.slice(1)) {
            try {
                const columns = line.split(',');
                const dateTime = new Date(columns[indices.dateTime]);
                if (borderDate && borderDate > dateTime) {
                    console.log(
                        'borderDateより前のデータはスキップします',
                        dateTime,
                    );
                    break;
                }
                const updateDate = columns[indices.updateDate]
                    ? new Date(columns[indices.updateDate])
                    : getJSTDate(new Date());

                result.push(
                    MechanicalRacingRaceRecord.create(
                        columns[indices.id],
                        raceType,
                        columns[indices.name],
                        columns[indices.stage],
                        dateTime,
                        columns[indices.location],
                        columns[indices.grade],
                        Number.parseInt(columns[indices.number]),
                        updateDate,
                    ),
                );
            } catch (error) {
                console.error('RaceRecord create error', error);
                // continue
            }
        }
        return result;
    }

    /**
     * レースプレイヤーデータをS3から取得する
     * @param raceType - レース種別
     * @param borderDate
     */
    @Logger
    private async getRacePlayerRecordListFromS3(
        raceType: RaceType,
        borderDate?: Date,
    ): Promise<RacePlayerRecord[]> {
        // S3からデータを取得する
        const csv = await this.s3Gateway.fetchDataFromS3(
            `${raceType.toLowerCase()}/`,
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
            id: headers.indexOf(CSV_HEADER_KEYS.ID),
            raceId: headers.indexOf(CSV_HEADER_KEYS.RACE_ID),
            positionNumber: headers.indexOf(CSV_HEADER_KEYS.POSITION_NUMBER),
            playerNumber: headers.indexOf(CSV_HEADER_KEYS.PLAYER_NUMBER),
            updateDate: headers.indexOf(CSV_HEADER_KEYS.UPDATE_DATE),
        };

        // データ行を解析してRaceDataのリストを生成
        const racePlayerRecordList: RacePlayerRecord[] = [];
        for (const line of lines.slice(1)) {
            try {
                const columns = line.split(',');
                const dateTimeStr = columns[indices.id].substring(
                    raceType.length,
                    raceType.length + 8,
                );
                const dateTime = new Date(
                    `${dateTimeStr.substring(0, 4)}-${dateTimeStr.substring(4, 6)}-${dateTimeStr.substring(6, 8)}`,
                );
                if (borderDate && borderDate > dateTime) {
                    // borderDateより前のデータはスキップ
                    break;
                }
                const updateDate = columns[indices.updateDate]
                    ? new Date(columns[indices.updateDate])
                    : getJSTDate(new Date());

                racePlayerRecordList.push(
                    RacePlayerRecord.create(
                        columns[indices.id],
                        raceType,
                        columns[indices.raceId],
                        Number.parseInt(columns[indices.positionNumber]),
                        Number.parseInt(columns[indices.playerNumber]),
                        updateDate,
                    ),
                );
            } catch (error) {
                console.error('RacePlayerRecord create error', error);
                // continue
            }
        }
        return racePlayerRecordList;
    }
}
