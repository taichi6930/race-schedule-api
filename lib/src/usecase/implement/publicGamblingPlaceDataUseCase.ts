import { inject, injectable } from 'tsyringe';

import { PlaceData } from '../../domain/placeData';
import { IPlaceDataService } from '../../service/interface/IPlaceDataService';
import { DataLocation } from '../../utility/dataType';
import { Logger } from '../../utility/logger';
import { RaceType } from '../../utility/raceType';
import { IPlaceDataUseCase } from '../interface/IPlaceDataUseCase';

/**
 * 公開用開催場データユースケース
 */
@injectable()
export class PublicGamblingPlaceDataUseCase implements IPlaceDataUseCase {
    public constructor(
        @inject('PublicGamblingPlaceDataService')
        private readonly placeDataService: IPlaceDataService,
    ) {}

    /**
     * 開催場データを取得する
     * @param startDate
     * @param finishDate
     * @param raceTypeList - レース種別のリスト
     */
    @Logger
    public async fetchPlaceDataList(
        startDate: Date,
        finishDate: Date,
        raceTypeList: RaceType[],
    ): Promise<PlaceData[]> {
        // 開催場データを取得
        const placeEntityList =
            await this.placeDataService.fetchPlaceEntityList(
                startDate,
                finishDate,
                raceTypeList,
                DataLocation.Storage,
            );
        const placeDataList: PlaceData[] = [];
        // 全ての開催場データを結合して返す
        // それぞれのplaceDataを抽出して返す
        for (const placeEntityX of [
            placeEntityList.jra,
            placeEntityList.nar,
            placeEntityList.mechanicalRacing,
        ]) {
            for (const placeEntity of placeEntityX) {
                placeDataList.push(placeEntity.placeData);
            }
        }
        return placeDataList;
    }

    /**
     * 開催場データを更新する
     * @param startDate
     * @param finishDate
     * @param raceTypeList - レース種別のリスト
     */
    @Logger
    public async updatePlaceDataList(
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
        const placeEntityList =
            await this.placeDataService.fetchPlaceEntityList(
                modifyStartDate,
                modifyFinishDate,
                raceTypeList,
                DataLocation.Web,
            );
        // 開催場データを更新
        return this.placeDataService.updatePlaceEntityList(placeEntityList);
    }
}
