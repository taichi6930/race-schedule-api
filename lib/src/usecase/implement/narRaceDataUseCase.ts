import { inject, injectable } from 'tsyringe';

import { NarRaceData } from '../../domain/narRaceData';
import { NarPlaceEntity } from '../../repository/entity/narPlaceEntity';
import { NarRaceEntity } from '../../repository/entity/narRaceEntity';
import { IPlaceRepository } from '../../repository/interface/IPlaceRepository';
import { IRaceRepository } from '../../repository/interface/IRaceRepository';
import { FetchPlaceListRequest } from '../../repository/request/fetchPlaceListRequest';
import { FetchRaceListRequest } from '../../repository/request/fetchRaceListRequest';
import { RegisterRaceListRequest } from '../../repository/request/registerRaceListRequest';
import { FetchPlaceListResponse } from '../../repository/response/fetchPlaceListResponse';
import { FetchRaceListResponse } from '../../repository/response/fetchRaceListResponse';
import { NarGradeType, NarRaceCourse } from '../../utility/data/nar';
import { Logger } from '../../utility/logger';
import { IRaceDataUseCase } from '../interface/IRaceDataUseCase';

/**
 * 競馬場開催データUseCase
 */
@injectable()
export class NarRaceDataUseCase
    implements
        IRaceDataUseCase<NarRaceData, NarGradeType, NarRaceCourse, undefined>
{
    constructor(
        @inject('NarPlaceRepositoryFromStorage')
        private readonly narPlaceRepositoryFromStorage: IPlaceRepository<NarPlaceEntity>,
        @inject('NarRaceRepositoryFromStorage')
        private readonly narRaceRepositoryFromStorage: IRaceRepository<
            NarRaceEntity,
            NarPlaceEntity
        >,
        @inject('NarRaceRepositoryFromHtml')
        private readonly narRaceRepositoryFromHtml: IRaceRepository<
            NarRaceEntity,
            NarPlaceEntity
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
            gradeList?: NarGradeType[];
            locationList?: NarRaceCourse[];
        },
    ): Promise<NarRaceData[]> {
        // 競馬場データを取得する
        const placeEntityList: NarPlaceEntity[] = await this.getPlaceEntityList(
            startDate,
            finishDate,
        );

        // レースデータを取得する
        const raceEntityList: NarRaceEntity[] = await this.getRaceEntityList(
            startDate,
            finishDate,
            placeEntityList,
            'storage',
        );

        // レースデータをNarRaceDataに変換する
        const raceDataList: NarRaceData[] = raceEntityList.map(
            (raceEntity) => raceEntity.raceData,
        );

        // フィルタリング処理
        const filteredRaceDataList: NarRaceData[] = (raceDataList ?? [])
            // グレードリストが指定されている場合は、指定されたグレードのレースのみを取得する
            .filter((raceData) => {
                if (searchList?.gradeList) {
                    return searchList.gradeList.includes(raceData.grade);
                }
                return true;
            })
            // 競馬場が指定されている場合は、指定された競馬場のレースのみを取得する
            .filter((raceData) => {
                if (searchList?.locationList) {
                    return searchList.locationList.includes(raceData.location);
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
            // 競馬場データを取得する
            const placeEntityList: NarPlaceEntity[] =
                await this.getPlaceEntityList(startDate, finishDate);

            // レースデータを取得する
            const raceEntityList: NarRaceEntity[] =
                await this.getRaceEntityList(
                    startDate,
                    finishDate,
                    placeEntityList,
                    'web',
                );

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
    async upsertRaceDataList(raceDataList: NarRaceData[]): Promise<void> {
        try {
            // NarRaceDataをNarRaceEntityに変換する
            const raceEntityList: NarRaceEntity[] = raceDataList.map(
                (raceData) => new NarRaceEntity(null, raceData),
            );
            // S3にデータを保存する
            await this.registerRaceEntityList(raceEntityList);
        } catch (error) {
            console.error('レースデータの更新中にエラーが発生しました:', error);
        }
    }

    /**
     * 競馬場データの取得
     *
     * @param startDate
     * @param finishDate
     */
    @Logger
    private async getPlaceEntityList(
        startDate: Date,
        finishDate: Date,
    ): Promise<NarPlaceEntity[]> {
        const fetchPlaceListRequest: FetchPlaceListRequest =
            new FetchPlaceListRequest(startDate, finishDate);
        const fetchPlaceListResponse: FetchPlaceListResponse<NarPlaceEntity> =
            await this.narPlaceRepositoryFromStorage.fetchPlaceEntityList(
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
        placeEntityList: NarPlaceEntity[],
        type: 'storage' | 'web',
    ): Promise<NarRaceEntity[]> {
        const fetchRaceListRequest = new FetchRaceListRequest<NarPlaceEntity>(
            startDate,
            finishDate,
            placeEntityList,
        );
        const fetchRaceListResponse: FetchRaceListResponse<NarRaceEntity> =
            type === 'storage'
                ? await this.narRaceRepositoryFromStorage.fetchRaceEntityList(
                      fetchRaceListRequest,
                  )
                : await this.narRaceRepositoryFromHtml.fetchRaceEntityList(
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
        raceEntityList: NarRaceEntity[],
    ): Promise<void> {
        const registerRaceListRequest =
            new RegisterRaceListRequest<NarRaceEntity>(raceEntityList);
        await this.narRaceRepositoryFromStorage.registerRaceEntityList(
            registerRaceListRequest,
        );
    }
}
