import { inject, injectable } from 'tsyringe';

import { HorseRacingPlaceEntity } from '../../repository/entity/horseRacingPlaceEntity';
import { HorseRacingRaceEntity } from '../../repository/entity/horseRacingRaceEntity';
import { JraPlaceEntity } from '../../repository/entity/jraPlaceEntity';
import { JraRaceEntity } from '../../repository/entity/jraRaceEntity';
import { MechanicalRacingPlaceEntity } from '../../repository/entity/mechanicalRacingPlaceEntity';
import { MechanicalRacingRaceEntity } from '../../repository/entity/mechanicalRacingRaceEntity';
import { SearchRaceFilterEntity } from '../../repository/entity/searchRaceFilterEntity';
import { WorldPlaceEntity } from '../../repository/entity/worldPlaceEntity';
import { WorldRaceEntity } from '../../repository/entity/worldRaceEntity';
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
            WorldRaceEntity,
            WorldPlaceEntity
        >,
        @inject('WorldRaceRepositoryFromHtml')
        protected readonly worldRaceRepositoryFromHtml: IRaceRepository<
            WorldRaceEntity,
            WorldPlaceEntity
        >,
        @inject('KeirinRaceRepositoryFromStorage')
        protected keirinRaceRepositoryFromStorage: IRaceRepository<
            MechanicalRacingRaceEntity,
            MechanicalRacingPlaceEntity
        >,
        @inject('KeirinRaceRepositoryFromHtml')
        protected keirinRaceRepositoryFromHtml: IRaceRepository<
            MechanicalRacingRaceEntity,
            MechanicalRacingPlaceEntity
        >,
        @inject('AutoraceRaceRepositoryFromStorage')
        protected autoraceRaceRepositoryFromStorage: IRaceRepository<
            MechanicalRacingRaceEntity,
            MechanicalRacingPlaceEntity
        >,
        @inject('AutoraceRaceRepositoryFromHtml')
        protected autoraceRaceRepositoryFromHtml: IRaceRepository<
            MechanicalRacingRaceEntity,
            MechanicalRacingPlaceEntity
        >,
        @inject('BoatraceRaceRepositoryFromStorage')
        protected boatraceRaceRepositoryFromStorage: IRaceRepository<
            MechanicalRacingRaceEntity,
            MechanicalRacingPlaceEntity
        >,
        @inject('BoatraceRaceRepositoryFromHtml')
        protected boatraceRaceRepositoryFromHtml: IRaceRepository<
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
     * @param raceTypeList
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
            world?: WorldPlaceEntity[];
            keirin?: MechanicalRacingPlaceEntity[];
            autorace?: MechanicalRacingPlaceEntity[];
            boatrace?: MechanicalRacingPlaceEntity[];
        },
    ): Promise<{
        jra: JraRaceEntity[];
        nar: HorseRacingRaceEntity[];
        world: WorldRaceEntity[];
        keirin: MechanicalRacingRaceEntity[];
        autorace: MechanicalRacingRaceEntity[];
        boatrace: MechanicalRacingRaceEntity[];
    }> {
        const result: {
            jra: JraRaceEntity[];
            nar: HorseRacingRaceEntity[];
            world: WorldRaceEntity[];
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
                const jraRaceEntityList: JraRaceEntity[] =
                    type === DataLocation.Storage
                        ? await this.jraRaceRepositoryFromStorage.fetchRaceEntityList(
                              searchFilter,
                          )
                        : await this.jraRaceRepositoryFromHtml.fetchRaceEntityList(
                              searchFilter,
                          );
                result.jra.push(...jraRaceEntityList);
            }
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
                const narRaceEntityList: HorseRacingRaceEntity[] =
                    type === DataLocation.Storage
                        ? await this.narRaceRepositoryFromStorage.fetchRaceEntityList(
                              searchFilter,
                          )
                        : await this.narRaceRepositoryFromHtml.fetchRaceEntityList(
                              searchFilter,
                          );
                result.nar.push(...narRaceEntityList);
            }
            if (raceTypeList.includes(RaceType.WORLD)) {
                const searchFilter =
                    new SearchRaceFilterEntity<WorldPlaceEntity>(
                        startDate,
                        finishDate,
                        RaceType.WORLD,
                    );
                const worldRaceEntityList: WorldRaceEntity[] =
                    type === DataLocation.Storage
                        ? await this.worldRaceRepositoryFromStorage.fetchRaceEntityList(
                              searchFilter,
                          )
                        : await this.worldRaceRepositoryFromHtml.fetchRaceEntityList(
                              searchFilter,
                          );
                result.world.push(...worldRaceEntityList);
            }
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
                const keirinRaceEntityList: MechanicalRacingRaceEntity[] =
                    type === DataLocation.Storage
                        ? await this.keirinRaceRepositoryFromStorage.fetchRaceEntityList(
                              searchFilter,
                          )
                        : await this.keirinRaceRepositoryFromHtml.fetchRaceEntityList(
                              searchFilter,
                          );
                result.keirin.push(...keirinRaceEntityList);
            }
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
                const autoraceRaceEntityList: MechanicalRacingRaceEntity[] =
                    type === DataLocation.Storage
                        ? await this.autoraceRaceRepositoryFromStorage.fetchRaceEntityList(
                              searchFilter,
                          )
                        : await this.autoraceRaceRepositoryFromHtml.fetchRaceEntityList(
                              searchFilter,
                          );
                result.autorace.push(...autoraceRaceEntityList);
            }
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
                const boatraceRaceEntityList: MechanicalRacingRaceEntity[] =
                    type === DataLocation.Storage
                        ? await this.boatraceRaceRepositoryFromStorage.fetchRaceEntityList(
                              searchFilter,
                          )
                        : await this.boatraceRaceRepositoryFromHtml.fetchRaceEntityList(
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
        world?: WorldRaceEntity[];
        keirin?: MechanicalRacingRaceEntity[];
        autorace?: MechanicalRacingRaceEntity[];
        boatrace?: MechanicalRacingRaceEntity[];
    }): Promise<void> {
        try {
            if (
                raceEntityList.jra !== undefined &&
                raceEntityList.jra.length > 0
            ) {
                await this.jraRaceRepositoryFromStorage.registerRaceEntityList(
                    RaceType.JRA,
                    raceEntityList.jra,
                );
            }
            if (
                raceEntityList.nar !== undefined &&
                raceEntityList.nar.length > 0
            ) {
                await this.narRaceRepositoryFromStorage.registerRaceEntityList(
                    RaceType.NAR,
                    raceEntityList.nar,
                );
            }
            if (
                raceEntityList.world !== undefined &&
                raceEntityList.world.length > 0
            ) {
                await this.worldRaceRepositoryFromStorage.registerRaceEntityList(
                    RaceType.WORLD,
                    raceEntityList.world,
                );
            }
            if (
                raceEntityList.keirin !== undefined &&
                raceEntityList.keirin.length > 0
            ) {
                await this.keirinRaceRepositoryFromStorage.registerRaceEntityList(
                    RaceType.KEIRIN,
                    raceEntityList.keirin,
                );
            }
            if (
                raceEntityList.autorace !== undefined &&
                raceEntityList.autorace.length > 0
            ) {
                await this.autoraceRaceRepositoryFromStorage.registerRaceEntityList(
                    RaceType.AUTORACE,
                    raceEntityList.autorace,
                );
            }
            if (
                raceEntityList.boatrace !== undefined &&
                raceEntityList.boatrace.length > 0
            ) {
                await this.boatraceRaceRepositoryFromStorage.registerRaceEntityList(
                    RaceType.BOATRACE,
                    raceEntityList.boatrace,
                );
            }
        } catch (error) {
            console.error('開催場データの保存/更新に失敗しました', error);
            throw error;
        }
    }
}
