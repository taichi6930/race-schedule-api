import 'reflect-metadata';

import { inject, injectable } from 'tsyringe';

import { RaceData } from '../../domain/raceData';
import { RacePlayerData } from '../../domain/racePlayerData';
import { IS3Gateway } from '../../gateway/interface/iS3Gateway';
import { MechanicalRacingRaceRecord } from '../../gateway/record/mechanicalRacingRaceRecord';
import { RacePlayerRecord } from '../../gateway/record/racePlayerRecord';
import { CSV_FILE_NAME, CSV_HEADER_KEYS } from '../../utility/constants';
import { getJSTDate } from '../../utility/date';
import { Logger } from '../../utility/logger';
import { RaceType } from '../../utility/raceType';
import { MechanicalRacingPlaceEntity } from '../entity/mechanicalRacingPlaceEntity';
import { MechanicalRacingRaceEntity } from '../entity/mechanicalRacingRaceEntity';
import { SearchRaceFilterEntity } from '../entity/searchRaceFilterEntity';
import { IRaceRepository } from '../interface/IRaceRepository';

/**
 * 競輪場開催データリポジトリの実装
 */
@injectable()
export class MechanicalRacingRaceRepositoryFromStorageImpl
    implements
        IRaceRepository<MechanicalRacingRaceEntity, MechanicalRacingPlaceEntity>
{
    private readonly raceListFileName = CSV_FILE_NAME.RACE_LIST;
    private readonly racePlayerListFileName = CSV_FILE_NAME.RACE_PLAYER_LIST;

    public constructor(
        @inject('MechanicalRacingRaceS3Gateway')
        private readonly raceS3Gateway: IS3Gateway,
        @inject('MechanicalRacingRacePlayerS3Gateway')
        private readonly racePlayerS3Gateway: IS3Gateway,
    ) {}

    /**
     * 開催データを取得する
     * @param searchFilter
     */
    @Logger
    public async fetchRaceEntityList(
        searchFilter: SearchRaceFilterEntity<MechanicalRacingPlaceEntity>,
    ): Promise<MechanicalRacingRaceEntity[]> {
        // ファイル名リストから選手データを取得する
        const racePlayerRecordList: RacePlayerRecord[] =
            await this.getRacePlayerRecordListFromS3(searchFilter.raceType);

        // レースデータを取得する
        const raceRaceRecordList: MechanicalRacingRaceRecord[] =
            await this.getRaceRecordListFromS3(
                searchFilter.raceType,
                searchFilter.startDate,
            );

        // RaceEntityに変換
        const raceEntityList: MechanicalRacingRaceEntity[] =
            raceRaceRecordList.map((raceRecord) => {
                // raceIdに対応したracePlayerRecordListを取得
                const filteredRacePlayerRecordList: RacePlayerRecord[] =
                    racePlayerRecordList.filter((racePlayerRecord) => {
                        return racePlayerRecord.raceId === raceRecord.id;
                    });
                // RacePlayerDataのリストを生成
                const racePlayerDataList: RacePlayerData[] =
                    filteredRacePlayerRecordList.map((racePlayerRecord) => {
                        return RacePlayerData.create(
                            searchFilter.raceType,
                            racePlayerRecord.positionNumber,
                            racePlayerRecord.playerNumber,
                        );
                    });
                // RaceDataを生成
                const raceData = RaceData.create(
                    searchFilter.raceType,
                    raceRecord.name,
                    raceRecord.dateTime,
                    raceRecord.location,
                    raceRecord.grade,
                    raceRecord.number,
                );
                return MechanicalRacingRaceEntity.create(
                    raceRecord.id,
                    raceData,
                    raceRecord.stage,
                    racePlayerDataList,
                    raceRecord.updateDate,
                );
            });
        // フィルタリング処理（日付の範囲指定）
        const filteredRaceEntityList: MechanicalRacingRaceEntity[] =
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
        raceEntityList: MechanicalRacingRaceEntity[],
    ): Promise<{
        code: number;
        message: string;
        successData: MechanicalRacingRaceEntity[];
        failureData: MechanicalRacingRaceEntity[];
    }> {
        try {
            // 既に登録されているデータを取得する
            const existFetchRaceRecordList: MechanicalRacingRaceRecord[] =
                await this.getRaceRecordListFromS3(raceType);

            const existFetchRacePlayerRecordList: RacePlayerRecord[] =
                await this.getRacePlayerRecordListFromS3(raceType);

            // RaceEntityをRaceRecordに変換する
            const raceRecordList: MechanicalRacingRaceRecord[] =
                raceEntityList.map((raceEntity) => raceEntity.toRaceRecord());

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
                `${raceType.toLowerCase()}/`,
                this.raceListFileName,
            );
            await this.racePlayerS3Gateway.uploadDataToS3(
                existFetchRacePlayerRecordList,
                `${raceType.toLowerCase()}/`,
                this.racePlayerListFileName,
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
        const csv = await this.raceS3Gateway.fetchDataFromS3(
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
     */
    @Logger
    private async getRacePlayerRecordListFromS3(
        raceType: RaceType,
    ): Promise<RacePlayerRecord[]> {
        // S3からデータを取得する
        const csv = await this.racePlayerS3Gateway.fetchDataFromS3(
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

        // データ行を解析してKeirinRaceDataのリストを生成
        const keirinRacePlayerRecordList: RacePlayerRecord[] = lines
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
                            raceType,
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
        return keirinRacePlayerRecordList;
    }
}
