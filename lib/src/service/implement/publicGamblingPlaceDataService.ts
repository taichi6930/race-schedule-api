import { inject, injectable } from 'tsyringe';

import { PlaceEntity } from '../../repository/entity/placeEntity';
import { SearchPlaceFilterEntity } from '../../repository/entity/searchPlaceFilterEntity';
import { IPlaceRepository } from '../../repository/interface/IPlaceRepository';
import { DataLocation, DataLocationType } from '../../utility/dataType';
import { Logger } from '../../utility/logger';
import { ALL_RACE_TYPE_LIST, RaceType } from '../../utility/raceType';
import { IPlaceDataService } from '../interface/IPlaceDataService';

/**
 * 公開用開催場データサービス
 */
@injectable()
export class PublicGamblingPlaceDataService implements IPlaceDataService {
    public constructor(
        @inject('PlaceRepositoryFromStorage')
        protected placeRepositoryFromStorage: IPlaceRepository,
        @inject('JraPlaceRepositoryFromHtml')
        protected jraPlaceRepositoryFromHtml: IPlaceRepository,
        @inject('NarPlaceRepositoryFromHtml')
        protected narPlaceRepositoryFromHtml: IPlaceRepository,
        @inject('KeirinPlaceRepositoryFromHtml')
        protected keirinPlaceRepositoryFromHtml: IPlaceRepository,
        @inject('AutoracePlaceRepositoryFromHtml')
        protected autoracePlaceRepositoryFromHtml: IPlaceRepository,
        @inject('BoatracePlaceRepositoryFromHtml')
        protected boatracePlaceRepositoryFromHtml: IPlaceRepository,
    ) {}

    /**
     * 指定された期間の開催場所データを取得します
     *
     * このメソッドは、指定されたデータソース（StorageまたはWeb）から
     * 開催場所情報を取得します。エラーが発生した場合は空配列を返し、
     * アプリケーションの継続性を保証します。
     *
     * レースデータ取得の前提として使用され、開催場所の基本情報を
     * 提供する重要な役割を持ちます。
     * @param startDate - 取得開始日
     * @param finishDate - 取得終了日（この日を含む）
     * @param raceTypeList - レース種別のリスト
     * @param type - データ取得元の指定（storage/web）
     * @returns 開催場所エンティティの配列。エラー時は空配列
     * @throws エラーはキャッチされログ出力されます
     * @remarks Loggerデコレータにより、処理の開始・終了・エラーが自動的にログに記録されます
     */
    @Logger
    public async fetchPlaceEntityList(
        startDate: Date,
        finishDate: Date,
        raceTypeList: RaceType[],
        type: DataLocationType,
    ): Promise<PlaceEntity[]> {
        const result: PlaceEntity[] = [];

        const placeRepositoryFromHtml = {
            [RaceType.JRA]: this.jraPlaceRepositoryFromHtml,
            [RaceType.NAR]: this.narPlaceRepositoryFromHtml,
            [RaceType.OVERSEAS]: undefined, // 海外競馬は対象外
            [RaceType.KEIRIN]: this.keirinPlaceRepositoryFromHtml,
            [RaceType.AUTORACE]: this.autoracePlaceRepositoryFromHtml,
            [RaceType.BOATRACE]: this.boatracePlaceRepositoryFromHtml,
        };

        try {
            for (const raceType of [
                RaceType.JRA,
                RaceType.NAR,
                RaceType.KEIRIN,
                RaceType.AUTORACE,
                RaceType.BOATRACE,
            ]) {
                if (!raceTypeList.includes(raceType)) continue;

                const placeEntityList: PlaceEntity[] = await (
                    type === DataLocation.Storage
                        ? this.placeRepositoryFromStorage
                        : placeRepositoryFromHtml[raceType]
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
            return result;
        }
    }

    /**
     * 開催場所データをStorageに保存/更新します
     *
     * 既存のデータが存在する場合は上書き、存在しない場合は新規作成します。
     * このメソッドは一般的にWebから取得した最新データを保存する際に使用されます。
     * @param placeEntityList - 保存/更新する開催場所エンティティの配列
     * @throws Error データの保存/更新に失敗した場合
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
            const responseList = await Promise.all(
                ALL_RACE_TYPE_LIST.map(async (raceType) =>
                    this.placeRepositoryFromStorage.registerPlaceEntityList(
                        raceType,
                        placeEntityList.filter(
                            (item) => item.placeData.raceType === raceType,
                        ),
                    ),
                ),
            );

            return {
                code: responseList.every((res) => res.code === 200) ? 200 : 500,
                message: responseList.every((res) => res.code === 200)
                    ? '保存に成功しました'
                    : '一部のデータの保存に失敗しました',
                successDataCount: responseList.reduce(
                    (acc: number, res: { successData: PlaceEntity[] }) =>
                        acc + res.successData.length,
                    0,
                ),
                failureDataCount: responseList.reduce(
                    (acc: number, res: { failureData: PlaceEntity[] }) =>
                        acc + res.failureData.length,
                    0,
                ),
            };
        } catch (error) {
            console.error('開催場データの保存/更新に失敗しました', error);
            throw error;
        }
    }
}
