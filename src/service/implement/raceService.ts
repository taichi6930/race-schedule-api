import { inject, injectable } from 'tsyringe';

import { Logger } from '../../../packages/shared/src/utilities/logger';
import { SearchRaceFilterEntity } from '../../repository/entity/filter/searchRaceFilterEntity';
import { PlaceEntity } from '../../repository/entity/placeEntity';
import { RaceEntity } from '../../repository/entity/raceEntity';
import { IRaceRepository } from '../../repository/interface/IRaceRepository';
import { DataLocation, DataLocationType } from '../../utility/dataType';
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

    /**
     * 開催レースのEntity配列を取得する
     * @param searchRaceFilter - レースフィルター情報
     * @param dataLocation - データ取得場所
     * @param placeEntityList - 場所エンティティ配列
     */
    @Logger
    public async fetchRaceEntityList(
        searchRaceFilter: SearchRaceFilterEntity,
        dataLocation: DataLocationType,
        placeEntityList?: PlaceEntity[],
    ): Promise<RaceEntity[]> {
        switch (dataLocation) {
            case DataLocation.Storage: {
                return this.repositoryFromStorage.fetchRaceEntityList(
                    searchRaceFilter,
                    placeEntityList,
                );
            }
            case DataLocation.Web: {
                const raceEntityList: RaceEntity[] = [];
                for (const raceType of searchRaceFilter.raceTypeList) {
                    const fetchedRaceEntityList =
                        await this.repositoryFromHtml.fetchRaceEntityList(
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
                return raceEntityList;
            }
        }
    }

    /**
     * 開催レースのEntity配列の更新を行う
     * @param entityList - レースエンティティ配列
     */
    @Logger
    public async upsertRaceEntityList(
        entityList: RaceEntity[],
    ): Promise<UpsertResult> {
        return this.repositoryFromStorage.upsertRaceEntityList(entityList);
    }
}
