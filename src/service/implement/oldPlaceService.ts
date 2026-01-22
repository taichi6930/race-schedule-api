import { inject, injectable } from 'tsyringe';

import { Logger } from '../../../packages/shared/src/utilities/logger';
import { UpsertResult } from '../../../packages/shared/src/utilities/upsertResult';
import type { OldSearchPlaceFilterEntity } from '../../repository/entity/filter/oldSearchPlaceFilterEntity';
import { OldPlaceEntity } from '../../repository/entity/placeEntity';
import { IPlaceRepository } from '../../repository/interface/IPlaceRepository';
import { DataLocation, DataLocationType } from '../../utility/oldDataType';
import { IOldPlaceService } from '../interface/IOldPlaceService';

@injectable()
export class OldPlaceService implements IOldPlaceService {
    public constructor(
        @inject('PlaceRepositoryFromStorage')
        private readonly repositoryFromStorage: IPlaceRepository,
        @inject('PlaceRepositoryFromHtml')
        private readonly repositoryFromHtml: IPlaceRepository,
    ) {}

    /**
     * 開催場のEntity配列を取得する
     * @param searchPlaceFilter - 場所フィルター情報
     * @param dataLocation - データ取得場所
     */
    @Logger
    public async fetchPlaceEntityList(
        searchPlaceFilter: OldSearchPlaceFilterEntity,
        dataLocation: DataLocationType,
    ): Promise<OldPlaceEntity[]> {
        const repository =
            dataLocation === DataLocation.Storage
                ? this.repositoryFromStorage
                : this.repositoryFromHtml;
        return repository.fetchPlaceEntityList(searchPlaceFilter);
    }

    /**
     * 開催場のEntity配列の更新を行う
     * @param entityList - 場所エンティティ配列
     */
    @Logger
    public async upsertPlaceEntityList(
        entityList: OldPlaceEntity[],
    ): Promise<UpsertResult> {
        return this.repositoryFromStorage.upsertPlaceEntityList(entityList);
    }
}
