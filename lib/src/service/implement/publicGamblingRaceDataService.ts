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
            // JRA
            if (raceTypeList.includes(RaceType.JRA)) {
                const raceType: RaceType = RaceType.JRA;
                const searchFilter = new SearchRaceFilterEntity<PlaceEntity>(
                    startDate,
                    finishDate,
                    raceType,
                    placeEntityList?.filter(
                        (placeEntity) =>
                            placeEntity.placeData.raceType === raceType,
                    ) ?? [],
                );
                const repo =
                    type === DataLocation.Storage
                        ? this.raceRepositoryFromStorage
                        : this.jraRaceRepositoryFromHtml;
                const raceEntityList = await this.fetchRaceEntities(
                    repo,
                    searchFilter,
                );
                result.push(...raceEntityList);
            }
            // NAR
            if (raceTypeList.includes(RaceType.NAR)) {
                const raceType: RaceType = RaceType.NAR;
                const searchFilter = new SearchRaceFilterEntity<PlaceEntity>(
                    startDate,
                    finishDate,
                    raceType,
                    placeEntityList?.filter(
                        (placeEntity) =>
                            placeEntity.placeData.raceType === raceType,
                    ) ?? [],
                );
                const repo =
                    type === DataLocation.Storage
                        ? this.raceRepositoryFromStorage
                        : this.narRaceRepositoryFromHtml;
                const raceEntityList = await this.fetchRaceEntities(
                    repo,
                    searchFilter,
                );
                result.push(...raceEntityList);
            }
            // OVERSEAS
            if (raceTypeList.includes(RaceType.OVERSEAS)) {
                const raceType: RaceType = RaceType.OVERSEAS;
                const searchFilter = new SearchRaceFilterEntity<PlaceEntity>(
                    startDate,
                    finishDate,
                    raceType,
                    [],
                );
                const repo =
                    type === DataLocation.Storage
                        ? this.raceRepositoryFromStorage
                        : this.overseasRaceRepositoryFromHtml;
                const raceEntityList = await this.fetchRaceEntities(
                    repo,
                    searchFilter,
                );
                result.push(...raceEntityList);
            }
            // KEIRIN
            if (raceTypeList.includes(RaceType.KEIRIN)) {
                const raceType: RaceType = RaceType.KEIRIN;
                const searchFilter = new SearchRaceFilterEntity<PlaceEntity>(
                    startDate,
                    finishDate,
                    raceType,
                    placeEntityList?.filter(
                        (placeEntity) =>
                            placeEntity.placeData.raceType === raceType,
                    ) ?? [],
                );
                const repo =
                    type === DataLocation.Storage
                        ? this.mechanicalRacingRaceRepositoryFromStorage
                        : this.keirinRaceRepositoryFromHtml;
                const raceEntityList = await this.fetchRaceEntities(
                    repo,
                    searchFilter,
                );
                result.push(...raceEntityList);
            }
            // AUTORACE
            if (raceTypeList.includes(RaceType.AUTORACE)) {
                const raceType: RaceType = RaceType.AUTORACE;
                const searchFilter = new SearchRaceFilterEntity<PlaceEntity>(
                    startDate,
                    finishDate,
                    raceType,
                    placeEntityList?.filter(
                        (placeEntity) =>
                            placeEntity.placeData.raceType === raceType,
                    ) ?? [],
                );
                const repo =
                    type === DataLocation.Storage
                        ? this.mechanicalRacingRaceRepositoryFromStorage
                        : this.autoraceRaceRepositoryFromHtml;
                const raceEntityList = await this.fetchRaceEntities(
                    repo,
                    searchFilter,
                );
                result.push(...raceEntityList);
            }
            // BOATRACE
            if (raceTypeList.includes(RaceType.BOATRACE)) {
                const raceType: RaceType = RaceType.BOATRACE;
                const searchFilter = new SearchRaceFilterEntity<PlaceEntity>(
                    startDate,
                    finishDate,
                    raceType,
                    placeEntityList?.filter(
                        (placeEntity) =>
                            placeEntity.placeData.raceType === raceType,
                    ) ?? [],
                );
                const repo =
                    type === DataLocation.Storage
                        ? this.mechanicalRacingRaceRepositoryFromStorage
                        : this.boatraceRaceRepositoryFromHtml;
                const raceEntityList = await this.fetchRaceEntities(
                    repo,
                    searchFilter,
                );
                result.push(...raceEntityList);
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
            const response = await Promise.all([
                this.saveRaceEntities(
                    this.raceRepositoryFromStorage,
                    RaceType.JRA,
                    raceEntityList.filter(
                        (race) => race.raceData.raceType === RaceType.JRA,
                    ),
                ),
                this.saveRaceEntities(
                    this.raceRepositoryFromStorage,
                    RaceType.NAR,
                    raceEntityList.filter(
                        (race) => race.raceData.raceType === RaceType.NAR,
                    ),
                ),
                this.saveRaceEntities(
                    this.raceRepositoryFromStorage,
                    RaceType.OVERSEAS,
                    raceEntityList.filter(
                        (race) => race.raceData.raceType === RaceType.OVERSEAS,
                    ),
                ),
                this.saveRaceEntities(
                    this.mechanicalRacingRaceRepositoryFromStorage,
                    RaceType.KEIRIN,
                    raceEntityList.filter(
                        (race) => race.raceData.raceType === RaceType.KEIRIN,
                    ),
                ),
                this.saveRaceEntities(
                    this.mechanicalRacingRaceRepositoryFromStorage,
                    RaceType.AUTORACE,
                    raceEntityList.filter(
                        (race) => race.raceData.raceType === RaceType.AUTORACE,
                    ),
                ),
                this.saveRaceEntities(
                    this.mechanicalRacingRaceRepositoryFromStorage,
                    RaceType.BOATRACE,
                    raceEntityList.filter(
                        (race) => race.raceData.raceType === RaceType.BOATRACE,
                    ),
                ),
            ]);
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
     * @param repo
     * @param raceType
     * @param entities
     */
    private async saveRaceEntities<
        TRace extends IRaceEntity<TRace>,
        TPlace extends IPlaceEntity<TPlace>,
    >(
        repo: IRaceRepository<TRace, TPlace>,
        raceType: RaceType,
        entities?: TRace[],
    ): Promise<{
        code: number;
        message: string;
        successDataCount: number;
        failureDataCount: number;
    }> {
        if (entities !== undefined && entities.length > 0) {
            const response = await repo.registerRaceEntityList(
                raceType,
                entities,
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
            message: 'No entities to save',
            successDataCount: 0,
            failureDataCount: 0,
        };
    }

    /**
     * レース種別ごとの取得処理を共通化
     * @param repo
     * @param searchFilter
     */
    private async fetchRaceEntities<
        TPlace extends IPlaceEntity<TPlace>,
        TRace extends IRaceEntity<TRace>,
    >(
        repo: IRaceRepository<TRace, TPlace>,
        searchFilter: SearchRaceFilterEntity<TPlace>,
    ): Promise<TRace[]> {
        return repo.fetchRaceEntityList(searchFilter);
    }
}
