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
                fileNames.map(async (fileName) =>
                    // S3からデータを取得する
                    this.s3Gateway.fetchDataFromS3(fileName).then((csv) => {
                        // csvをパースしてKeirinRaceDataのリストを生成する
                        return csv
                            .split('\n')
                            .map((line: string) => {
                                const [
                                    id,
                                    raceName,
                                    raceStage,
                                    raceDate,
                                    place,
                                    grade,
                                    raceNum,
                                ] = line.split(',');
                                if (!raceName || isNaN(parseInt(raceNum))) {
                                    return undefined;
                                }
                                return new KeirinRaceEntity(
                                    id,
                                    raceName,
                                    raceStage as KeirinRaceStage,
                                    new Date(raceDate),
                                    place as KeirinRaceCourse,
                                    grade as KeirinGradeType,
                                    parseInt(raceNum),
                                );
                            })
                            .filter(
                                (raceData): raceData is KeirinRaceEntity =>
                                    raceData !== undefined,
                            );
                    }),
                ),
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
