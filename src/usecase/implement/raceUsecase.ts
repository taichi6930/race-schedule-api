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
            new SearchPlaceFilterEntity(
                searchRaceFilter.startDate,
                searchRaceFilter.finishDate,
                searchRaceFilter.raceTypeList,
                [],
            ),
            DataLocation.Storage,
        );

        const upsertResultList: UpsertResult[] = [];

        for (const placeEntity of placeEntityList) {
            const entityList: RaceEntity[] =
                await this.raceService.fetchRaceEntityList(
                    commonParameter,
                    searchRaceFilter,
                    DataLocation.Web,
                    [placeEntity],
                );
            upsertResultList.push(
                await this.raceService.upsertRaceEntityList(
                    commonParameter,
                    entityList,
                ),
            );
        }

        // 結果の集計
        const successCount = upsertResultList.reduce(
            (sum, upsertResult) => sum + upsertResult.successCount,
            0,
        );
        const failureCount = upsertResultList.reduce(
            (sum, upsertResult) => sum + upsertResult.failureCount,
            0,
        );
        const failures = upsertResultList.flatMap(
            (upsertResult) => upsertResult.failures,
        );
        return { successCount, failureCount, failures };
    }
}
