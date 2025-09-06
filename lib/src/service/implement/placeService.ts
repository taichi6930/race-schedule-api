import { inject, injectable } from 'tsyringe';

import { PlaceEntityForAWS } from '../../repository/entity/placeEntity';
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
    ): Promise<PlaceEntityForAWS[]> {
        try {
            const result: PlaceEntityForAWS[] = [];
            for (const raceType of RACE_TYPE_LIST_WITHOUT_OVERSEAS) {
                if (!raceTypeList.includes(raceType)) continue;

                const placeEntityList: PlaceEntityForAWS[] = await (
                    type === DataLocation.Storage
                        ? this.placeRepositoryFromStorage
                        : this.placeRepositoryFromHtml
                ).fetchPlaceEntityList(
                    new SearchPlaceFilterEntity(
                        startDate,
                        finishDate,
                        raceType,
                    ),
                );
                result.push(...placeEntityList);
            }
            return result;
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
        placeEntityList: PlaceEntityForAWS[],
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
            const responseList = await Promise.all(
                RACE_TYPE_LIST_ALL.map(async (raceType) => {
                    if (
                        placeEntityList.filter(
                            (item) => item.placeData.raceType === raceType,
                        ).length === 0
                    )
                        return {
                            code: 200,
                            message: '保存するデータがありません',
                            successDataCount: 0,
                            failureDataCount: 0,
                        };
                    return this.placeRepositoryFromStorage.registerPlaceEntityList(
                        raceType,
                        placeEntityList.filter(
                            (item) => item.placeData.raceType === raceType,
                        ),
                    );
                }),
            );

            return {
                code: responseList.every((res) => res.code === 200) ? 200 : 500,
                message: responseList.every((res) => res.code === 200)
                    ? '保存に成功しました'
                    : '一部のデータの保存に失敗しました',
                successDataCount: responseList.reduce(
                    (acc: number, res) =>
                        acc +
                        ('successData' in res
                            ? res.successData.length
                            : res.successDataCount),
                    0,
                ),
                failureDataCount: responseList.reduce(
                    (acc: number, res) =>
                        acc +
                        ('failureData' in res
                            ? res.failureData.length
                            : res.failureDataCount),
                    0,
                ),
            };
        } catch (error) {
            console.error('開催場データの保存/更新に失敗しました', error);
            throw error;
        }
    }
}
