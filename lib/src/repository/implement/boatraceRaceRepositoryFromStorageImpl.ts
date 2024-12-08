import 'reflect-metadata';

import { format } from 'date-fns';
import { inject, injectable } from 'tsyringe';

import { BoatraceRaceData } from '../../domain/boatraceRaceData';
import { BoatraceRacePlayerData } from '../../domain/boatraceRacePlayerData';
import { IS3Gateway } from '../../gateway/interface/iS3Gateway';
import { BoatraceRacePlayerRecord } from '../../gateway/record/boatraceRacePlayerRecord';
import { BoatraceRaceRecord } from '../../gateway/record/boatraceRaceRecord';
import {
    BoatraceGradeType,
    BoatraceRaceCourse,
    BoatraceRaceStage,
} from '../../utility/data/boatrace';
import { Logger } from '../../utility/logger';
import {
    BoatraceRaceId,
    BoatraceRacePlayerId,
    generateBoatraceRacePlayerId,
} from '../../utility/raceId';
import { BoatracePlaceEntity } from '../entity/boatracePlaceEntity';
import { BoatraceRaceEntity } from '../entity/boatraceRaceEntity';
import { IRaceRepository } from '../interface/IRaceRepository';
import { FetchRaceListRequest } from '../request/fetchRaceListRequest';
import { RegisterRaceListRequest } from '../request/registerRaceListRequest';
import { FetchRaceListResponse } from '../response/fetchRaceListResponse';
import { RegisterRaceListResponse } from '../response/registerRaceListResponse';

/**
 * ボートレース場開催データリポジトリの実装
 */
