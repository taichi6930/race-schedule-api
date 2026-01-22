import { inject, injectable } from 'tsyringe';

import { Logger } from '../../../packages/shared/src/utilities/logger';
import type { UpsertResult } from '../../../packages/shared/src/utilities/upsertResult';
import { OldSearchPlaceFilterEntity } from '../../repository/entity/filter/oldSearchPlaceFilterEntity';
import { SearchRaceFilterEntity } from '../../repository/entity/filter/searchRaceFilterEntity';
import { RaceEntity } from '../../repository/entity/raceEntity';
import { IOldPlaceService } from '../../service/interface/IOldPlaceService';
import { IOldRaceService } from '../../service/interface/IOldRaceService';
import { DataLocation } from '../../utility/oldDataType';
import { IOldRaceUseCase } from '../interface/IOldRaceUsecase';
@injectable()
export class OldRaceUseCase implements IOldRaceUseCase {
    public constructor(
        @inject('PlaceService')
        private readonly placeService: IOldPlaceService,
        @inject('RaceService')
        private readonly raceService: IOldRaceService,
    ) {}

    /**
     * 開催レースのEntity配列を取得する
     * @param searchRaceFilter - レースフィルター情報
     */
    @Logger
    public async fetchRaceEntityList(
        searchRaceFilter: SearchRaceFilterEntity,
    ): Promise<RaceEntity[]> {
        return this.raceService.fetchRaceEntityList(
            searchRaceFilter,
            DataLocation.Storage,
        );
    }

    /**
     * 開催レースのEntity配列の更新を行う
     * @param searchRaceFilter - レースフィルター情報
     */
    @Logger
    public async upsertRaceEntityList(
        searchRaceFilter: SearchRaceFilterEntity,
    ): Promise<UpsertResult> {
        // フィルタリング処理
        const placeEntityList = await this.placeService.fetchPlaceEntityList(
            new OldSearchPlaceFilterEntity(
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
                    searchRaceFilter,
                    DataLocation.Web,
                    [placeEntity],
                );
            upsertResultList.push(
                await this.raceService.upsertRaceEntityList(entityList),
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
