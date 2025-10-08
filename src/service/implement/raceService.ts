import { inject, injectable } from 'tsyringe';

import { SearchRaceFilterEntity } from '../../repository/entity/filter/searchRaceFilterEntity';
import { PlaceEntity } from '../../repository/entity/placeEntity';
import { RaceEntity } from '../../repository/entity/raceEntity';
import { IRaceRepository } from '../../repository/interface/IRaceRepository';
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
        searchRaceFilter: SearchRaceFilterEntity,
        dataLocation: DataLocationType,
        placeEntityList?: PlaceEntity[],
    ): Promise<RaceEntity[]> {
        const raceEntityList: RaceEntity[] = [];
        switch (dataLocation) {
            case DataLocation.Storage: {
                const repository = this.repositoryFromStorage;
                return repository.fetchRaceEntityList(
                    searchRaceFilter,
                    placeEntityList,
                );
            }
            case DataLocation.Web: {
                for (const raceType of searchRaceFilter.raceTypeList) {
                    const repository = this.repositoryFromHtml;
                    const fetchedRaceEntityList =
                        await repository.fetchRaceEntityList(
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
                }
            }
        }
        return raceEntityList;
    }

    @Logger
    public async upsertRaceEntityList(
        entityList: RaceEntity[],
    ): Promise<UpsertResult> {
        return this.repositoryFromStorage.upsertRaceEntityList(entityList);
    }
}
