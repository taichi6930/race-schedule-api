import { inject, injectable } from 'tsyringe';

import { PlaceEntity } from '../../repository/entity/placeEntity';
import { SearchPlaceFilterEntity } from '../../repository/entity/searchPlaceFilterEntity';
import { IPlaceRepository } from '../../repository/interface/IPlaceRepository';
import { DataLocation, DataLocationType } from '../../utility/dataType';
import { Logger } from '../../utility/logger';
import {
    RACE_TYPE_LIST_ALL,
    RACE_TYPE_LIST_WITHOUT_OVERSEAS,
    RaceType,
} from '../../utility/raceType';
import { IPlaceService } from '../interface/IPlaceService';

/**
 * 公営競技の開催場データを提供するサービス
 */
@injectable()
export class PlaceService implements IPlaceService {
    public constructor(
        @inject('PlaceRepositoryFromStorage')
        protected placeRepositoryFromStorage: IPlaceRepository,
        @inject('PlaceRepositoryFromHtml')
        protected placeRepositoryFromHtml: IPlaceRepository,
    ) {}

    private getRepository(type: DataLocationType): IPlaceRepository {
        return type === DataLocation.Storage
            ? this.placeRepositoryFromStorage
            : this.placeRepositoryFromHtml;
    }

    /**
     * 指定期間・種別の開催場所データを取得
     * @param startDate - 取得開始日
     * @param finishDate - 取得終了日（含む）
     * @param raceTypeList - レース種別リスト
     * @param type - データ取得元（storage/web）
     * @returns 開催場所エンティティ配列（エラー時は空配列）
     */
    @Logger
    public async fetchPlaceEntityList(
        startDate: Date,
        finishDate: Date,
        raceTypeList: RaceType[],
        type: DataLocationType,
    ): Promise<PlaceEntity[]> {
        const repo = this.getRepository(type);
        try {
            const tasks = RACE_TYPE_LIST_WITHOUT_OVERSEAS.filter((raceType) =>
                raceTypeList.includes(raceType),
            ).map(async (raceType) =>
                repo.fetchPlaceEntityList(
                    new SearchPlaceFilterEntity(
                        startDate,
                        finishDate,
                        raceType,
                    ),
                ),
            );

            const results = await Promise.all(tasks);
            // flatten array of arrays
            return results.flat();
        } catch (error) {
            console.error('開催場データの取得に失敗しました', error);
            return [];
        }
    }

    /**
     * 開催場所データをStorageに保存・更新
     * @param placeEntityList - 保存・更新する開催場所エンティティ配列
     * @throws Error 保存・更新に失敗した場合
     */
    @Logger
    public async updatePlaceEntityList(
        placeEntityList: PlaceEntity[],
    ): Promise<{
        code: number;
        message: string;
        successDataCount: number;
        failureDataCount: number;
    }> {
        if (placeEntityList.length === 0)
            return {
                code: 200,
                message: '保存するデータがありません',
                successDataCount: 0,
                failureDataCount: 0,
            };
        try {
            const tasks = RACE_TYPE_LIST_ALL.map(async (raceType) =>
                this.placeRepositoryFromStorage.registerPlaceEntityList(
                    raceType,
                    placeEntityList.filter(
                        (item) => item.placeData.raceType === raceType,
                    ),
                ),
            );

            const responseList = await Promise.all(tasks);

            const allSuccess = responseList.every((res) => res.code === 200);
            const successDataCount = responseList.reduce(
                (acc: number, res: { successData: PlaceEntity[] }) =>
                    acc + res.successData.length,
                0,
            );

            const failureDataCount = responseList.reduce(
                (acc: number, res: { failureData: PlaceEntity[] }) =>
                    acc + res.failureData.length,
                0,
            );

            return {
                code: allSuccess ? 200 : 500,
                message: allSuccess
                    ? '保存に成功しました'
                    : '一部のデータの保存に失敗しました',
                successDataCount,
                failureDataCount,
            };
        } catch (error) {
            console.error('開催場データの保存/更新に失敗しました', error);
            throw error;
        }
    }
}
