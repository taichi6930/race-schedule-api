import { inject, injectable } from 'tsyringe';

import { PlaceEntity } from '../../repository/entity/placeEntity';
import { SearchPlaceFilterEntity } from '../../repository/entity/searchPlaceFilterEntity';
import { IPlaceRepository } from '../../repository/interface/IPlaceRepository';
import { DataLocation, DataLocationType } from '../../utility/dataType';
import { Logger } from '../../utility/logger';
import { RaceType } from '../../utility/raceType';
import { IPlaceDataService } from '../interface/IPlaceDataService';

/**
 * 公開用開催場データサービス
 */
@injectable()
export class PublicGamblingPlaceDataService implements IPlaceDataService {
    public constructor(
        @inject('PlaceRepositoryFromStorage')
        protected placeRepositoryFromStorage: IPlaceRepository<PlaceEntity>,
        @inject('JraPlaceRepositoryFromHtml')
        protected jraPlaceRepositoryFromHtml: IPlaceRepository<PlaceEntity>,
        @inject('NarPlaceRepositoryFromHtml')
        protected narPlaceRepositoryFromHtml: IPlaceRepository<PlaceEntity>,
        @inject('KeirinPlaceRepositoryFromHtml')
        protected keirinPlaceRepositoryFromHtml: IPlaceRepository<PlaceEntity>,
        @inject('AutoracePlaceRepositoryFromHtml')
        protected autoracePlaceRepositoryFromHtml: IPlaceRepository<PlaceEntity>,
        @inject('BoatracePlaceRepositoryFromHtml')
        protected boatracePlaceRepositoryFromHtml: IPlaceRepository<PlaceEntity>,
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

        try {
            if (raceTypeList.length === 0 && type !== DataLocation.Storage) {
                console.warn('raceTypeListが空の場合、空を返します');
                return result;
            }
            if (raceTypeList.includes(RaceType.JRA)) {
                const raceType = RaceType.JRA;
                const placeEntityList: PlaceEntity[] = await (
                    type === DataLocation.Storage
                        ? this.placeRepositoryFromStorage
                        : this.jraPlaceRepositoryFromHtml
                ).fetchPlaceEntityList(
                    new SearchPlaceFilterEntity(
                        startDate,
                        finishDate,
                        raceType,
                    ),
                );
                result.push(...placeEntityList);
            }
            if (raceTypeList.includes(RaceType.NAR)) {
                const raceType = RaceType.NAR;
                const placeEntityList: PlaceEntity[] = await (
                    type === DataLocation.Storage
                        ? this.placeRepositoryFromStorage
                        : this.narPlaceRepositoryFromHtml
                ).fetchPlaceEntityList(
                    new SearchPlaceFilterEntity(
                        startDate,
                        finishDate,
                        raceType,
                    ),
                );
                result.push(...placeEntityList);
            }
            if (raceTypeList.includes(RaceType.KEIRIN)) {
                const raceType = RaceType.KEIRIN;
                const placeEntityList: PlaceEntity[] = await (
                    type === DataLocation.Storage
                        ? this.placeRepositoryFromStorage
                        : this.keirinPlaceRepositoryFromHtml
                ).fetchPlaceEntityList(
                    new SearchPlaceFilterEntity(
                        startDate,
                        finishDate,
                        raceType,
                    ),
                );
                result.push(...placeEntityList);
            }
            if (raceTypeList.includes(RaceType.AUTORACE)) {
                const raceType = RaceType.AUTORACE;
                const placeEntityList: PlaceEntity[] = await (
                    type === DataLocation.Storage
                        ? this.placeRepositoryFromStorage
                        : this.autoracePlaceRepositoryFromHtml
                ).fetchPlaceEntityList(
                    new SearchPlaceFilterEntity(
                        startDate,
                        finishDate,
                        raceType,
                    ),
                );
                result.push(...placeEntityList);
            }
            if (raceTypeList.includes(RaceType.BOATRACE)) {
                const raceType = RaceType.BOATRACE;
                const placeEntityList: PlaceEntity[] = await (
                    type === DataLocation.Storage
                        ? this.placeRepositoryFromStorage
                        : this.boatracePlaceRepositoryFromHtml
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
            const response = {
                [RaceType.JRA]:
                    await this.placeRepositoryFromStorage.registerPlaceEntityList(
                        RaceType.JRA,
                        placeEntityList.filter(
                            (item) => item.placeData.raceType === RaceType.JRA,
                        ),
                    ),
                [RaceType.NAR]:
                    await this.placeRepositoryFromStorage.registerPlaceEntityList(
                        RaceType.NAR,
                        placeEntityList.filter(
                            (item) => item.placeData.raceType === RaceType.NAR,
                        ),
                    ),
                [RaceType.OVERSEAS]: {
                    code: 200,
                    successData: [],
                    failureData: [],
                },
                [RaceType.KEIRIN]:
                    await this.placeRepositoryFromStorage.registerPlaceEntityList(
                        RaceType.KEIRIN,
                        placeEntityList.filter(
                            (item) =>
                                item.placeData.raceType === RaceType.KEIRIN,
                        ),
                    ),
                [RaceType.AUTORACE]:
                    await this.placeRepositoryFromStorage.registerPlaceEntityList(
                        RaceType.AUTORACE,
                        placeEntityList.filter(
                            (item) =>
                                item.placeData.raceType === RaceType.AUTORACE,
                        ),
                    ),
                [RaceType.BOATRACE]:
                    await this.placeRepositoryFromStorage.registerPlaceEntityList(
                        RaceType.BOATRACE,
                        placeEntityList.filter(
                            (item) =>
                                item.placeData.raceType === RaceType.BOATRACE,
                        ),
                    ),
            };

            return {
                code:
                    response[RaceType.JRA].code === 200 &&
                    response[RaceType.NAR].code === 200 &&
                    response[RaceType.KEIRIN].code === 200 &&
                    response[RaceType.AUTORACE].code === 200 &&
                    response[RaceType.BOATRACE].code === 200
                        ? 200
                        : 500,
                message:
                    response[RaceType.JRA].code === 200 &&
                    response[RaceType.NAR].code === 200 &&
                    response[RaceType.KEIRIN].code === 200 &&
                    response[RaceType.AUTORACE].code === 200 &&
                    response[RaceType.BOATRACE].code === 200
                        ? '保存に成功しました'
                        : '一部のデータの保存に失敗しました',
                successDataCount:
                    response[RaceType.JRA].successData.length +
                    response[RaceType.NAR].successData.length +
                    response[RaceType.KEIRIN].successData.length +
                    response[RaceType.AUTORACE].successData.length +
                    response[RaceType.BOATRACE].successData.length,
                failureDataCount:
                    response[RaceType.JRA].failureData.length +
                    response[RaceType.NAR].failureData.length +
                    response[RaceType.KEIRIN].failureData.length +
                    response[RaceType.AUTORACE].failureData.length +
                    response[RaceType.BOATRACE].failureData.length,
            };
        } catch (error) {
            console.error('開催場データの保存/更新に失敗しました', error);
            throw error;
        }
    }
}
