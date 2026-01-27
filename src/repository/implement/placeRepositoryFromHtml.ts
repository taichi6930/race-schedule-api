import 'reflect-metadata';

import { inject, injectable } from 'tsyringe';

import { Logger } from '../../../packages/shared/src/utilities/logger';
import { UpsertResult } from '../../../packages/shared/src/utilities/upsertResult';
import { HeldDayData } from '../../domain/heldDayData';
import { PlaceData } from '../../domain/placeData';
import type { IScrapingApiGateway } from '../../gateway/interface/iScrapingApiGateway';
import { OldSearchPlaceFilterEntity } from '../entity/filter/oldSearchPlaceFilterEntity';
import { OldPlaceEntity } from '../entity/placeEntity';
import { IPlaceRepository } from '../interface/IPlaceRepository';

/**
 * 開催場データリポジトリの実装
 * ScrapingAPIを経由して開催場データを取得する
 */
@injectable()
export class PlaceRepositoryFromHtml implements IPlaceRepository {
    public constructor(
        @inject('ScrapingApiGateway')
        private readonly scrapingApiGateway: IScrapingApiGateway,
    ) {}

    /**
     * 開催データを取得する
     * このメソッドで日付の範囲を指定して開催データを取得する
     * ScrapingAPIを経由してデータを取得し、OldPlaceEntityに変換する
     * @param searchFilter
     */
    @Logger
    public async fetchPlaceEntityList(
        searchFilter: OldSearchPlaceFilterEntity,
    ): Promise<OldPlaceEntity[]> {
        const { raceTypeList, startDate, finishDate } = searchFilter;

        // ScrapingAPIを呼び出してPlaceHtmlEntityのリストを取得
        const placeHtmlEntities = await this.scrapingApiGateway.fetchPlaceList(
            raceTypeList,
            startDate,
            finishDate,
        );

        // PlaceHtmlEntityをOldPlaceEntityに変換
        return placeHtmlEntities.map((entity) => {
            // PlaceHeldDaysからHeldDayDataに変換
            const heldDayData = entity.placeHeldDays
                ? HeldDayData.create(
                      entity.placeHeldDays.heldTimes,
                      entity.placeHeldDays.heldDayTimes,
                  )
                : undefined;

            return OldPlaceEntity.createWithoutId(
                PlaceData.create(
                    entity.raceType,
                    entity.datetime,
                    entity.placeName,
                ),
                heldDayData,
                undefined, // gradeは現時点では使用しない
            );
        });
    }

    /**
     * 開催データを登録する
     * HTMLにはデータを登録しない
     */
    @Logger
    public async upsertPlaceEntityList(
        _placeEntityList: OldPlaceEntity[],
    ): Promise<UpsertResult> {
        void _placeEntityList;
        return {
            successCount: 0,
            failureCount: 0,
            failures: [],
        };
    }
}
