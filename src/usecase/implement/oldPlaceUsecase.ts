import { inject, injectable } from 'tsyringe';

import { Logger } from '../../../packages/shared/src/utilities/logger';
import { UpsertResult } from '../../../packages/shared/src/utilities/upsertResult';
import { OldSearchPlaceFilterEntity } from '../../repository/entity/filter/oldSearchPlaceFilterEntity';
import { PlaceEntity } from '../../repository/entity/placeEntity';
import { IOldPlaceService } from '../../service/interface/IOldPlaceService';
import { DataLocation } from '../../utility/dataType';
import { IOldPlaceUseCase } from '../interface/IOldPlaceUsecase';

/**
 * レース開催場所ユースケースの実装
 */
@injectable()
export class OldPlaceUseCase implements IOldPlaceUseCase {
    public constructor(
        @inject('PlaceService')
        private readonly placeService: IOldPlaceService,
    ) {}

    /**
     * レース開催場所のEntity配列を取得する
     * @param searchPlaceFilter - 場所フィルター情報
     */
    @Logger
    public async fetchPlaceEntityList(
        searchPlaceFilter: OldSearchPlaceFilterEntity,
    ): Promise<PlaceEntity[]> {
        return this.placeService.fetchPlaceEntityList(
            searchPlaceFilter,
            DataLocation.Storage,
        );
    }

    /**
     * レース開催場所のEntity配列の更新を行う
     * @param searchPlaceFilter - 場所フィルター情報
     */
    @Logger
    public async upsertPlaceEntityList(
        searchPlaceFilter: OldSearchPlaceFilterEntity,
    ): Promise<UpsertResult> {
        const entityList: PlaceEntity[] =
            await this.placeService.fetchPlaceEntityList(
                searchPlaceFilter,
                DataLocation.Web,
            );
        return this.placeService.upsertPlaceEntityList(entityList);
    }
}
