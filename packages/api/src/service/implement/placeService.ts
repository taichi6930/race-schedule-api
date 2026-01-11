import type { PlaceEntity } from '@race-schedule/shared/src/entity/placeEntity';
import { inject, injectable } from 'tsyringe';

import type { IPlaceRepository } from '../../repository/interface/IPlaceRepository';
import type { SearchPlaceFilterParams } from '../../types/searchPlaceFilter';
import type { IPlaceService } from '../interface/IPlaceService';

/**
 * 開催場情報取得サービス実装
 */
@injectable()
export class PlaceService implements IPlaceService {
    public constructor(
        @inject('PlaceRepository')
        private readonly placeRepository: IPlaceRepository,
    ) {}

    public async fetch(
        searchPlaceFilterParams: SearchPlaceFilterParams,
    ): Promise<PlaceEntity[]> {
        return this.placeRepository.fetch(searchPlaceFilterParams);
    }
}
