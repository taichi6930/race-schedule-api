import { inject, injectable } from 'tsyringe';

import { AutoracePlaceEntity } from '../../repository/entity/autoracePlaceEntity';
import { BoatracePlaceEntity } from '../../repository/entity/boatracePlaceEntity';
import { JraPlaceEntity } from '../../repository/entity/jraPlaceEntity';
import { KeirinPlaceEntity } from '../../repository/entity/keirinPlaceEntity';
import { NarPlaceEntity } from '../../repository/entity/narPlaceEntity';
import { SearchPlaceFilterEntity } from '../../repository/entity/searchPlaceFilterEntity';
import { WorldPlaceEntity } from '../../repository/entity/worldPlaceEntity';
import { IPlaceRepository } from '../../repository/interface/IPlaceRepository';
import { DataLocation, DataLocationType } from '../../utility/dataType';
import { Logger } from '../../utility/logger';
import { IPlaceDataService } from '../interface/IPlaceDataService';

/**
 * 開催場所データの取得と更新を担当する基底サービスクラス
 */
@injectable()
export class PublicGamblingPlaceDataService implements IPlaceDataService {
    public constructor(
        @inject('JraPlaceRepositoryFromStorage')
        protected jraPlaceRepositoryFromStorage: IPlaceRepository<JraPlaceEntity>,
        @inject('JraPlaceRepositoryFromHtml')
        protected jraPlaceRepositoryFromHtml: IPlaceRepository<JraPlaceEntity>,
        @inject('NarPlaceRepositoryFromStorage')
        protected narPlaceRepositoryFromStorage: IPlaceRepository<NarPlaceEntity>,
        @inject('NarPlaceRepositoryFromHtml')
        protected narPlaceRepositoryFromHtml: IPlaceRepository<NarPlaceEntity>,
        @inject('WorldPlaceRepositoryFromStorage')
        protected worldPlaceRepositoryFromStorage: IPlaceRepository<WorldPlaceEntity>,
        @inject('WorldPlaceRepositoryFromHtml')
        protected worldPlaceRepositoryFromHtml: IPlaceRepository<WorldPlaceEntity>,
        @inject('KeirinPlaceRepositoryFromStorage')
        protected keirinPlaceRepositoryFromStorage: IPlaceRepository<KeirinPlaceEntity>,
        @inject('KeirinPlaceRepositoryFromHtml')
        protected keirinPlaceRepositoryFromHtml: IPlaceRepository<KeirinPlaceEntity>,
        @inject('AutoracePlaceRepositoryFromStorage')
        protected autoracePlaceRepositoryFromStorage: IPlaceRepository<AutoracePlaceEntity>,
        @inject('AutoracePlaceRepositoryFromHtml')
        protected autoracePlaceRepositoryFromHtml: IPlaceRepository<AutoracePlaceEntity>,
        @inject('BoatracePlaceRepositoryFromStorage')
        protected boatracePlaceRepositoryFromStorage: IPlaceRepository<BoatracePlaceEntity>,
        @inject('BoatracePlaceRepositoryFromHtml')
        protected boatracePlaceRepositoryFromHtml: IPlaceRepository<BoatracePlaceEntity>,
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
     * @returns 開催場所エンティティの配列。エラー時は空配列
     * @throws エラーはキャッチされログ出力されます
     * @remarks Loggerデコレータにより、処理の開始・終了・エラーが自動的にログに記録されます
     */
    @Logger
    public async fetchPlaceEntityList(
        startDate: Date,
        finishDate: Date,
        raceTypeList: string[],
        type: DataLocationType,
    ): Promise<{
        jra: JraPlaceEntity[];
        nar: NarPlaceEntity[];
        world: WorldPlaceEntity[];
        keirin: KeirinPlaceEntity[];
        autorace: AutoracePlaceEntity[];
        boatrace: BoatracePlaceEntity[];
    }> {
        const result: {
            jra: JraPlaceEntity[];
            nar: NarPlaceEntity[];
            world: WorldPlaceEntity[];
            keirin: KeirinPlaceEntity[];
            autorace: AutoracePlaceEntity[];
            boatrace: BoatracePlaceEntity[];
        } = {
            jra: [],
            nar: [],
            world: [],
            keirin: [],
            autorace: [],
            boatrace: [],
        };

        try {
            const searchFilter = new SearchPlaceFilterEntity(
                startDate,
                finishDate,
            );
            if (raceTypeList.length === 0 && type !== DataLocation.Storage) {
                return result;
            }
            if (raceTypeList.includes('jra')) {
                const jraPlaceEntityList: JraPlaceEntity[] =
                    type === DataLocation.Storage
                        ? await this.jraPlaceRepositoryFromStorage.fetchPlaceEntityList(
                              searchFilter,
                          )
                        : await this.jraPlaceRepositoryFromHtml.fetchPlaceEntityList(
                              searchFilter,
                          );
                result.jra.push(...jraPlaceEntityList);
            }
            if (raceTypeList.includes('nar')) {
                const narPlaceEntityList: NarPlaceEntity[] =
                    type === DataLocation.Storage
                        ? await this.narPlaceRepositoryFromStorage.fetchPlaceEntityList(
                              searchFilter,
                          )
                        : await this.narPlaceRepositoryFromHtml.fetchPlaceEntityList(
                              searchFilter,
                          );
                result.nar.push(...narPlaceEntityList);
            }
            if (raceTypeList.includes('world')) {
                const worldPlaceEntityList: WorldPlaceEntity[] =
                    type === DataLocation.Storage
                        ? await this.worldPlaceRepositoryFromStorage.fetchPlaceEntityList(
                              searchFilter,
                          )
                        : await this.worldPlaceRepositoryFromHtml.fetchPlaceEntityList(
                              searchFilter,
                          );
                result.world.push(...worldPlaceEntityList);
            }
            if (raceTypeList.includes('keirin')) {
                const keirinPlaceEntityList: KeirinPlaceEntity[] =
                    type === DataLocation.Storage
                        ? await this.keirinPlaceRepositoryFromStorage.fetchPlaceEntityList(
                              searchFilter,
                          )
                        : await this.keirinPlaceRepositoryFromHtml.fetchPlaceEntityList(
                              searchFilter,
                          );
                result.keirin.push(...keirinPlaceEntityList);
            }
            if (raceTypeList.includes('autorace')) {
                const autoracePlaceEntityList: AutoracePlaceEntity[] =
                    type === DataLocation.Storage
                        ? await this.autoracePlaceRepositoryFromStorage.fetchPlaceEntityList(
                              searchFilter,
                          )
                        : await this.autoracePlaceRepositoryFromHtml.fetchPlaceEntityList(
                              searchFilter,
                          );
                result.autorace.push(...autoracePlaceEntityList);
            }
            if (raceTypeList.includes('boatrace')) {
                const boatracePlaceEntityList: BoatracePlaceEntity[] =
                    type === DataLocation.Storage
                        ? await this.boatracePlaceRepositoryFromStorage.fetchPlaceEntityList(
                              searchFilter,
                          )
                        : await this.boatracePlaceRepositoryFromHtml.fetchPlaceEntityList(
                              searchFilter,
                          );
                result.boatrace.push(...boatracePlaceEntityList);
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
     * @param placeEntityList.jra
     * @param placeEntityList.nar
     * @param placeEntityList.keirin
     * @param placeEntityList.autorace
     * @param placeEntityList.boatrace
     * @param placeEntityList.world
     * @throws Error データの保存/更新に失敗した場合
     */
    @Logger
    public async updatePlaceEntityList(placeEntityList: {
        jra: JraPlaceEntity[];
        nar: NarPlaceEntity[];
        world: WorldPlaceEntity[];
        keirin: KeirinPlaceEntity[];
        autorace: AutoracePlaceEntity[];
        boatrace: BoatracePlaceEntity[];
    }): Promise<void> {
        if (
            placeEntityList.jra.length === 0 &&
            placeEntityList.nar.length === 0 &&
            placeEntityList.world.length === 0 &&
            placeEntityList.keirin.length === 0 &&
            placeEntityList.autorace.length === 0 &&
            placeEntityList.boatrace.length === 0
        )
            return;
        try {
            if (placeEntityList.jra.length > 0)
                await this.jraPlaceRepositoryFromStorage.registerPlaceEntityList(
                    placeEntityList.jra,
                );
            if (placeEntityList.nar.length > 0)
                await this.narPlaceRepositoryFromStorage.registerPlaceEntityList(
                    placeEntityList.nar,
                );
            if (placeEntityList.world.length > 0)
                await this.worldPlaceRepositoryFromStorage.registerPlaceEntityList(
                    placeEntityList.world,
                );
            if (placeEntityList.keirin.length > 0)
                await this.keirinPlaceRepositoryFromStorage.registerPlaceEntityList(
                    placeEntityList.keirin,
                );
            if (placeEntityList.autorace.length > 0)
                await this.autoracePlaceRepositoryFromStorage.registerPlaceEntityList(
                    placeEntityList.autorace,
                );
            if (placeEntityList.boatrace.length > 0)
                await this.boatracePlaceRepositoryFromStorage.registerPlaceEntityList(
                    placeEntityList.boatrace,
                );
        } catch (error) {
            console.error('開催場データの保存/更新に失敗しました', error);
            throw error;
        }
    }
}
