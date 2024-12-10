import { inject, injectable } from 'tsyringe';

import { KeirinRaceData } from '../../domain/keirinRaceData';
import { KeirinPlaceEntity } from '../../repository/entity/keirinPlaceEntity';
import { KeirinRaceEntity } from '../../repository/entity/keirinRaceEntity';
import { IPlaceRepository } from '../../repository/interface/IPlaceRepository';
import { IRaceRepository } from '../../repository/interface/IRaceRepository';
import { FetchPlaceListRequest } from '../../repository/request/fetchPlaceListRequest';
import { FetchRaceListRequest } from '../../repository/request/fetchRaceListRequest';
import { RegisterRaceListRequest } from '../../repository/request/registerRaceListRequest';
import { FetchPlaceListResponse } from '../../repository/response/fetchPlaceListResponse';
import { FetchRaceListResponse } from '../../repository/response/fetchRaceListResponse';
import {
    KeirinGradeType,
    KeirinRaceCourse,
    KeirinRaceStage,
} from '../../utility/data/keirin';
import { Logger } from '../../utility/logger';
import { IRaceDataUseCase } from '../interface/IRaceDataUseCase';

/**
 * 競輪場開催データUseCase
 */
@injectable()
export class KeirinRaceDataUseCase
    implements
        IRaceDataUseCase<
            KeirinRaceData,
            KeirinGradeType,
            KeirinRaceCourse,
            KeirinRaceStage
        >
{
    constructor(
        @inject('KeirinPlaceRepositoryFromStorage')
        private readonly keirinPlaceRepositoryFromStorage: IPlaceRepository<KeirinPlaceEntity>,
        @inject('KeirinRaceRepositoryFromStorage')
        private readonly keirinRaceRepositoryFromStorage: IRaceRepository<
            KeirinRaceEntity,
            KeirinPlaceEntity
        >,
        @inject('KeirinRaceRepositoryFromHtml')
        private readonly keirinRaceRepositoryFromHtml: IRaceRepository<
            KeirinRaceEntity,
            KeirinPlaceEntity
        >,
    ) {}
    /**
     * レース開催データを取得する
     * @param startDate
     * @param finishDate
     */
    async fetchRaceDataList(
        startDate: Date,
        finishDate: Date,
        searchList?: {
            gradeList?: KeirinGradeType[];
            locationList?: KeirinRaceCourse[];
            stageList?: KeirinRaceStage[];
        },
    ): Promise<KeirinRaceData[]> {
        // 競輪場データを取得する
        const placeEntityList: KeirinPlaceEntity[] =
            await this.getPlaceEntityList(startDate, finishDate);

        // レースデータを取得する
        const raceEntityList: KeirinRaceEntity[] = await this.getRaceEntityList(
            startDate,
            finishDate,
            placeEntityList,
            'storage',
        );

        // レースデータをRaceDataに変換する
        const raceDataList: KeirinRaceData[] = raceEntityList.map(
            (raceEntity) => raceEntity.raceData,
        );

        // フィルタリング処理
        const filteredRaceDataList: KeirinRaceData[] = raceDataList
            // グレードリストが指定されている場合は、指定されたグレードのレースのみを取得する
            .filter((raceData) => {
                if (searchList?.gradeList) {
                    return searchList.gradeList.includes(raceData.grade);
                }
                return true;
            })
            // 競輪場が指定されている場合は、指定された競輪場のレースのみを取得する
            .filter((raceData) => {
                if (searchList?.locationList) {
                    return searchList.locationList.includes(raceData.location);
                }
                return true;
            })
            // レースステージが指定されている場合は、指定されたレースステージのレースのみを取得する
            .filter((raceData) => {
                if (searchList?.stageList) {
                    return searchList.stageList.includes(raceData.stage);
                }
                return true;
            });

        return filteredRaceDataList;
    }

    /**
     * レース開催データを更新する
     *
     * @param startDate
     * @param finishDate
     */
    @Logger
    async updateRaceEntityList(
        startDate: Date,
        finishDate: Date,
        searchList?: {
            gradeList?: KeirinGradeType[];
            locationList?: KeirinRaceCourse[];
        },
    ): Promise<void> {
        try {
            // 競輪場データを取得する
            const placeEntityList: KeirinPlaceEntity[] =
                await this.getPlaceEntityList(
                    startDate,
                    finishDate,
                    searchList,
                );

            // placeEntityListが空の場合は処理を終了する
            if (placeEntityList.length === 0) {
                return;
            }

            // レースデータを取得する
            const raceEntityList: KeirinRaceEntity[] =
                await this.getRaceEntityList(
                    startDate,
                    finishDate,
                    placeEntityList,
                    'web',
                );

            console.log('レースデータを登録する');
            // S3にデータを保存する
            await this.registerRaceEntityList(raceEntityList);
        } catch (error) {
            console.error('レースデータの更新中にエラーが発生しました:', error);
        }
    }

    /**
     * レース開催データを更新する
     * @param raceDataList
     */
    @Logger
    async upsertRaceDataList(raceDataList: KeirinRaceData[]): Promise<void> {
        try {
            // KeirinRaceDataをKeirinRaceEntityに変換する
            const raceEntityList: KeirinRaceEntity[] = raceDataList.map(
                (raceData) => new KeirinRaceEntity(null, raceData, []),
            );
            // S3にデータを保存する
            await this.registerRaceEntityList(raceEntityList);
        } catch (error) {
            console.error('レースデータの更新中にエラーが発生しました:', error);
        }
    }

    /**
     * 競輪場データの取得
     *
     * @param startDate
     * @param finishDate
     */
    @Logger
    private async getPlaceEntityList(
        startDate: Date,
        finishDate: Date,
        searchList?: {
            gradeList?: KeirinGradeType[];
            locationList?: KeirinRaceCourse[];
        },
    ): Promise<KeirinPlaceEntity[]> {
        const fetchPlaceListRequest: FetchPlaceListRequest =
            new FetchPlaceListRequest(startDate, finishDate);
        const fetchPlaceListResponse: FetchPlaceListResponse<KeirinPlaceEntity> =
            await this.keirinPlaceRepositoryFromStorage.fetchPlaceEntityList(
                fetchPlaceListRequest,
            );

        const placeEntityList = fetchPlaceListResponse.placeEntityList;

        // フィルタリング処理
        const filteredPlaceEntityList: KeirinPlaceEntity[] = placeEntityList
            ?.filter((placeEntity) => {
                if (searchList?.gradeList) {
                    return searchList.gradeList.includes(
                        placeEntity.placeData.grade,
                    );
                }
                return true;
            })
            ?.filter((placeEntity) => {
                if (searchList?.locationList) {
                    return searchList.locationList.includes(
                        placeEntity.placeData.location,
                    );
                }
                return true;
            });
        return filteredPlaceEntityList;
    }

    /**
     * レースデータを取得する
     * S3から取得する場合はstorage、Webから取得する場合はwebを指定する
     *
     * @param startDate
     * @param finishDate
     * @param placeEntityList
     * @param type
     */
    @Logger
    private async getRaceEntityList(
        startDate: Date,
        finishDate: Date,
        placeEntityList: KeirinPlaceEntity[],
        type: 'storage' | 'web',
    ): Promise<KeirinRaceEntity[]> {
        const fetchRaceListRequest =
            new FetchRaceListRequest<KeirinPlaceEntity>(
                startDate,
                finishDate,
                placeEntityList,
            );
        const fetchRaceListResponse: FetchRaceListResponse<KeirinRaceEntity> =
            type === 'storage'
                ? await this.keirinRaceRepositoryFromStorage.fetchRaceEntityList(
                      fetchRaceListRequest,
                  )
                : await this.keirinRaceRepositoryFromHtml.fetchRaceEntityList(
                      fetchRaceListRequest,
                  );
        return fetchRaceListResponse.raceEntityList;
    }

    /**
     * レースデータを登録する
     *
     * @param raceList
     */
    @Logger
    private async registerRaceEntityList(
        raceEntityList: KeirinRaceEntity[],
    ): Promise<void> {
        const registerRaceListRequest =
            new RegisterRaceListRequest<KeirinRaceEntity>(raceEntityList);
        await this.keirinRaceRepositoryFromStorage.registerRaceEntityList(
            registerRaceListRequest,
        );
    }
}
