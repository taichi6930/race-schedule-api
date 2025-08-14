import { inject, injectable } from 'tsyringe';

import { HorseRacingPlaceEntity } from '../../repository/entity/horseRacingPlaceEntity';
import { HorseRacingRaceEntity } from '../../repository/entity/horseRacingRaceEntity';
import { IPlaceEntity } from '../../repository/entity/iPlaceEntity';
import { IRaceEntity } from '../../repository/entity/iRaceEntity';
import { JraPlaceEntity } from '../../repository/entity/jraPlaceEntity';
import { JraRaceEntity } from '../../repository/entity/jraRaceEntity';
import { MechanicalRacingPlaceEntity } from '../../repository/entity/mechanicalRacingPlaceEntity';
import { MechanicalRacingRaceEntity } from '../../repository/entity/mechanicalRacingRaceEntity';
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
        @inject('JraRaceRepositoryFromStorage')
        protected jraRaceRepositoryFromStorage: IRaceRepository<
            JraRaceEntity,
            JraPlaceEntity
        >,
        @inject('JraRaceRepositoryFromHtml')
        protected jraRaceRepositoryFromHtml: IRaceRepository<
            JraRaceEntity,
            JraPlaceEntity
        >,
        @inject('NarRaceRepositoryFromStorage')
        protected narRaceRepositoryFromStorage: IRaceRepository<
            HorseRacingRaceEntity,
            HorseRacingPlaceEntity
        >,
        @inject('NarRaceRepositoryFromHtml')
        protected narRaceRepositoryFromHtml: IRaceRepository<
            HorseRacingRaceEntity,
            HorseRacingPlaceEntity
        >,
        @inject('WorldRaceRepositoryFromStorage')
        protected readonly worldRaceRepositoryFromStorage: IRaceRepository<
            HorseRacingRaceEntity,
            HorseRacingPlaceEntity
        >,
        @inject('WorldRaceRepositoryFromHtml')
        protected readonly worldRaceRepositoryFromHtml: IRaceRepository<
            HorseRacingRaceEntity,
            HorseRacingPlaceEntity
        >,
        @inject('KeirinRaceRepositoryFromHtml')
        protected keirinRaceRepositoryFromHtml: IRaceRepository<
            MechanicalRacingRaceEntity,
            MechanicalRacingPlaceEntity
        >,
        @inject('AutoraceRaceRepositoryFromHtml')
        protected autoraceRaceRepositoryFromHtml: IRaceRepository<
            MechanicalRacingRaceEntity,
            MechanicalRacingPlaceEntity
        >,
        @inject('BoatraceRaceRepositoryFromHtml')
        protected boatraceRaceRepositoryFromHtml: IRaceRepository<
            MechanicalRacingRaceEntity,
            MechanicalRacingPlaceEntity
        >,
        @inject('MechanicalRacingRaceRepositoryFromStorage')
        protected mechanicalRacingRaceRepositoryFromStorage: IRaceRepository<
            MechanicalRacingRaceEntity,
            MechanicalRacingPlaceEntity
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
     * @param placeEntityList.jra
     * @param placeEntityList.nar
     * @param placeEntityList.world
     * @param placeEntityList.keirin
     * @param placeEntityList.autorace
     * @param placeEntityList.boatrace
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
        placeEntityList?: {
            jra?: JraPlaceEntity[];
            nar?: HorseRacingPlaceEntity[];
            world?: HorseRacingPlaceEntity[];
            keirin?: MechanicalRacingPlaceEntity[];
            autorace?: MechanicalRacingPlaceEntity[];
            boatrace?: MechanicalRacingPlaceEntity[];
        },
    ): Promise<{
        jra: JraRaceEntity[];
        nar: HorseRacingRaceEntity[];
        world: HorseRacingRaceEntity[];
        keirin: MechanicalRacingRaceEntity[];
        autorace: MechanicalRacingRaceEntity[];
        boatrace: MechanicalRacingRaceEntity[];
    }> {
        const result: {
            jra: JraRaceEntity[];
            nar: HorseRacingRaceEntity[];
            world: HorseRacingRaceEntity[];
            keirin: MechanicalRacingRaceEntity[];
            autorace: MechanicalRacingRaceEntity[];
            boatrace: MechanicalRacingRaceEntity[];
        } = {
            jra: [],
            nar: [],
            world: [],
            keirin: [],
            autorace: [],
            boatrace: [],
        };

        try {
            // JRA
            if (
                raceTypeList.includes(RaceType.JRA) ||
                (placeEntityList?.jra !== undefined &&
                    placeEntityList.jra.length > 0)
            ) {
                const searchFilter = new SearchRaceFilterEntity<JraPlaceEntity>(
                    startDate,
                    finishDate,
                    RaceType.JRA,
                    placeEntityList?.jra,
                );
                const repo =
                    type === DataLocation.Storage
                        ? this.jraRaceRepositoryFromStorage
                        : this.jraRaceRepositoryFromHtml;
                const jraRaceEntityList = await this.fetchRaceEntities(
                    repo,
                    searchFilter,
                );
                result.jra.push(...jraRaceEntityList);
            }
            // NAR
            if (
                raceTypeList.includes(RaceType.NAR) ||
                (placeEntityList?.nar !== undefined &&
                    placeEntityList.nar.length > 0)
            ) {
                const searchFilter =
                    new SearchRaceFilterEntity<HorseRacingPlaceEntity>(
                        startDate,
                        finishDate,
                        RaceType.NAR,
                        placeEntityList?.nar,
                    );
                const repo =
                    type === DataLocation.Storage
                        ? this.narRaceRepositoryFromStorage
                        : this.narRaceRepositoryFromHtml;
                const narRaceEntityList = await this.fetchRaceEntities(
                    repo,
                    searchFilter,
                );
                result.nar.push(...narRaceEntityList);
            }
            // WORLD
            if (raceTypeList.includes(RaceType.WORLD)) {
                const searchFilter =
                    new SearchRaceFilterEntity<HorseRacingPlaceEntity>(
                        startDate,
                        finishDate,
                        RaceType.WORLD,
                    );
                const repo =
                    type === DataLocation.Storage
                        ? this.worldRaceRepositoryFromStorage
                        : this.worldRaceRepositoryFromHtml;
                const worldRaceEntityList = await this.fetchRaceEntities(
                    repo,
                    searchFilter,
                );
                result.world.push(...worldRaceEntityList);
            }
            // KEIRIN
            if (
                raceTypeList.includes(RaceType.KEIRIN) ||
                (placeEntityList?.keirin !== undefined &&
                    placeEntityList.keirin.length > 0)
            ) {
                const searchFilter =
                    new SearchRaceFilterEntity<MechanicalRacingPlaceEntity>(
                        startDate,
                        finishDate,
                        RaceType.KEIRIN,
                        placeEntityList?.keirin,
                    );
                const repo =
                    type === DataLocation.Storage
                        ? this.mechanicalRacingRaceRepositoryFromStorage
                        : this.keirinRaceRepositoryFromHtml;
                const keirinRaceEntityList = await this.fetchRaceEntities(
                    repo,
                    searchFilter,
                );
                result.keirin.push(...keirinRaceEntityList);
            }
            // AUTORACE
            if (
                raceTypeList.includes(RaceType.AUTORACE) ||
                (placeEntityList?.autorace !== undefined &&
                    placeEntityList.autorace.length > 0)
            ) {
                const searchFilter =
                    new SearchRaceFilterEntity<MechanicalRacingPlaceEntity>(
                        startDate,
                        finishDate,
                        RaceType.AUTORACE,
                        placeEntityList?.autorace,
                    );
                const repo =
                    type === DataLocation.Storage
                        ? this.mechanicalRacingRaceRepositoryFromStorage
                        : this.autoraceRaceRepositoryFromHtml;
                const autoraceRaceEntityList = await this.fetchRaceEntities(
                    repo,
                    searchFilter,
                );
                result.autorace.push(...autoraceRaceEntityList);
            }
            // BOATRACE
            if (
                raceTypeList.includes(RaceType.BOATRACE) ||
                (placeEntityList?.boatrace !== undefined &&
                    placeEntityList.boatrace.length > 0)
            ) {
                const searchFilter =
                    new SearchRaceFilterEntity<MechanicalRacingPlaceEntity>(
                        startDate,
                        finishDate,
                        RaceType.BOATRACE,
                        placeEntityList?.boatrace,
                    );
                const repo =
                    type === DataLocation.Storage
                        ? this.mechanicalRacingRaceRepositoryFromStorage
                        : this.boatraceRaceRepositoryFromHtml;
                const boatraceRaceEntityList = await this.fetchRaceEntities(
                    repo,
                    searchFilter,
                );
                result.boatrace.push(...boatraceRaceEntityList);
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
     * @param raceEntityList.world
     * @param raceEntityList.keirin
     * @param raceEntityList.autorace
     * @param raceEntityList.boatrace
     * @throws Error データの保存/更新に失敗した場合
     */
    @Logger
    public async updateRaceEntityList(raceEntityList: {
        jra?: JraRaceEntity[];
        nar?: HorseRacingRaceEntity[];
        world?: HorseRacingRaceEntity[];
        keirin?: MechanicalRacingRaceEntity[];
        autorace?: MechanicalRacingRaceEntity[];
        boatrace?: MechanicalRacingRaceEntity[];
    }): Promise<void> {
        try {
            await Promise.all([
                this.saveRaceEntities(
                    this.jraRaceRepositoryFromStorage,
                    RaceType.JRA,
                    raceEntityList.jra,
                ),
                this.saveRaceEntities(
                    this.narRaceRepositoryFromStorage,
                    RaceType.NAR,
                    raceEntityList.nar,
                ),
                this.saveRaceEntities(
                    this.worldRaceRepositoryFromStorage,
                    RaceType.WORLD,
                    raceEntityList.world,
                ),
                this.saveRaceEntities(
                    this.mechanicalRacingRaceRepositoryFromStorage,
                    RaceType.KEIRIN,
                    raceEntityList.keirin,
                ),
                this.saveRaceEntities(
                    this.mechanicalRacingRaceRepositoryFromStorage,
                    RaceType.AUTORACE,
                    raceEntityList.autorace,
                ),
                this.saveRaceEntities(
                    this.mechanicalRacingRaceRepositoryFromStorage,
                    RaceType.BOATRACE,
                    raceEntityList.boatrace,
                ),
            ]);
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
    ): Promise<void> {
        if (entities !== undefined && entities.length > 0) {
            await repo.registerRaceEntityList(raceType, entities);
        }
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
