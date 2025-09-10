import { inject, injectable } from 'tsyringe';

import { DataLocation } from '../../../lib/src/utility/dataType';
import { SearchPlaceFilterEntity } from '../../repository/entity/filter/searchPlaceFilterEntity';
import { SearchRaceFilterEntity } from '../../repository/entity/filter/searchRaceFilterEntity';
import { RaceEntity } from '../../repository/entity/raceEntity';
import { IPlaceService } from '../../service/interface/IPlaceService';
import { IRaceService } from '../../service/interface/IRaceService';
import { CommonParameter } from '../../utility/commonParameter';
import { Logger } from '../../utility/logger';
import { RACE_TYPE_LIST_ALL } from '../../utility/raceType';
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
        const raceEntityList = await this.raceService.fetchRaceEntityList(
            commonParameter,
            searchRaceFilter,
            DataLocation.Storage,
        );
        // 共通フィルタ関数で簡潔に
        const filteredRaceEntityList = RACE_TYPE_LIST_ALL.flatMap(
            (raceType) => {
                return raceEntityList.filter((raceEntity) => {
                    return raceEntity.raceData.raceType === raceType;
                });
            },
        );
        return filteredRaceEntityList;
    }

    @Logger
    public async upsertRaceEntityList(
        commonParameter: CommonParameter,
        searchRaceFilter: SearchRaceFilterEntity,
    ): Promise<void> {
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
        const filteredPlaceEntityList = RACE_TYPE_LIST_ALL.flatMap((raceType) =>
            placeEntityList.filter(
                (item) => item.placeData.raceType === raceType,
            ),
        );
        const entityList: RaceEntity[] =
            await this.raceService.fetchRaceEntityList(
                commonParameter,
                searchRaceFilter,
                DataLocation.Web,
                filteredPlaceEntityList,
            );
        return this.raceService.upsertRaceEntityList(
            commonParameter,
            entityList,
        );
    }
}
