import { inject, injectable } from 'tsyringe';

import { AutoraceRaceData } from '../../domain/autoraceRaceData';
import { AutoracePlaceEntity } from '../../repository/entity/autoracePlaceEntity';
import { AutoraceRaceEntity } from '../../repository/entity/autoraceRaceEntity';
import { IPlaceRepository } from '../../repository/interface/IPlaceRepository';
import { IRaceRepository } from '../../repository/interface/IRaceRepository';
import { FetchPlaceListRequest } from '../../repository/request/fetchPlaceListRequest';
import { FetchRaceListRequest } from '../../repository/request/fetchRaceListRequest';
import { RegisterRaceListRequest } from '../../repository/request/registerRaceListRequest';
import { FetchPlaceListResponse } from '../../repository/response/fetchPlaceListResponse';
import { FetchRaceListResponse } from '../../repository/response/fetchRaceListResponse';
import {
    AutoraceGradeType,
    AutoraceRaceCourse,
    AutoraceRaceStage,
} from '../../utility/data/autorace';
import { getJSTDate } from '../../utility/date';
import { Logger } from '../../utility/logger';
import { IRaceDataUseCase } from '../interface/IRaceDataUseCase';

/**
 * オートレース場開催データUseCase
 */
@injectable()
export class AutoraceRaceDataUseCase
    implements
        IRaceDataUseCase<
            AutoraceRaceData,
            AutoraceGradeType,
            AutoraceRaceCourse,
            AutoraceRaceStage
        >
{
    constructor(
        @inject('AutoracePlaceRepositoryFromStorage')
        private readonly autoracePlaceRepositoryFromStorage: IPlaceRepository<AutoracePlaceEntity>,
        @inject('AutoraceRaceRepositoryFromStorage')
        private readonly autoraceRaceRepositoryFromStorage: IRaceRepository<
            AutoraceRaceEntity,
            AutoracePlaceEntity
        >,
        @inject('AutoraceRaceRepositoryFromHtml')
        private readonly autoraceRaceRepositoryFromHtml: IRaceRepository<
            AutoraceRaceEntity,
            AutoracePlaceEntity
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
            gradeList?: AutoraceGradeType[];
            locationList?: AutoraceRaceCourse[];
            stageList?: AutoraceRaceStage[];
        },
    ): Promise<AutoraceRaceData[]> {
        // オートレース場データを取得する
        const placeEntityList: AutoracePlaceEntity[] =
            await this.getPlaceEntityList(startDate, finishDate);

        // レースデータを取得する
        const raceEntityList: AutoraceRaceEntity[] =
            await this.getRaceEntityList(
                startDate,
                finishDate,
                placeEntityList,
                'storage',
            );

        // レースデータをRaceDataに変換する
        const raceDataList: AutoraceRaceData[] = raceEntityList.map(
            (raceEntity) => raceEntity.raceData,
        );

        // フィルタリング処理
        const filteredRaceDataList: AutoraceRaceData[] = raceDataList
            // グレードリストが指定されている場合は、指定されたグレードのレースのみを取得する
            .filter((raceData) => {
                if (searchList?.gradeList) {
                    return searchList.gradeList.includes(raceData.grade);
                }
                return true;
            })
            // オートレース場が指定されている場合は、指定されたオートレース場のレースのみを取得する
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
            // オートレース場データを取得する
            const placeEntityList: AutoracePlaceEntity[] =
                await this.getPlaceEntityList(startDate, finishDate);

            // レースデータを取得する
            const raceEntityList: AutoraceRaceEntity[] =
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
    async upsertRaceDataList(raceDataList: AutoraceRaceData[]): Promise<void> {
        try {
            // AutoraceRaceDataをAutoraceRaceEntityに変換する
            const raceEntityList: AutoraceRaceEntity[] = raceDataList.map(
                (raceData) =>
                    new AutoraceRaceEntity(
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
     * オートレース場データの取得
     *
     * @param startDate
     * @param finishDate
     */
    @Logger
    private async getPlaceEntityList(
        startDate: Date,
        finishDate: Date,
    ): Promise<AutoracePlaceEntity[]> {
        const fetchPlaceListRequest: FetchPlaceListRequest =
            new FetchPlaceListRequest(startDate, finishDate);
        const fetchPlaceListResponse: FetchPlaceListResponse<AutoracePlaceEntity> =
            await this.autoracePlaceRepositoryFromStorage.fetchPlaceEntityList(
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
        placeEntityList: AutoracePlaceEntity[],
        type: 'storage' | 'web',
    ): Promise<AutoraceRaceEntity[]> {
        const fetchRaceListRequest =
            new FetchRaceListRequest<AutoracePlaceEntity>(
                startDate,
                finishDate,
                placeEntityList,
            );
        const repository =
            type === 'storage'
                ? this.autoraceRaceRepositoryFromStorage
                : this.autoraceRaceRepositoryFromHtml;

        const fetchRaceListResponse: FetchRaceListResponse<AutoraceRaceEntity> =
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
        raceEntityList: AutoraceRaceEntity[],
    ): Promise<void> {
        const registerRaceListRequest =
            new RegisterRaceListRequest<AutoraceRaceEntity>(raceEntityList);
        await this.autoraceRaceRepositoryFromStorage.registerRaceEntityList(
            registerRaceListRequest,
        );
    }
}
