import { inject, injectable } from 'tsyringe';

import { PlaceEntity } from '../../../../src/repository/entity/placeEntity';
import { RaceType } from '../../../../src/utility/raceType';
import { IPlaceServiceForAWS } from '../../service/interface/IPlaceService';
import { DataLocation } from '../../utility/dataType';
import { Logger } from '../../utility/logger';
import { IPlaceUseCaseForAWS } from '../interface/IPlaceUseCase';

/**
 * 公営競技の開催場データ UseCase
 */
@injectable()
export class PlaceUseCaseForAWS implements IPlaceUseCaseForAWS {
    public constructor(
        @inject('PlaceService')
        private readonly placeService: IPlaceServiceForAWS,
    ) {}

    /**
     * 開催場データを取得する
     * @param startDate - 開始日
     * @param finishDate - 終了日
     * @param raceTypeList - レース種別のリスト
     */
    @Logger
    public async fetchPlaceEntityList(
        startDate: Date,
        finishDate: Date,
        raceTypeList: RaceType[],
    ): Promise<PlaceEntity[]> {
        return this.placeService.fetchPlaceEntityList(
            startDate,
            finishDate,
            raceTypeList,
            DataLocation.Storage,
        );
    }

    /**
     * 開催場データを更新する
     * @param startDate - 開始日
     * @param finishDate - 終了日
     * @param raceTypeList - レース種別のリスト
     */
    @Logger
    public async updatePlaceEntityList(
        startDate: Date,
        finishDate: Date,
        raceTypeList: RaceType[],
    ): Promise<{
        code: number;
        message: string;
        successDataCount: number;
        failureDataCount: number;
    }> {
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
        const placeEntityList = await this.placeService.fetchPlaceEntityList(
            modifyStartDate,
            modifyFinishDate,
            raceTypeList,
            DataLocation.Web,
        );
        // 開催場データを更新
        return this.placeService.updatePlaceEntityList(placeEntityList);
    }
}
