import { inject, injectable } from 'tsyringe';

import { SearchPlaceFilterEntity } from '../../repository/entity/filter/searchPlaceFilterEntity';
import { PlaceEntity } from '../../repository/entity/placeEntity';
import { IPlaceService } from '../../service/interface/IPlaceService';
import { DataLocation } from '../../utility/dataType';
import { Logger } from '../../utility/logger';
import { UpsertResult } from '../../utility/upsertResult';
import { IPlaceUseCase } from '../interface/IPlaceUsecase';

/**
 * 開催場ユースケースの実装
 */
@injectable()
export class PlaceUseCase implements IPlaceUseCase {
    public constructor(
        @inject('PlaceService')
        private readonly placeService: IPlaceService,
    ) {}

    /**
     * 開催場のEntity配列を取得する
     * @param searchPlaceFilter - 場所フィルター情報
     */
    @Logger
    public async fetchPlaceEntityList(
        searchPlaceFilter: SearchPlaceFilterEntity,
    ): Promise<PlaceEntity[]> {
        return this.placeService.fetchPlaceEntityList(
            searchPlaceFilter,
            DataLocation.Storage,
        );
    }

    /**
     * 開催場のEntity配列の更新を行う
     * @param searchPlaceFilter - 場所フィルター情報
     */
    @Logger
    public async upsertPlaceEntityList(
        searchPlaceFilter: SearchPlaceFilterEntity,
    ): Promise<UpsertResult> {
        const entityList: PlaceEntity[] =
            await this.placeService.fetchPlaceEntityList(
                searchPlaceFilter,
                DataLocation.Web,
            );
        return this.placeService.upsertPlaceEntityList(entityList);
    }
}
