import 'reflect-metadata';

import { format } from 'date-fns';
import { inject, injectable } from 'tsyringe';

import { WorldRaceData } from '../../domain/worldRaceData';
import { IS3Gateway } from '../../gateway/interface/iS3Gateway';
import { WorldRaceRecord } from '../../gateway/record/worldRaceRecord';
import { WorldPlaceEntity } from '../../repository/entity/worldPlaceEntity';
import { WorldRaceEntity } from '../../repository/entity/worldRaceEntity';
import {
    WorldGradeType,
    WorldRaceCourse,
    WorldRaceCourseType,
} from '../../utility/data/world';
import { Logger } from '../../utility/logger';
import { WorldRaceId } from '../../utility/raceId';
import { IRaceRepository } from '../interface/IRaceRepository';
import { FetchRaceListRequest } from '../request/fetchRaceListRequest';
import { RegisterRaceListRequest } from '../request/registerRaceListRequest';
import { FetchRaceListResponse } from '../response/fetchRaceListResponse';
import { RegisterRaceListResponse } from '../response/registerRaceListResponse';

/**
 * 競馬場開催データリポジトリの実装
 */
@injectable()
export class WorldRaceRepositoryFromStorageImpl
    implements IRaceRepository<WorldRaceEntity, WorldPlaceEntity>
{
    constructor(
        @inject('WorldRaceS3Gateway')
        private readonly s3Gateway: IS3Gateway<WorldRaceRecord>,
    ) {}
    /**
     * 競馬場開催データを取得する
     * @param request
     * @returns
     */
    @Logger
    async fetchRaceEntityList(
        request: FetchRaceListRequest<WorldPlaceEntity>,
    ): Promise<FetchRaceListResponse<WorldRaceEntity>> {
        // startDateからfinishDateまでの日ごとのファイル名リストを生成する
        const fileNames: string[] = this.generateFilenameList(
            request.startDate,
            request.finishDate,
        );

        // ファイル名リストから海外競馬場開催データを取得する
        const raceDataList = (
            await Promise.all(
                fileNames.map(async (fileName) => {
                    // S3からデータを取得する
                    const csv = await this.s3Gateway.fetchDataFromS3(fileName);

                    // CSVを行ごとに分割
                    const lines = csv.split('\n');

                    // ヘッダー行を解析
                    const headers = lines[0].split(',');

                    // ヘッダーに基づいてインデックスを取得
                    const idIndex = headers.indexOf('id');
                    const raceNameIndex = headers.indexOf('name');
                    const raceDateIndex = headers.indexOf('dateTime');
                    const placeIndex = headers.indexOf('location');
                    const surfaceTypeIndex = headers.indexOf('surfaceType');
                    const distanceIndex = headers.indexOf('distance');
                    const gradeIndex = headers.indexOf('grade');
                    const raceNumIndex = headers.indexOf('number');

                    // データ行を解析してRaceDataのリストを生成
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

                            return new WorldRaceEntity(
                                columns[idIndex] as WorldRaceId,
                                new WorldRaceData(
                                    columns[raceNameIndex],
                                    new Date(columns[raceDateIndex]),
                                    columns[placeIndex] as WorldRaceCourse,
                                    columns[
                                        surfaceTypeIndex
                                    ] as WorldRaceCourseType,
                                    parseInt(columns[distanceIndex]),
                                    columns[gradeIndex] as WorldGradeType,
                                    parseInt(columns[raceNumIndex]),
                                ),
                            );
                        })
                        .filter(
                            (raceData): raceData is WorldRaceEntity =>
                                raceData !== undefined,
                        );
                }),
            )
        ).flat();

        return new FetchRaceListResponse(raceDataList);
    }

    /**
     * startDateからfinishDateまでの日付ごとのファイル名リストを生成する
     * @param startDate
     * @param finishDate
     * @returns
     */
    private generateFilenameList(startDate: Date, finishDate: Date): string[] {
        const fileNames: string[] = [];
        const currentDate = new Date(startDate);
        while (currentDate <= finishDate) {
            const fileName = `${format(currentDate, 'yyyyMMdd')}.csv`;
            fileNames.push(fileName);
            currentDate.setDate(currentDate.getDate() + 1);
        }
        return fileNames;
    }

    /**
     * レースデータを登録する
     * @param request
     */
    @Logger
    async registerRaceEntityList(
        request: RegisterRaceListRequest<WorldRaceEntity>,
    ): Promise<RegisterRaceListResponse> {
        const raceEntity: WorldRaceEntity[] = request.raceEntityList;
        // レースデータを日付ごとに分割する
        const raceRecordDict: Record<string, WorldRaceRecord[]> = {};
        raceEntity.forEach((race) => {
            const raceRecord = new WorldRaceRecord(
                race.id,
                race.raceData.name,
                race.raceData.dateTime,
                race.raceData.location,
                race.raceData.surfaceType,
                race.raceData.distance,
                race.raceData.grade,
                race.raceData.number,
            );
            const key = `${format(race.raceData.dateTime, 'yyyyMMdd')}.csv`;
            // 日付ごとに分割されたレースデータを格納
            if (!(key in raceRecordDict)) {
                raceRecordDict[key] = [];
            }

            // 既に存在する場合は追加しない
            if (
                raceRecordDict[key].findIndex(
                    (record) => record.id === raceRecord.id,
                ) !== -1
            ) {
                return;
            }

            raceRecordDict[key].push(raceRecord);
        });

        // 月毎に分けられたplaceをS3にアップロードする
        for (const [fileName, raceData] of Object.entries(raceRecordDict)) {
            await this.s3Gateway.uploadDataToS3(raceData, fileName);
        }
        return new RegisterRaceListResponse(200);
    }
}