@injectable()
export class BoatraceRaceRepositoryFromStorageImpl
    implements IRaceRepository<BoatraceRaceEntity, BoatracePlaceEntity>
{
    private readonly fileName = 'raceList.csv';

    constructor(
        @inject('BoatraceRaceS3Gateway')
        private readonly raceS3Gateway: IS3Gateway<BoatraceRaceRecord>,
        @inject('BoatraceRacePlayerS3Gateway')
        private readonly racePlayerS3Gateway: IS3Gateway<BoatraceRacePlayerRecord>,
    ) {}
    /**
     * ボートレース場開催データを取得する
     * @param request
     * @returns
     */
    @Logger
    async fetchRaceEntityList(
        request: FetchRaceListRequest<BoatracePlaceEntity>,
    ): Promise<FetchRaceListResponse<BoatraceRaceEntity>> {
        // ファイル名リストからボートレース選手データを取得する
        const racePlayerRecordList: BoatraceRacePlayerRecord[] =
            await this.getRacePlayerRecordListFromS3(
                request.startDate,
                request.finishDate,
            );

        // ボートレースデータを取得する
        const raceRaceRecordList: BoatraceRaceRecord[] =
            await this.getRaceRecordListFromS3();

        // ボートレースデータをBoatraceRaceEntityに変換
        const raceEntityList: BoatraceRaceEntity[] = raceRaceRecordList.map(
            (raceRecord) => {
                // raceIdに対応したracePlayerRecordListを取得
                const filteredRacePlayerRecordList: BoatraceRacePlayerRecord[] =
                    racePlayerRecordList.filter((racePlayerRecord) => {
                        return racePlayerRecord.raceId === raceRecord.id;
                    });
                // BoatraceRacePlayerDataのリストを生成
                const racePlayerDataList: BoatraceRacePlayerData[] =
                    filteredRacePlayerRecordList.map((racePlayerRecord) => {
                        return new BoatraceRacePlayerData(
                            racePlayerRecord.positionNumber,
                            racePlayerRecord.playerNumber,
                        );
                    });
                // BoatraceRaceDataを生成
                const raceData = new BoatraceRaceData(
                    raceRecord.name,
                    raceRecord.stage,
                    raceRecord.dateTime,
                    raceRecord.location,
                    raceRecord.grade,
                    raceRecord.number,
                );
                return new BoatraceRaceEntity(
                    raceRecord.id,
                    raceData,
                    racePlayerDataList,
                );
            },
        );

        return new FetchRaceListResponse(raceEntityList);
    }

    /**
     * startDateからfinishDateまでの日付ごとのファイル名リストを生成する
     * @param startDate
     * @param finishDate
     * @returns
     */
    private generateFilenameList(startDate: Date, finishDate: Date): string[] {
        const fileNameList: string[] = [];
        const currentDate = new Date(startDate);
        while (currentDate <= finishDate) {
            const fileName = `${format(currentDate, 'yyyyMMdd')}.csv`;
            fileNameList.push(fileName);
            currentDate.setDate(currentDate.getDate() + 1);
        }
        return fileNameList;
    }

    /**
     * レースデータを登録する
     * @param request
     */
    @Logger
    async registerRaceEntityList(
        request: RegisterRaceListRequest<BoatraceRaceEntity>,
    ): Promise<RegisterRaceListResponse> {
        const raceEntityList: BoatraceRaceEntity[] = request.raceEntityList;
        // レースデータを日付ごとに分割する
        const raceRecordDict: Record<string, BoatraceRaceRecord[]> = {};
        raceEntityList.forEach((raceEntity) => {
            const raceRecord = new BoatraceRaceRecord(
                raceEntity.id,
                raceEntity.raceData.name,
                raceEntity.raceData.stage,
                raceEntity.raceData.dateTime,
                raceEntity.raceData.location,
                raceEntity.raceData.grade,
                raceEntity.raceData.number,
            );
            const key = `${format(raceRecord.dateTime, 'yyyyMMdd')}.csv`;
            if (!(key in raceRecordDict)) {
                raceRecordDict[key] = [];
            }
            raceRecordDict[key].push(raceRecord);
        });

        // 月毎に分けられたplaceをS3にアップロードする
        for (const [fileName, raceRecord] of Object.entries(raceRecordDict)) {
            await this.raceS3Gateway.uploadDataToS3(raceRecord, fileName);
        }

        const racePlayerRecordDict: Record<string, BoatraceRacePlayerRecord[]> =
            {};
        raceEntityList.forEach((raceEntity) => {
            const racePlayerRecordList = raceEntity.racePlayerDataList.map(
                (racePlayerData) => {
                    return new BoatraceRacePlayerRecord(
                        generateBoatraceRacePlayerId(
                            raceEntity.raceData.dateTime,
                            raceEntity.raceData.location,
                            raceEntity.raceData.number,
                            racePlayerData.positionNumber,
                        ),
                        raceEntity.id,
                        racePlayerData.positionNumber,
                        racePlayerData.playerNumber,
                    );
                },
            );
            const key = `${format(raceEntity.raceData.dateTime, 'yyyyMMdd')}.csv`;
            if (!(key in racePlayerRecordDict)) {
                racePlayerRecordDict[key] = [];
            }
            racePlayerRecordList.forEach((racePlayerRecord) => {
                racePlayerRecordDict[key].push(racePlayerRecord);
            });
        });
        // 月毎に分けられたplaceをS3にアップロードする
        for (const [fileName, racePlayerRecord] of Object.entries(
            racePlayerRecordDict,
        )) {
            await this.racePlayerS3Gateway.uploadDataToS3(
                racePlayerRecord,
                fileName,
            );
        }
        return new RegisterRaceListResponse(200);
    }

    /**
     * レースデータをS3から取得する
     * @param request
     */
    @Logger
    private async getRaceRecordListFromS3(): Promise<BoatraceRaceRecord[]> {
        // S3からデータを取得する
        const csv = await this.raceS3Gateway.fetchDataFromS3(this.fileName);

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
        };

        // データ行を解析してRaceDataのリストを生成
        return lines
            .slice(1)
            .map((line: string) => {
                const columns = line.split(',');

                // 必要なフィールドが存在しない場合はundefinedを返す
                if (
                    !columns[indices.name] ||
                    isNaN(parseInt(columns[indices.number]))
                ) {
                    return undefined;
                }

                return new BoatraceRaceRecord(
                    columns[indices.id] as BoatraceRaceId,
                    columns[indices.name],
                    columns[indices.stage] as BoatraceRaceStage,
                    new Date(columns[indices.dateTime]),
                    columns[indices.location] as BoatraceRaceCourse,
                    columns[indices.grade] as BoatraceGradeType,
                    parseInt(columns[indices.number]),
                );
            })
            .filter(
                (raceData): raceData is BoatraceRaceRecord =>
                    raceData !== undefined,
            )
            .filter(
                (raceData, index, self): raceData is BoatraceRaceRecord =>
                    self.findIndex((data) => data.id === raceData.id) === index,
            );
    }

    /**
     * レースプレイヤーデータをS3から取得する
     * @param request
     */
    @Logger
    private async getRacePlayerRecordListFromS3(
        startDate: Date,
        finishDate: Date,
    ): Promise<BoatraceRacePlayerRecord[]> {
        // startDateからfinishDateまでの日付ごとのファイル名リストを生成する
        const fileNameList: string[] = this.generateFilenameList(
            startDate,
            finishDate,
        );
        return (
            await Promise.all(
                fileNameList.map(async (fileName) => {
                    // S3からデータを取得する
                    const csv =
                        await this.racePlayerS3Gateway.fetchDataFromS3(
                            fileName,
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
                    };

                    // データ行を解析してBoatraceRaceDataのリストを生成
                    return lines
                        .slice(1)
                        .map((line: string) => {
                            const columns = line.split(',');

                            // 必要なフィールドが存在しない場合はundefinedを返す
                            if (
                                !columns[indices.id] ||
                                !columns[indices.raceId] ||
                                isNaN(
                                    parseInt(columns[indices.positionNumber]),
                                ) ||
                                isNaN(parseInt(columns[indices.playerNumber]))
                            ) {
                                return undefined;
                            }

                            return new BoatraceRacePlayerRecord(
                                columns[indices.id] as BoatraceRacePlayerId,
                                columns[indices.raceId] as BoatraceRaceId,
                                parseInt(columns[indices.positionNumber]),
                                parseInt(columns[indices.playerNumber]),
                            );
                        })
                        .filter(
                            (
                                racePlayerRecord,
                            ): racePlayerRecord is BoatraceRacePlayerRecord =>
                                racePlayerRecord !== undefined,
                        );
                }),
            )
        ).flat();
    }
}
