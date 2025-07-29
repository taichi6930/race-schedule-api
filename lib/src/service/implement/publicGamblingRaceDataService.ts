import { inject, injectable } from 'tsyringe';

import { AutoracePlaceEntity } from '../../repository/entity/autoracePlaceEntity';
import { AutoraceRaceEntity } from '../../repository/entity/autoraceRaceEntity';
import { BoatracePlaceEntity } from '../../repository/entity/boatracePlaceEntity';
import { BoatraceRaceEntity } from '../../repository/entity/boatraceRaceEntity';
import { JraPlaceEntity } from '../../repository/entity/jraPlaceEntity';
import { JraRaceEntity } from '../../repository/entity/jraRaceEntity';
import { KeirinPlaceEntity } from '../../repository/entity/keirinPlaceEntity';
import { KeirinRaceEntity } from '../../repository/entity/keirinRaceEntity';
import { NarPlaceEntity } from '../../repository/entity/narPlaceEntity';
import { NarRaceEntity } from '../../repository/entity/narRaceEntity';
import { SearchRaceFilterEntity } from '../../repository/entity/searchRaceFilterEntity';
import { WorldPlaceEntity } from '../../repository/entity/worldPlaceEntity';
import { WorldRaceEntity } from '../../repository/entity/worldRaceEntity';
import { IRaceRepository } from '../../repository/interface/IRaceRepository';
import { DataLocation, DataLocationType } from '../../utility/dataType';
import { Logger } from '../../utility/logger';
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
            NarRaceEntity,
            NarPlaceEntity
        >,
        @inject('NarRaceRepositoryFromHtml')
        protected narRaceRepositoryFromHtml: IRaceRepository<
            NarRaceEntity,
            NarPlaceEntity
        >,
        @inject('WorldRaceRepositoryFromStorage')
        protected readonly raceRepositoryFromStorage: IRaceRepository<
            WorldRaceEntity,
            WorldPlaceEntity
        >,
        @inject('WorldRaceRepositoryFromHtml')
        protected readonly raceRepositoryFromHtml: IRaceRepository<
            WorldRaceEntity,
            WorldPlaceEntity
        >,
        @inject('KeirinRaceRepositoryFromStorage')
        protected keirinRaceRepositoryFromStorage: IRaceRepository<
            KeirinRaceEntity,
            KeirinPlaceEntity
        >,
        @inject('KeirinRaceRepositoryFromHtml')
        protected keirinRaceRepositoryFromHtml: IRaceRepository<
            KeirinRaceEntity,
            KeirinPlaceEntity
        >,
        @inject('AutoraceRaceRepositoryFromStorage')
        protected autoraceRaceRepositoryFromStorage: IRaceRepository<
            AutoraceRaceEntity,
            AutoracePlaceEntity
        >,
        @inject('AutoraceRaceRepositoryFromHtml')
        protected autoraceRaceRepositoryFromHtml: IRaceRepository<
            AutoraceRaceEntity,
            AutoracePlaceEntity
        >,
        @inject('BoatraceRaceRepositoryFromStorage')
        protected boatraceRaceRepositoryFromStorage: IRaceRepository<
            BoatraceRaceEntity,
            BoatracePlaceEntity
        >,
        @inject('BoatraceRaceRepositoryFromHtml')
        protected boatraceRaceRepositoryFromHtml: IRaceRepository<
            BoatraceRaceEntity,
            BoatracePlaceEntity
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
     * @param raceType
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
        raceType: string[],
        type: DataLocationType,
        placeEntityList?: {
            jra?: JraPlaceEntity[];
            nar?: NarPlaceEntity[];
            world?: WorldPlaceEntity[];
            keirin?: KeirinPlaceEntity[];
            autorace?: AutoracePlaceEntity[];
            boatrace?: BoatracePlaceEntity[];
        },
    ): Promise<{
        jra: JraRaceEntity[];
        nar: NarRaceEntity[];
        world: WorldRaceEntity[];
        keirin: KeirinRaceEntity[];
        autorace: AutoraceRaceEntity[];
        boatrace: BoatraceRaceEntity[];
    }> {
        const result: {
            jra: JraRaceEntity[];
            nar: NarRaceEntity[];
            world: WorldRaceEntity[];
            keirin: KeirinRaceEntity[];
            autorace: AutoraceRaceEntity[];
            boatrace: BoatraceRaceEntity[];
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
                raceType.includes('jra') ||
                (placeEntityList?.jra !== undefined &&
                    placeEntityList.jra.length > 0)
            ) {
                const searchFilter = new SearchRaceFilterEntity<JraPlaceEntity>(
                    startDate,
                    finishDate,
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
                raceType.includes('nar') ||
                (placeEntityList?.nar !== undefined &&
                    placeEntityList.nar.length > 0)
            ) {
                const searchFilter = new SearchRaceFilterEntity<NarPlaceEntity>(
                    startDate,
                    finishDate,
                    placeEntityList?.nar,
                );
                const narRaceEntityList: NarRaceEntity[] =
                    type === DataLocation.Storage
                        ? await this.narRaceRepositoryFromStorage.fetchRaceEntityList(
                              searchFilter,
                          )
                        : await this.narRaceRepositoryFromHtml.fetchRaceEntityList(
                              searchFilter,
                          );
                result.nar.push(...narRaceEntityList);
            }
            if (
                raceType.includes('world') ||
                (placeEntityList?.world !== undefined &&
                    placeEntityList.world.length > 0)
            ) {
                const searchFilter =
                    new SearchRaceFilterEntity<WorldPlaceEntity>(
                        startDate,
                        finishDate,
                        placeEntityList?.world,
                    );
                const worldRaceEntityList: WorldRaceEntity[] =
                    type === DataLocation.Storage
                        ? await this.raceRepositoryFromStorage.fetchRaceEntityList(
                              searchFilter,
                          )
                        : await this.raceRepositoryFromHtml.fetchRaceEntityList(
                              searchFilter,
                          );
                result.world.push(...worldRaceEntityList);
            }
            if (
                raceType.includes('keirin') ||
                (placeEntityList?.keirin !== undefined &&
                    placeEntityList.keirin.length > 0)
            ) {
                const searchFilter =
                    new SearchRaceFilterEntity<KeirinPlaceEntity>(
                        startDate,
                        finishDate,
                        placeEntityList?.keirin,
                    );
                const keirinRaceEntityList: KeirinRaceEntity[] =
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
                raceType.includes('autorace') ||
                (placeEntityList?.autorace !== undefined &&
                    placeEntityList.autorace.length > 0)
            ) {
                const searchFilter =
                    new SearchRaceFilterEntity<AutoracePlaceEntity>(
                        startDate,
                        finishDate,
                        placeEntityList?.autorace,
                    );
                const autoraceRaceEntityList: AutoraceRaceEntity[] =
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
                raceType.includes('boatrace') ||
                (placeEntityList?.boatrace !== undefined &&
                    placeEntityList.boatrace.length > 0)
            ) {
                const searchFilter =
                    new SearchRaceFilterEntity<BoatracePlaceEntity>(
                        startDate,
                        finishDate,
                        placeEntityList?.boatrace,
                    );
                const boatraceRaceEntityList: BoatraceRaceEntity[] =
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
     * @throws Error データの保存/更新に失敗した場合
     */
    public updateRaceEntityList: (raceEntityList: {
        jra?: JraRaceEntity[];
        nar?: NarRaceEntity[];
        world?: WorldRaceEntity[];
        keirin?: KeirinRaceEntity[];
        autorace?: AutoraceRaceEntity[];
        boatrace?: BoatraceRaceEntity[];
    }) => Promise<void> = async (raceEntityList) => {
        try {
            if (
                raceEntityList.jra !== undefined &&
                raceEntityList.jra.length > 0
            ) {
                await this.jraRaceRepositoryFromStorage.registerRaceEntityList(
                    raceEntityList.jra,
                );
            }
            if (
                raceEntityList.nar !== undefined &&
                raceEntityList.nar.length > 0
            ) {
                await this.narRaceRepositoryFromStorage.registerRaceEntityList(
                    raceEntityList.nar,
                );
            }
            if (
                raceEntityList.world !== undefined &&
                raceEntityList.world.length > 0
            ) {
                await this.raceRepositoryFromStorage.registerRaceEntityList(
                    raceEntityList.world,
                );
            }
            if (
                raceEntityList.keirin !== undefined &&
                raceEntityList.keirin.length > 0
            ) {
                await this.keirinRaceRepositoryFromStorage.registerRaceEntityList(
                    raceEntityList.keirin,
                );
            }
            if (
                raceEntityList.autorace !== undefined &&
                raceEntityList.autorace.length > 0
            ) {
                await this.autoraceRaceRepositoryFromStorage.registerRaceEntityList(
                    raceEntityList.autorace,
                );
            }
            if (
                raceEntityList.boatrace !== undefined &&
                raceEntityList.boatrace.length > 0
            ) {
                await this.boatraceRaceRepositoryFromStorage.registerRaceEntityList(
                    raceEntityList.boatrace,
                );
            }
        } catch (error) {
            console.error('開催場データの保存/更新に失敗しました', error);
            throw error;
        }
    };
}
