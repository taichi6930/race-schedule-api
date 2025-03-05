import { inject, injectable } from 'tsyringe';

import { JraPlaceData } from '../../domain/jraPlaceData';
import { JraPlaceEntity } from '../../repository/entity/jraPlaceEntity';
import { IPlaceDataService } from '../../service/interface/IPlaceDataService';
import { DataLocation } from '../../utility/dataType';
import { Logger } from '../../utility/logger';
import { IPlaceDataUseCase } from '../interface/IPlaceDataUseCase';

/**
 * Jra開催場データユースケース
 */
@injectable()
export class JraPlaceDataUseCase implements IPlaceDataUseCase<JraPlaceData> {
    constructor(
        @inject('JraPlaceDataService')
        private readonly placeDataService: IPlaceDataService<JraPlaceEntity>,
    ) {}

    /**
     * 開催場データを取得する
     * @param startDate
     * @param finishDate
     */
    @Logger
    async fetchPlaceDataList(
        startDate: Date,
        finishDate: Date,
    ): Promise<JraPlaceData[]> {
        const placeEntityList: JraPlaceEntity[] =
            await this.placeDataService.fetchPlaceEntityList(
                startDate,
                finishDate,
                DataLocation.Storage,
            );
        return placeEntityList.map(({ placeData }) => placeData);
    }

    /**
     * 開催場データを更新する
     * @param startDate
     * @param finishDate
     */
    @Logger
    async updatePlaceDataList(
        startDate: Date,
        finishDate: Date,
    ): Promise<void> {
        // startDateは年の1日に設定する
        const modifyStartDate = new Date(startDate.getFullYear(), 0, 1);
        // finishDateは年の最終日に設定する
        const modifyFinishDate = new Date(finishDate.getFullYear() + 1, 0, 0);
        const placeEntityList: JraPlaceEntity[] =
            await this.placeDataService.fetchPlaceEntityList(
                modifyStartDate,
                modifyFinishDate,
                DataLocation.Web,
            );

        await this.placeDataService.updatePlaceEntityList(placeEntityList);
    }
}
