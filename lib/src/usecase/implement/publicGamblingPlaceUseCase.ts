import { inject, injectable } from 'tsyringe';

import { AutoracePlaceData } from '../../domain/autoracePlaceData';
import { BoatracePlaceData } from '../../domain/boatracePlaceData';
import { JraPlaceData } from '../../domain/jraPlaceData';
import { KeirinPlaceData } from '../../domain/keirinPlaceData';
import { NarPlaceData } from '../../domain/narPlaceData';
import { AutoracePlaceEntity } from '../../repository/entity/autoracePlaceEntity';
import { BoatracePlaceEntity } from '../../repository/entity/boatracePlaceEntity';
import { JraPlaceEntity } from '../../repository/entity/jraPlaceEntity';
import { KeirinPlaceEntity } from '../../repository/entity/keirinPlaceEntity';
import { NarPlaceEntity } from '../../repository/entity/narPlaceEntity';
import { IPlaceDataService } from '../../service/interface/IPlaceDataService';
import { DataLocation } from '../../utility/dataType';
import { Logger } from '../../utility/logger';
import { IPlaceDataUseCase } from '../interface/IPlaceDataUseCase';

/**
 * 公開用開催場データユースケース（JRA/NAR共通）
 * 期間拡張ロジックを注入することで、JRA/NAR両方に対応
 */
@injectable()
export class PublicGamblingPlaceUseCase implements IPlaceDataUseCase {
    public constructor(
        @inject('PublicGamblingPlaceDataService')
        private readonly publicGamblingPlaceDataService: IPlaceDataService,
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
    ): Promise<
        | JraPlaceData[]
        | NarPlaceData[]
        | KeirinPlaceData[]
        | AutoracePlaceData[]
        | BoatracePlaceData[]
    > {
        // 開催場データを取得
        const placeEntityList: (
            | JraPlaceEntity
            | NarPlaceEntity
            | KeirinPlaceEntity
            | AutoracePlaceEntity
            | BoatracePlaceEntity
        )[] = await this.publicGamblingPlaceDataService.fetchPlaceEntityList(
            startDate,
            finishDate,
            raceTypeList,
            DataLocation.Storage,
        );
        // 全ての開催場データを結合して返す
        // それぞれのplaceDataを抽出して返す
        return placeEntityList.map(({ placeData }) => placeData);
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
        const placeEntityList: (
            | JraPlaceEntity
            | NarPlaceEntity
            | KeirinPlaceEntity
            | AutoracePlaceEntity
            | BoatracePlaceEntity
        )[] = await this.publicGamblingPlaceDataService.fetchPlaceEntityList(
            modifyStartDate,
            modifyFinishDate,
            raceTypeList,
            DataLocation.Web,
        );
        // 開催場データを更新
        await this.publicGamblingPlaceDataService.updatePlaceEntityList(
            placeEntityList,
        );
    }
}
