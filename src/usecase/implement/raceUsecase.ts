import { inject, injectable } from 'tsyringe';

import { OldSearchPlaceFilterEntity } from '../../repository/entity/filter/oldSearchPlaceFilterEntity';
import { SearchRaceFilterEntity } from '../../repository/entity/filter/searchRaceFilterEntity';
import { RaceEntity } from '../../repository/entity/raceEntity';
import { IPlaceService } from '../../service/interface/IPlaceService';
import { IRaceService } from '../../service/interface/IRaceService';
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
