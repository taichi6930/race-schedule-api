import 'reflect-metadata';

import { format } from 'date-fns';
import { inject, injectable } from 'tsyringe';

import { AutoraceRaceData } from '../../domain/autoraceRaceData';
import { AutoraceRacePlayerData } from '../../domain/autoraceRacePlayerData';
import { IS3Gateway } from '../../gateway/interface/iS3Gateway';
import { AutoraceRacePlayerRecord } from '../../gateway/record/autoraceRacePlayerRecord';
import { AutoraceRaceRecord } from '../../gateway/record/autoraceRaceRecord';
import {
    AutoraceGradeType,
    AutoraceRaceCourse,
    AutoraceRaceStage,
} from '../../utility/data/autorace';
import { Logger } from '../../utility/logger';
import {
    AutoraceRaceId,
    AutoraceRacePlayerId,
    generateAutoraceRacePlayerId,
} from '../../utility/raceId';
import { AutoracePlaceEntity } from '../entity/autoracePlaceEntity';
import { AutoraceRaceEntity } from '../entity/autoraceRaceEntity';
import { IRaceRepository } from '../interface/IRaceRepository';
import { FetchRaceListRequest } from '../request/fetchRaceListRequest';
import { RegisterRaceListRequest } from '../request/registerRaceListRequest';
import { FetchRaceListResponse } from '../response/fetchRaceListResponse';
import { RegisterRaceListResponse } from '../response/registerRaceListResponse';

/**
 * オートレース場開催データリポジトリの実装
 */
@injectable()
export class AutoraceRaceRepositoryFromStorageImpl
    implements IRaceRepository<AutoraceRaceEntity, AutoracePlaceEntity>
{
    constructor(
        @inject('AutoraceRaceS3Gateway')
        private readonly raceS3Gateway: IS3Gateway<AutoraceRaceRecord>,
        @inject('AutoraceRacePlayerS3Gateway')
        private readonly racePlayerS3Gateway: IS3Gateway<AutoraceRacePlayerRecord>,
    ) {}
    /**
     * オートレース場開催データを取得する
     * @param request
     * @returns
     */
    @Logger
    async fetchRaceEntityList(
        request: FetchRaceListRequest<AutoracePlaceEntity>,
    ): Promise<FetchRaceListResponse<AutoraceRaceEntity>> {
        // startDateからfinishDateまでの日ごとのファイル名リストを生成する
        const fileNameList: string[] = this.generateFilenameList(
            request.startDate,
            request.finishDate,
        );

        // ファイル名リストからオートレース選手データを取得する
        const racePlayerRecordList: AutoraceRacePlayerRecord[] = (
            await Promise.all(
                fileNameList.map(async (fileName) => {
                    // S3からデータを取得する
                    const csv =
                        await this.racePlayerS3Gateway.fetchDataFromS3(
                            fileName,
                        );

                    // CSVを行ごとに分割
                    const lines = csv.split('\n');

                    // ヘッダー行を解析
                    const headers = lines[0].split(',');

                    // ヘッダーに基づいてインデックスを取得
                    const idIndex = headers.indexOf('id');
                    const raceIdIndex = headers.indexOf('raceId');
                    const positionNumberIndex =
                        headers.indexOf('positionNumber');
                    const playerNumberIndex = headers.indexOf('playerNumber');

                    // データ行を解析してAutoraceRaceDataのリストを生成
                    return lines
                        .slice(1)
                        .map((line: string) => {
                            const columns = line.split(',');

                            // 必要なフィールドが存在しない場合はundefinedを返す
                            if (
                                !columns[raceIdIndex] ||
                                isNaN(parseInt(columns[positionNumberIndex])) ||
                                isNaN(parseInt(columns[playerNumberIndex]))
                            ) {
                                return undefined;
                            }

                            return new AutoraceRacePlayerRecord(
                                columns[idIndex] as AutoraceRacePlayerId,
                                columns[raceIdIndex] as AutoraceRaceId,
                                parseInt(columns[positionNumberIndex]),
                                parseInt(columns[playerNumberIndex]),
                            );
                        })
                        .filter(
                            (
                                racePlayerRecord,
                            ): racePlayerRecord is AutoraceRacePlayerRecord =>
                                racePlayerRecord !== undefined,
                        );
                }),
            )
        ).flat();

        // ファイル名リストからオートレースデータを取得する
        const raceEntityList: AutoraceRaceEntity[] = (
            await Promise.all(
                fileNameList.map(async (fileName) => {
                    // S3からデータを取得する
                    const csv =
                        await this.raceS3Gateway.fetchDataFromS3(fileName);

                    // CSVを行ごとに分割
                    const lines = csv.split('\n');

                    // ヘッダー行を解析
                    const headers = lines[0].split(',');

                    // ヘッダーに基づいてインデックスを取得
                    const idIndex = headers.indexOf('id');
                    const raceNameIndex = headers.indexOf('name');
                    const raceStageIndex = headers.indexOf('stage');
                    const raceDateIndex = headers.indexOf('dateTime');
                    const placeIndex = headers.indexOf('location');
                    const gradeIndex = headers.indexOf('grade');
                    const raceNumIndex = headers.indexOf('number');

                    // データ行を解析してAutoraceRaceDataのリストを生成
                    return lines
                        .slice(1)
                        .map((line: string) => {
                            const columns = line.split(',');

                            // 必要なフィールドが存在しない場合はundefinedを返す
                            if (
                                !columns[raceNameIndex] ||
                                isNaN(parseInt(columns[raceNumIndex]))
                            ) {
                                return undefined;
                            }

                            return new AutoraceRaceEntity(
                                columns[idIndex] as AutoraceRaceId,
                                new AutoraceRaceData(
                                    columns[raceNameIndex],
                                    columns[
                                        raceStageIndex
                                    ] as AutoraceRaceStage,
                                    new Date(columns[raceDateIndex]),
                                    columns[placeIndex] as AutoraceRaceCourse,
                                    columns[gradeIndex] as AutoraceGradeType,
                                    parseInt(columns[raceNumIndex]),
                                ),
                                // racePlayerRecordList のraceIdが columns[idIndex] と一致するものを取得
                                racePlayerRecordList
                                    .filter((racePlayerRecord) => {
                                        return (
                                            racePlayerRecord.raceId ===
                                            columns[idIndex]
                                        );
                                    })
                                    .map((racePlayerRecord) => {
                                        return new AutoraceRacePlayerData(
                                            racePlayerRecord.positionNumber,
                                            racePlayerRecord.playerNumber,
                                        );
                                    }),
                            );
                        })
                        .filter(
                            (raceData): raceData is AutoraceRaceEntity =>
                                raceData !== undefined,
                        );
                }),
            )
        ).flat();

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
        request: RegisterRaceListRequest<AutoraceRaceEntity>,
    ): Promise<RegisterRaceListResponse> {
        const raceEntityList: AutoraceRaceEntity[] = request.raceEntityList;
        // レースデータを日付ごとに分割する
        const raceRecordDict: Record<string, AutoraceRaceRecord[]> = {};
        raceEntityList.forEach((raceEntity) => {
            const raceRecord = new AutoraceRaceRecord(
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

        const racePlayerRecordDict: Record<string, AutoraceRacePlayerRecord[]> =
            {};
        raceEntityList.forEach((raceEntity) => {
            const racePlayerRecordList = raceEntity.racePlayerDataList.map(
                (racePlayerData) => {
                    return new AutoraceRacePlayerRecord(
                        generateAutoraceRacePlayerId(
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
}
