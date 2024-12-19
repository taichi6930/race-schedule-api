import { inject, injectable } from 'tsyringe';

import { BoatraceRaceData } from '../../domain/boatraceRaceData';
import { BoatracePlaceEntity } from '../../repository/entity/boatracePlaceEntity';
import { BoatraceRaceEntity } from '../../repository/entity/boatraceRaceEntity';
import { IPlaceRepository } from '../../repository/interface/IPlaceRepository';
import { IRaceRepository } from '../../repository/interface/IRaceRepository';
import { FetchPlaceListRequest } from '../../repository/request/fetchPlaceListRequest';
import { FetchRaceListRequest } from '../../repository/request/fetchRaceListRequest';
import { RegisterRaceListRequest } from '../../repository/request/registerRaceListRequest';
import { FetchPlaceListResponse } from '../../repository/response/fetchPlaceListResponse';
import { FetchRaceListResponse } from '../../repository/response/fetchRaceListResponse';
import {
    BoatraceGradeType,
    BoatraceRaceCourse,
    BoatraceRaceStage,
} from '../../utility/data/boatrace';
import { getJSTDate } from '../../utility/date';
import { Logger } from '../../utility/logger';
import { IRaceDataUseCase } from '../interface/IRaceDataUseCase';

/**
 * ボートレース場開催データUseCase
 */
@injectable()
export class BoatraceRaceDataUseCase
    implements
        IRaceDataUseCase<
            BoatraceRaceData,
            BoatraceGradeType,
            BoatraceRaceCourse,
            BoatraceRaceStage
        >
{
    constructor(
        @inject('BoatracePlaceRepositoryFromStorage')
        private readonly boatracePlaceRepositoryFromStorage: IPlaceRepository<BoatracePlaceEntity>,
        @inject('BoatraceRaceRepositoryFromStorage')
        private readonly boatraceRaceRepositoryFromStorage: IRaceRepository<
            BoatraceRaceEntity,
            BoatracePlaceEntity
        >,
        @inject('BoatraceRaceRepositoryFromHtml')
        private readonly boatraceRaceRepositoryFromHtml: IRaceRepository<
            BoatraceRaceEntity,
            BoatracePlaceEntity
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
            gradeList?: BoatraceGradeType[];
            locationList?: BoatraceRaceCourse[];
            stageList?: BoatraceRaceStage[];
        },
    ): Promise<BoatraceRaceData[]> {
        // ボートレース場データを取得する
        const placeEntityList: BoatracePlaceEntity[] =
            await this.getPlaceEntityList(startDate, finishDate);

        // レースデータを取得する
        const raceEntityList: BoatraceRaceEntity[] =
            await this.getRaceEntityList(
                startDate,
                finishDate,
                placeEntityList,
                'storage',
            );

        // レースデータをRaceDataに変換する
        const raceDataList: BoatraceRaceData[] = raceEntityList.map(
            (raceEntity) => raceEntity.raceData,
        );

        // フィルタリング処理
        const filteredRaceDataList: BoatraceRaceData[] = raceDataList
            // グレードリストが指定されている場合は、指定されたグレードのレースのみを取得する
            .filter((raceData) => {
                if (searchList?.gradeList) {
                    return searchList.gradeList.includes(raceData.grade);
                }
                return true;
            })
            // ボートレース場が指定されている場合は、指定されたボートレース場のレースのみを取得する
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
    ): Promise<void> {
        try {
            // ボートレース場データを取得する
            const placeEntityList: BoatracePlaceEntity[] =
                await this.getPlaceEntityList(startDate, finishDate);

            // レースデータを取得する
            const raceEntityList: BoatraceRaceEntity[] =
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
    async upsertRaceDataList(raceDataList: BoatraceRaceData[]): Promise<void> {
        try {
            // BoatraceRaceDataをBoatraceRaceEntityに変換する
            const raceEntityList: BoatraceRaceEntity[] = raceDataList.map(
                (raceData) =>
                    new BoatraceRaceEntity(
                        null,
                        raceData,
                        [],
                        getJSTDate(new Date()),
                    ),
            );
            // S3にデータを保存する
            await this.registerRaceEntityList(raceEntityList);
        } catch (error) {
            console.error('レースデータの更新中にエラーが発生しました:', error);
        }
    }

    /**
     * ボートレース場データの取得
     *
     * @param startDate
     * @param finishDate
     */
    @Logger
    private async getPlaceEntityList(
        startDate: Date,
        finishDate: Date,
    ): Promise<BoatracePlaceEntity[]> {
        const fetchPlaceListRequest: FetchPlaceListRequest =
            new FetchPlaceListRequest(startDate, finishDate);
        const fetchPlaceListResponse: FetchPlaceListResponse<BoatracePlaceEntity> =
            await this.boatracePlaceRepositoryFromStorage.fetchPlaceEntityList(
                fetchPlaceListRequest,
            );
        return fetchPlaceListResponse.placeEntityList;
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
        placeEntityList: BoatracePlaceEntity[],
        type: 'storage' | 'web',
    ): Promise<BoatraceRaceEntity[]> {
        const fetchRaceListRequest =
            new FetchRaceListRequest<BoatracePlaceEntity>(
                startDate,
                finishDate,
                placeEntityList,
            );
        const repository =
            type === 'storage'
                ? this.boatraceRaceRepositoryFromStorage
                : this.boatraceRaceRepositoryFromHtml;

        const fetchRaceListResponse: FetchRaceListResponse<BoatraceRaceEntity> =
            await repository.fetchRaceEntityList(fetchRaceListRequest);
        return fetchRaceListResponse.raceEntityList;
    }

    /**
     * レースデータを登録する
     *
     * @param raceList
     */
    @Logger
    private async registerRaceEntityList(
        raceEntityList: BoatraceRaceEntity[],
    ): Promise<void> {
        const registerRaceListRequest =
            new RegisterRaceListRequest<BoatraceRaceEntity>(raceEntityList);
        await this.boatraceRaceRepositoryFromStorage.registerRaceEntityList(
            registerRaceListRequest,
        );
    }
}
