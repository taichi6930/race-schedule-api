import type { PlaceEntity } from '@race-schedule/shared/src/entity/placeEntity';
import { UpsertResult } from '@race-schedule/shared/src/utilities/upsertResult';
import { inject, injectable } from 'tsyringe';

import type { IPlaceService } from '../../service/interface/IPlaceService';
import type { SearchPlaceFilterParams } from '../../types/searchPlaceFilter';
import type { IPlaceUsecase } from '../interface/IPlaceUsecase';

/**
 * 開催場情報取得ユースケース実装
 */
@injectable()
export class PlaceUsecase implements IPlaceUsecase {
    public constructor(
        @inject('PlaceService')
        private readonly placeService: IPlaceService,
    ) {}

    public async fetch(
        searchPlaceFilterParams: SearchPlaceFilterParams,
    ): Promise<PlaceEntity[]> {
        return this.placeService.fetch(searchPlaceFilterParams);
    }

    public async upsert(entityList: PlaceEntity[]): Promise<UpsertResult> {
        return this.placeService.upsert(entityList);
    }
}
