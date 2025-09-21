import { inject, injectable } from 'tsyringe';

import { SearchRaceFilterEntity } from '../../repository/entity/filter/searchRaceFilterEntity';
import { PlaceEntity } from '../../repository/entity/placeEntity';
import { RaceEntity } from '../../repository/entity/raceEntity';
import { IRaceRepository } from '../../repository/interface/IRaceRepository';
import { CommonParameter } from '../../utility/commonParameter';
import { DataLocation, DataLocationType } from '../../utility/dataType';
import { Logger } from '../../utility/logger';
import { RaceType } from '../../utility/raceType';
import type { UpsertResult } from '../../utility/upsertResult';
import { IRaceService } from '../interface/IRaceService';

@injectable()
export class RaceService implements IRaceService {
    private readonly raceRepositoryFromHtml: Record<RaceType, IRaceRepository>;

    public constructor(
        @inject('RaceRepositoryFromStorage')
        private readonly repositoryFromStorage: IRaceRepository,
        @inject('RaceRepositoryFromHtml')
        private readonly _raceRepositoryFromHtml: IRaceRepository,
        @inject('OverseasRaceRepositoryFromHtml')
        private readonly overseasRaceRepositoryFromHtml: IRaceRepository,
    ) {
        this.raceRepositoryFromHtml = {
            [RaceType.JRA]: this._raceRepositoryFromHtml,
            [RaceType.NAR]: this._raceRepositoryFromHtml,
            [RaceType.OVERSEAS]: this.overseasRaceRepositoryFromHtml,
            [RaceType.KEIRIN]: this._raceRepositoryFromHtml,
            [RaceType.AUTORACE]: this._raceRepositoryFromHtml,
            [RaceType.BOATRACE]: this._raceRepositoryFromHtml,
        };
    }

    @Logger
    public async fetchRaceEntityList(
        commonParameter: CommonParameter,
        searchRaceFilter: SearchRaceFilterEntity,
        dataLocation: DataLocationType,
        placeEntityList?: PlaceEntity[],
    ): Promise<RaceEntity[]> {
        switch (dataLocation) {
            case DataLocation.Storage: {
                const repository = this.repositoryFromStorage;
                const fetchedRaceEntityList =
                    await repository.fetchRaceEntityList(
                        commonParameter,
                        searchRaceFilter,
                        placeEntityList,
                    );
                return fetchedRaceEntityList;
            }
            case DataLocation.Web: {
                const raceEntityList: RaceEntity[] = [];
                for (const raceType of searchRaceFilter.raceTypeList) {
                    const repository = this.raceRepositoryFromHtml[raceType];
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
