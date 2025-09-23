import { inject, injectable } from 'tsyringe';

import { SearchRaceFilterEntity } from '../../repository/entity/filter/searchRaceFilterEntity';
import { OldPlaceEntity } from '../../repository/entity/placeEntity';
import { RaceEntity } from '../../repository/entity/raceEntity';
import { IRaceRepository } from '../../repository/interface/IRaceRepository';
import { CommonParameter } from '../../utility/commonParameter';
import { DataLocation, DataLocationType } from '../../utility/dataType';
import { Logger } from '../../utility/logger';
import type { UpsertResult } from '../../utility/upsertResult';
import { IRaceService } from '../interface/IRaceService';

@injectable()
export class RaceService implements IRaceService {
    public constructor(
        @inject('RaceRepositoryFromStorage')
        private readonly repositoryFromStorage: IRaceRepository,
        @inject('RaceRepositoryFromHtml')
        private readonly repositoryFromHtml: IRaceRepository,
    ) {}

    @Logger
    public async fetchRaceEntityList(
        commonParameter: CommonParameter,
        searchRaceFilter: SearchRaceFilterEntity,
        dataLocation: DataLocationType,
        placeEntityList?: OldPlaceEntity[],
    ): Promise<RaceEntity[]> {
        switch (dataLocation) {
            case DataLocation.Storage: {
                const repository = this.repositoryFromStorage;
                const raceEntityList = await repository.fetchRaceEntityList(
                    commonParameter,
                    searchRaceFilter,
                    placeEntityList,
                );
                return raceEntityList;
            }
            case DataLocation.Web: {
                const raceEntityList: RaceEntity[] = [];
                for (const raceType of searchRaceFilter.raceTypeList) {
                    const repository = this.repositoryFromHtml;
                    const fetchedRaceEntityList =
                        await repository.fetchRaceEntityList(
                            commonParameter,
                            new SearchRaceFilterEntity(
                                searchRaceFilter.startDate,
                                searchRaceFilter.finishDate,
                                [raceType],
                                searchRaceFilter.locationList,
                                searchRaceFilter.gradeList,
                                searchRaceFilter.stageList,
                            ),
                            placeEntityList,
                        );
                    raceEntityList.push(...fetchedRaceEntityList);
                    return raceEntityList;
                }
            }
        }
        return [];
    }

    @Logger
    public async upsertRaceEntityList(
        commonParameter: CommonParameter,
        entityList: RaceEntity[],
    ): Promise<UpsertResult> {
        return this.repositoryFromStorage.upsertRaceEntityList(
            commonParameter,
            entityList,
        );
    }
}
