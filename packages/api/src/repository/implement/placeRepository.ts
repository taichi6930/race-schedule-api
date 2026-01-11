import type { PlaceEntity } from '@race-schedule/shared/src/entity/placeEntity';
import { injectable } from 'tsyringe';

import type { SearchPlaceFilterParams } from '../../types/searchPlaceFilter';
import type { IPlaceRepository } from '../interface/IPlaceRepository';

/**
 * 開催場情報取得リポジトリ実装
 */
@injectable()
export class PlaceRepository implements IPlaceRepository {
    public async fetch(
        _searchPlaceFilterParams: SearchPlaceFilterParams,
    ): Promise<PlaceEntity[]> {
        console.log(_searchPlaceFilterParams);
        // TODO: 実際のデータ取得処理を実装
        return [];
    }
}
