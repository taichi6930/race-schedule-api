import { inject, injectable } from 'tsyringe';

import { KeirinPlaceData } from '../../domain/keirinPlaceData';
import { KeirinPlaceEntity } from '../../repository/entity/keirinPlaceEntity';
import { IPlaceRepository } from '../../repository/interface/IPlaceRepository';
import { FetchPlaceListRequest } from '../../repository/request/fetchPlaceListRequest';
import { RegisterPlaceListRequest } from '../../repository/request/registerPlaceListRequest';
import { FetchPlaceListResponse } from '../../repository/response/fetchPlaceListResponse';
import { Logger } from '../../utility/logger';
import { IPlaceDataUseCase } from '../interface/IPlaceDataUseCase';

@injectable()
export class KeirinPlaceDataUseCase
    implements IPlaceDataUseCase<KeirinPlaceData>
{
    constructor(
        @inject('KeirinPlaceRepositoryFromStorage')
        private readonly keirinPlaceRepositoryFromStorage: IPlaceRepository<KeirinPlaceEntity>,
        @inject('KeirinPlaceRepositoryFromHtml')
        private readonly keirinPlaceRepositoryFromHtml: IPlaceRepository<KeirinPlaceEntity>,
    ) {}
    /**
     * レース開催データを取得する
     *
     * @param startDate
     * @param finishDate
     * @returns
     */
    @Logger
    async fetchPlaceDataList(
        startDate: Date,
        finishDate: Date,
    ): Promise<KeirinPlaceData[]> {
        const request: FetchPlaceListRequest = new FetchPlaceListRequest(
            startDate,
            finishDate,
        );
        const response: FetchPlaceListResponse<KeirinPlaceEntity> =
            await this.keirinPlaceRepositoryFromStorage.fetchPlaceList(request);
        // placeEntityListをplaceDataListに変換する
        const placeDataList: KeirinPlaceData[] = response.placeDataList.map(
            (placeEntity) => {
                return placeEntity.placeData;
            },
        );
        return placeDataList;
    }

    /**
     * レース開催データを更新する
     *
     * @param startDate
     * @param finishDate
     */
    @Logger
    async updatePlaceDataList(
        startDate: Date,
        finishDate: Date,
    ): Promise<void> {
        // startDateは月の1日に設定する
        const modifyStartDate = new Date(
            startDate.getFullYear(),
            startDate.getMonth(),
            1,
        );
        // finishDateは月の最終日に設定する
        const modifyFinishDate = new Date(
            finishDate.getFullYear(),
            finishDate.getMonth() + 1,
            0,
        );
        // HTMLからデータを取得する
        const fetchPlaceListRequest: FetchPlaceListRequest =
            new FetchPlaceListRequest(modifyStartDate, modifyFinishDate);
        const fetchPlaceListResponse: FetchPlaceListResponse<KeirinPlaceEntity> =
            await this.keirinPlaceRepositoryFromHtml.fetchPlaceList(
                fetchPlaceListRequest,
            );
        // S3にデータを保存する
        const registerPlaceListRequest =
            new RegisterPlaceListRequest<KeirinPlaceEntity>(
                fetchPlaceListResponse.placeDataList,
            );
        await this.keirinPlaceRepositoryFromStorage.registerPlaceList(
            registerPlaceListRequest,
        );
    }
}
