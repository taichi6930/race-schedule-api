import { inject, injectable } from 'tsyringe';

import { PlaceData } from '../../domain/placeData';
import { IPlaceDataService } from '../../service/interface/IPlaceDataService';
import { DataLocation } from '../../utility/dataType';
import { Logger } from '../../utility/logger';
import { RaceType } from '../../utility/raceType';
import { IPlaceDataUseCase } from '../interface/IPlaceDataUseCase';


@injectable()
export class PublicGamblingPlaceDataUseCase implements IPlaceDataUseCase {
    public constructor(
        @inject('PublicGamblingPlaceDataService')
        private readonly placeDataService: IPlaceDataService,
    ) {}

    
    @Logger
    public async fetchPlaceDataList(
        startDate: Date,
        finishDate: Date,
        raceTypeList: RaceType[],
    ): Promise<PlaceData[]> {
        
        const placeEntityList =
            await this.placeDataService.fetchPlaceEntityList(
                startDate,
                finishDate,
                raceTypeList,
                DataLocation.Storage,
            );
        const placeDataList: PlaceData[] = [];
        
        
        for (const placeEntityX of [
            placeEntityList[RaceType.JRA],
            placeEntityList[RaceType.NAR],
            placeEntityList[RaceType.OVERSEAS],
            placeEntityList[RaceType.KEIRIN],
            placeEntityList[RaceType.AUTORACE],
            placeEntityList[RaceType.BOATRACE],
        ]) {
            for (const placeEntity of placeEntityX) {
                placeDataList.push(placeEntity.placeData);
            }
        }
        return placeDataList;
    }

    
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
        
        const modifyStartDate = new Date(
            startDate.getFullYear(),
            startDate.getMonth(),
            1,
        );
        
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
        
        return this.placeDataService.updatePlaceEntityList(placeEntityList);
    }
}
