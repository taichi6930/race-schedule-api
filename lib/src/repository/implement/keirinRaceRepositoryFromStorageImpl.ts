import 'reflect-metadata';

import { format } from 'date-fns';
import { inject, injectable } from 'tsyringe';

import { IS3Gateway } from '../../gateway/interface/iS3Gateway';
import {
    KeirinGradeType,
    KeirinRaceCourse,
    KeirinRaceStage,
} from '../../utility/data/raceSpecific';
import { Logger } from '../../utility/logger';
import { KeirinPlaceEntity } from '../entity/keirinPlaceEntity';
import { KeirinRaceEntity } from '../entity/keirinRaceEntity';
import { IRaceRepository } from '../interface/IRaceRepository';
import { FetchRaceListRequest } from '../request/fetchRaceListRequest';
import { RegisterRaceListRequest } from '../request/registerRaceListRequest';
import { FetchRaceListResponse } from '../response/fetchRaceListResponse';
import { RegisterRaceListResponse } from '../response/registerRaceListResponse';

/**
 * 競輪場開催データリポジトリの実装
 */
@injectable()
export class KeirinRaceRepositoryFromStorageImpl
    implements IRaceRepository<KeirinRaceEntity, KeirinPlaceEntity>
{
    constructor(
        @inject('KeirinRaceS3Gateway')
        private readonly s3Gateway: IS3Gateway<KeirinRaceEntity>,
    ) {}
    /**
     * 競輪場開催データを取得する
     * @param request
     * @returns
     */
    @Logger
    async fetchRaceList(
        request: FetchRaceListRequest<KeirinPlaceEntity>,
    ): Promise<FetchRaceListResponse<KeirinRaceEntity>> {
        // startDateからfinishDateまでの日ごとのファイル名リストを生成する
        const fileNames: string[] = this.generateFilenameList(
            request.startDate,
            request.finishDate,
        );

        // ファイル名リストから競輪場開催データを取得する
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
                    const raceStageIndex = headers.indexOf('stage');
                    const raceDateIndex = headers.indexOf('dateTime');
                    const placeIndex = headers.indexOf('location');
                    const gradeIndex = headers.indexOf('grade');
                    const raceNumIndex = headers.indexOf('number');

                    // データ行を解析してKeirinRaceDataのリストを生成
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

                            return new KeirinRaceEntity(
                                columns[idIndex],
                                columns[raceNameIndex],
                                columns[raceStageIndex] as KeirinRaceStage,
                                new Date(columns[raceDateIndex]),
                                columns[placeIndex] as KeirinRaceCourse,
                                columns[gradeIndex] as KeirinGradeType,
                                parseInt(columns[raceNumIndex]),
                            );
                        })
                        .filter(
                            (raceData): raceData is KeirinRaceEntity =>
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
    async registerRaceList(
        request: RegisterRaceListRequest<KeirinRaceEntity>,
    ): Promise<RegisterRaceListResponse> {
        const raceDataList: KeirinRaceEntity[] = request.raceDataList;
        // レースデータを日付ごとに分割する
        const raceDataDict: Record<string, KeirinRaceEntity[]> = {};
        raceDataList.forEach((raceData) => {
            const key = `${format(raceData.dateTime, 'yyyyMMdd')}.csv`;
            if (!raceDataDict[key]) {
                raceDataDict[key] = [];
            }
            raceDataDict[key].push(raceData);
        });

        // 月毎に分けられたplaceをS3にアップロードする
        for (const [fileName, raceData] of Object.entries(raceDataDict)) {
            await this.s3Gateway.uploadDataToS3(raceData, fileName);
        }
        return new RegisterRaceListResponse(200);
    }
}
