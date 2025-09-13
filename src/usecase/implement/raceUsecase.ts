import { inject, injectable } from 'tsyringe';

import { SearchPlaceFilterEntity } from '../../repository/entity/filter/searchPlaceFilterEntity';
import { SearchRaceFilterEntity } from '../../repository/entity/filter/searchRaceFilterEntity';
import { RaceEntity } from '../../repository/entity/raceEntity';
import { IPlaceService } from '../../service/interface/IPlaceService';
import { IRaceService } from '../../service/interface/IRaceService';
import { CommonParameter } from '../../utility/commonParameter';
import { DataLocation } from '../../utility/dataType';
import { Logger } from '../../utility/logger';
import type { UpsertResult } from '../../utility/upsertResult';
import { IRaceUseCase } from '../interface/IRaceUsecase';

@injectable()
export class RaceUseCase implements IRaceUseCase {
    public constructor(
        @inject('PlaceService')
        private readonly placeService: IPlaceService,
        @inject('RaceService')
        private readonly raceService: IRaceService,
    ) {}

    @Logger
    public async fetchRaceEntityList(
        commonParameter: CommonParameter,
        searchRaceFilter: SearchRaceFilterEntity,
    ): Promise<RaceEntity[]> {
        return this.raceService.fetchRaceEntityList(
            commonParameter,
            searchRaceFilter,
            DataLocation.Storage,
        );
    }

    @Logger
    public async upsertRaceEntityList(
        commonParameter: CommonParameter,
        searchRaceFilter: SearchRaceFilterEntity,
    ): Promise<UpsertResult> {
        // フィルタリング処理
        const placeEntityList = await this.placeService.fetchPlaceEntityList(
            commonParameter,
            new SearchPlaceFilterEntity(
                searchRaceFilter.startDate,
                searchRaceFilter.finishDate,
                searchRaceFilter.raceTypeList,
                [],
            ),
            DataLocation.Storage,
        );

        const entityList: RaceEntity[] =
            await this.raceService.fetchRaceEntityList(
                commonParameter,
                searchRaceFilter,
                DataLocation.Web,
                placeEntityList,
            );
        return this.raceService.upsertRaceEntityList(
            commonParameter,
            entityList,
        );
    }
}
