import { inject, injectable } from 'tsyringe';

import { IPlaceEntity } from '../../repository/entity/iPlaceEntity';
import { IRaceEntity } from '../../repository/entity/iRaceEntity';
import { PlaceEntity } from '../../repository/entity/placeEntity';
import { RaceEntity } from '../../repository/entity/raceEntity';
import { SearchRaceFilterEntity } from '../../repository/entity/searchRaceFilterEntity';
import { IRaceRepository } from '../../repository/interface/IRaceRepository';
import { DataLocation, DataLocationType } from '../../utility/dataType';
import { Logger } from '../../utility/logger';
import { RaceType } from '../../utility/raceType';
import { IRaceDataService } from '../interface/IRaceDataService';

/**
 * 開催場所データの取得と更新を担当する基底サービスクラス
 */
@injectable()
export class PublicGamblingRaceDataService implements IRaceDataService {
    public constructor(
        @inject('RaceRepositoryFromStorage')
        protected raceRepositoryFromStorage: IRaceRepository<
            RaceEntity,
            PlaceEntity
        >,
        @inject('JraRaceRepositoryFromHtml')
        protected jraRaceRepositoryFromHtml: IRaceRepository<
            RaceEntity,
            PlaceEntity
        >,
        @inject('NarRaceRepositoryFromHtml')
        protected narRaceRepositoryFromHtml: IRaceRepository<
            RaceEntity,
            PlaceEntity
        >,
        @inject('OverseasRaceRepositoryFromHtml')
        protected readonly overseasRaceRepositoryFromHtml: IRaceRepository<
            RaceEntity,
            PlaceEntity
        >,
        @inject('KeirinRaceRepositoryFromHtml')
        protected keirinRaceRepositoryFromHtml: IRaceRepository<
            RaceEntity,
            PlaceEntity
        >,
        @inject('AutoraceRaceRepositoryFromHtml')
        protected autoraceRaceRepositoryFromHtml: IRaceRepository<
            RaceEntity,
            PlaceEntity
        >,
        @inject('BoatraceRaceRepositoryFromHtml')
        protected boatraceRaceRepositoryFromHtml: IRaceRepository<
            RaceEntity,
            PlaceEntity
        >,
        @inject('MechanicalRacingRaceRepositoryFromStorage')
        protected mechanicalRacingRaceRepositoryFromStorage: IRaceRepository<
            RaceEntity,
            PlaceEntity
        >,
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
     * @param placeEntityList
     * @returns 開催場所エンティティの配列。エラー時は空配列
     * @throws エラーはキャッチされログ出力されます
     * @remarks Loggerデコレータにより、処理の開始・終了・エラーが自動的にログに記録されます
     */
    @Logger
    public async fetchRaceEntityList(
        startDate: Date,
        finishDate: Date,
        raceTypeList: RaceType[],
        type: DataLocationType,
        placeEntityList?: PlaceEntity[],
    ): Promise<RaceEntity[]> {
        const result: RaceEntity[] = [];

        try {
            for (const { raceType, repository } of [
                {
                    raceType: RaceType.JRA,
                    repository:
                        type === DataLocation.Storage
                            ? this.raceRepositoryFromStorage
                            : this.jraRaceRepositoryFromHtml,
                },
                {
                    raceType: RaceType.NAR,
                    repository:
                        type === DataLocation.Storage
                            ? this.raceRepositoryFromStorage
                            : this.narRaceRepositoryFromHtml,
                },
                {
                    raceType: RaceType.OVERSEAS,
                    repository:
                        type === DataLocation.Storage
                            ? this.raceRepositoryFromStorage
                            : this.overseasRaceRepositoryFromHtml,
                },
                {
                    raceType: RaceType.KEIRIN,
                    repository:
                        type === DataLocation.Storage
                            ? this.mechanicalRacingRaceRepositoryFromStorage
                            : this.keirinRaceRepositoryFromHtml,
                },
                {
                    raceType: RaceType.AUTORACE,
                    repository:
                        type === DataLocation.Storage
                            ? this.mechanicalRacingRaceRepositoryFromStorage
                            : this.autoraceRaceRepositoryFromHtml,
                },
                {
                    raceType: RaceType.BOATRACE,
                    repository:
                        type === DataLocation.Storage
                            ? this.mechanicalRacingRaceRepositoryFromStorage
                            : this.boatraceRaceRepositoryFromHtml,
                },
            ]) {
                if (raceTypeList.includes(raceType)) {
                    const searchFilter =
                        new SearchRaceFilterEntity<PlaceEntity>(
                            startDate,
                            finishDate,
                            raceType,
                            placeEntityList?.filter(
                                (placeEntity) =>
                                    placeEntity.placeData.raceType === raceType,
                            ) ?? [],
                        );
                    const raceEntityList =
                        await this.fetchRaceEntityListFromRepository(
                            repository,
                            searchFilter,
                        );
                    result.push(...raceEntityList);
                }
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
     * @param raceEntityList
     * @param raceEntityList.jra
     * @param raceEntityList.nar
     * @param raceEntityList.overseas
     * @param raceEntityList.keirin
     * @param raceEntityList.autorace
     * @param raceEntityList.boatrace
     * @throws Error データの保存/更新に失敗した場合
     */
    @Logger
    public async updateRaceEntityList(raceEntityList: RaceEntity[]): Promise<{
        code: number;
        message: string;
        successDataCount: number;
        failureDataCount: number;
    }> {
        try {
            const response = await Promise.all(
                [
                    {
                        raceType: RaceType.JRA,
                        repository: this.raceRepositoryFromStorage,
                    },
                    {
                        raceType: RaceType.NAR,
                        repository: this.raceRepositoryFromStorage,
                    },
                    {
                        raceType: RaceType.OVERSEAS,
                        repository: this.raceRepositoryFromStorage,
                    },
                    {
                        raceType: RaceType.KEIRIN,
                        repository:
                            this.mechanicalRacingRaceRepositoryFromStorage,
                    },
                    {
                        raceType: RaceType.AUTORACE,
                        repository:
                            this.mechanicalRacingRaceRepositoryFromStorage,
                    },
                    {
                        raceType: RaceType.BOATRACE,
                        repository:
                            this.mechanicalRacingRaceRepositoryFromStorage,
                    },
                ].map(async ({ repository, raceType }) =>
                    this.saveRaceEntityList(
                        repository,
                        raceType,
                        raceEntityList.filter(
                            (race) => race.raceData.raceType === raceType,
                        ),
                    ),
                ),
            );
            return {
                // 全てが200なら200を返す
                code: response.every((res) => res.code === 200) ? 200 : 500,
                // 全てのメッセージをsetで結合
                message: [...new Set(response.map((res) => res.message))].join(
                    ', ',
                ),
                successDataCount: response.reduce(
                    (acc, res) => acc + res.successDataCount,
                    0,
                ),
                failureDataCount: response.reduce(
                    (acc, res) => acc + res.failureDataCount,
                    0,
                ),
            };
        } catch (error) {
            console.error('開催場データの保存/更新に失敗しました', error);
            throw error;
        }
    }

    /**
     * レース種別ごとの保存処理を共通化
     * @param repository
     * @param raceType
     * @param entityList
     */
    private async saveRaceEntityList<
        TRace extends IRaceEntity<TRace>,
        TPlace extends IPlaceEntity<TPlace>,
    >(
        repository: IRaceRepository<TRace, TPlace>,
        raceType: RaceType,
        entityList?: TRace[],
    ): Promise<{
        code: number;
        message: string;
        successDataCount: number;
        failureDataCount: number;
    }> {
        if (entityList !== undefined && entityList.length > 0) {
            const response = await repository.registerRaceEntityList(
                raceType,
                entityList,
            );
            return {
                code: response.code,
                message: response.message,
                successDataCount: response.successData.length,
                failureDataCount: response.failureData.length,
            };
        }
        return {
            code: 200,
            message: 'No entityList to save',
            successDataCount: 0,
            failureDataCount: 0,
        };
    }

    /**
     * レース種別ごとの取得処理を共通化
     * @param repository
     * @param searchFilter
     */
    private async fetchRaceEntityListFromRepository<
        TPlace extends IPlaceEntity<TPlace>,
        TRace extends IRaceEntity<TRace>,
    >(
        repository: IRaceRepository<TRace, TPlace>,
        searchFilter: SearchRaceFilterEntity<TPlace>,
    ): Promise<TRace[]> {
        return repository.fetchRaceEntityList(searchFilter);
    }
}
