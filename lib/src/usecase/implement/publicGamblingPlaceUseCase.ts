import { inject, injectable } from 'tsyringe';

import { JraPlaceData } from '../../domain/jraPlaceData';
import { NarPlaceData } from '../../domain/narPlaceData';
import { PlaceData } from '../../domain/placeData';
import { IPlaceDataService } from '../../service/interface/IPlaceDataService';
import { DataLocation } from '../../utility/dataType';
import { Logger } from '../../utility/logger';
import { IPlaceDataUseCase } from '../interface/IPlaceDataUseCase';

/**
 * 公開用開催場データユースケース
 */
@injectable()
export class PublicGamblingPlaceUseCase implements IPlaceDataUseCase {
    public constructor(
        @inject('PublicGamblingPlaceDataService')
        private readonly placeDataService: IPlaceDataService,
    ) {}

    /**
     * 開催場データを取得する
     * @param startDate
     * @param finishDate
     * @param raceTypeList
     */
    @Logger
    public async fetchPlaceDataList(
        startDate: Date,
        finishDate: Date,
        raceTypeList: string[],
    ): Promise<JraPlaceData[] | NarPlaceData[] | PlaceData[]> {
        // 開催場データを取得
        const placeEntityList =
            await this.placeDataService.fetchPlaceEntityList(
                startDate,
                finishDate,
                raceTypeList,
                DataLocation.Storage,
            );
        const placeDataList: (JraPlaceData | NarPlaceData | PlaceData)[] = [];
        // 全ての開催場データを結合して返す
        // それぞれのplaceDataを抽出して返す
        for (const placeEntityX of [
            placeEntityList.jra,
            placeEntityList.nar,
            placeEntityList.keirin,
            placeEntityList.autorace,
            placeEntityList.boatrace,
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
     * @param raceTypeList
     */
    @Logger
    public async updatePlaceDataList(
        startDate: Date,
        finishDate: Date,
        raceTypeList: string[],
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
        const placeEntityList =
            await this.placeDataService.fetchPlaceEntityList(
                modifyStartDate,
                modifyFinishDate,
                // raceTypeListからjraを除外して取得
                raceTypeList.filter((type) => type !== 'jra'),
                DataLocation.Web,
            );
        // JRAの開催場データは別途処理するため、ここでは除外
        const modifyJraStartDate = new Date(
            modifyStartDate.getFullYear(),
            0,
            1,
        );
        // finishDateは年の最終日に設定する
        const modifyJraFinishDate = new Date(
            finishDate.getFullYear() + 1,
            0,
            0,
        );
        const jraPlaceEntityList =
            await this.placeDataService.fetchPlaceEntityList(
                modifyJraStartDate,
                modifyJraFinishDate,
                raceTypeList.filter((type) => type === 'jra'),
                DataLocation.Web,
            );

        // JRAの開催場データを追加
        placeEntityList.jra.push(...jraPlaceEntityList.jra);
        // 開催場データを更新
        await this.placeDataService.updatePlaceEntityList(placeEntityList);
    }
}
