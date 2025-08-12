import { inject, injectable } from 'tsyringe';

import { HorseRacingPlaceEntity } from '../../repository/entity/horseRacingPlaceEntity';
import { JraPlaceEntity } from '../../repository/entity/jraPlaceEntity';
import { MechanicalRacingPlaceEntity } from '../../repository/entity/mechanicalRacingPlaceEntity';
import { SearchPlaceFilterEntity } from '../../repository/entity/searchPlaceFilterEntity';
import { IPlaceRepository } from '../../repository/interface/IPlaceRepository';
import { DataLocation, DataLocationType } from '../../utility/dataType';
import { Logger } from '../../utility/logger';
import { RaceType } from '../../utility/raceType';
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
        protected narPlaceRepositoryFromStorage: IPlaceRepository<HorseRacingPlaceEntity>,
        @inject('NarPlaceRepositoryFromHtml')
        protected narPlaceRepositoryFromHtml: IPlaceRepository<HorseRacingPlaceEntity>,
        @inject('MechanicalRacingPlaceRepositoryFromStorage')
        protected mechanicalRacingPlaceRepositoryFromStorage: IPlaceRepository<MechanicalRacingPlaceEntity>,
        @inject('KeirinPlaceRepositoryFromHtml')
        protected keirinPlaceRepositoryFromHtml: IPlaceRepository<MechanicalRacingPlaceEntity>,
        @inject('AutoracePlaceRepositoryFromHtml')
        protected autoracePlaceRepositoryFromHtml: IPlaceRepository<MechanicalRacingPlaceEntity>,
        @inject('BoatracePlaceRepositoryFromHtml')
        protected boatracePlaceRepositoryFromHtml: IPlaceRepository<MechanicalRacingPlaceEntity>,
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
        raceTypeList: RaceType[],
        type: DataLocationType,
    ): Promise<{
        jra: JraPlaceEntity[];
        nar: HorseRacingPlaceEntity[];
        keirin: MechanicalRacingPlaceEntity[];
        autorace: MechanicalRacingPlaceEntity[];
        boatrace: MechanicalRacingPlaceEntity[];
    }> {
        const result: {
            jra: JraPlaceEntity[];
            nar: HorseRacingPlaceEntity[];
            keirin: MechanicalRacingPlaceEntity[];
            autorace: MechanicalRacingPlaceEntity[];
            boatrace: MechanicalRacingPlaceEntity[];
        } = {
            jra: [],
            nar: [],
            keirin: [],
            autorace: [],
            boatrace: [],
        };

        try {
            if (raceTypeList.length === 0 && type !== DataLocation.Storage) {
                console.warn('raceTypeListが空の場合、空を返します');
                return result;
            }
            if (raceTypeList.includes(RaceType.JRA)) {
                const searchFilter = new SearchPlaceFilterEntity(
                    startDate,
                    finishDate,
                    RaceType.JRA,
                );
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
            if (raceTypeList.includes(RaceType.NAR)) {
                const searchFilter = new SearchPlaceFilterEntity(
                    startDate,
                    finishDate,
                    RaceType.NAR,
                );
                const narPlaceEntityList: HorseRacingPlaceEntity[] =
                    type === DataLocation.Storage
                        ? await this.narPlaceRepositoryFromStorage.fetchPlaceEntityList(
                              searchFilter,
                          )
                        : await this.narPlaceRepositoryFromHtml.fetchPlaceEntityList(
                              searchFilter,
                          );
                result.nar.push(...narPlaceEntityList);
            }
            if (raceTypeList.includes(RaceType.KEIRIN)) {
                const searchFilter = new SearchPlaceFilterEntity(
                    startDate,
                    finishDate,
                    RaceType.KEIRIN,
                );
                const keirinPlaceEntityList: MechanicalRacingPlaceEntity[] =
                    type === DataLocation.Storage
                        ? await this.mechanicalRacingPlaceRepositoryFromStorage.fetchPlaceEntityList(
                              searchFilter,
                          )
                        : await this.keirinPlaceRepositoryFromHtml.fetchPlaceEntityList(
                              searchFilter,
                          );
                result.keirin.push(...keirinPlaceEntityList);
            }
            if (raceTypeList.includes(RaceType.AUTORACE)) {
                const searchFilter = new SearchPlaceFilterEntity(
                    startDate,
                    finishDate,
                    RaceType.AUTORACE,
                );
                const autoracePlaceEntityList: MechanicalRacingPlaceEntity[] =
                    type === DataLocation.Storage
                        ? await this.mechanicalRacingPlaceRepositoryFromStorage.fetchPlaceEntityList(
                              searchFilter,
                          )
                        : await this.autoracePlaceRepositoryFromHtml.fetchPlaceEntityList(
                              searchFilter,
                          );
                result.autorace.push(...autoracePlaceEntityList);
            }
            if (raceTypeList.includes(RaceType.BOATRACE)) {
                const searchFilter = new SearchPlaceFilterEntity(
                    startDate,
                    finishDate,
                    RaceType.BOATRACE,
                );
                const boatracePlaceEntityList: MechanicalRacingPlaceEntity[] =
                    type === DataLocation.Storage
                        ? await this.mechanicalRacingPlaceRepositoryFromStorage.fetchPlaceEntityList(
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
     * @throws Error データの保存/更新に失敗した場合
     */
    @Logger
    public async updatePlaceEntityList(placeEntityList: {
        jra: JraPlaceEntity[];
        nar: HorseRacingPlaceEntity[];
        keirin: MechanicalRacingPlaceEntity[];
        autorace: MechanicalRacingPlaceEntity[];
        boatrace: MechanicalRacingPlaceEntity[];
    }): Promise<void> {
        if (
            placeEntityList.jra.length === 0 &&
            placeEntityList.nar.length === 0 &&
            placeEntityList.keirin.length === 0 &&
            placeEntityList.autorace.length === 0 &&
            placeEntityList.boatrace.length === 0
        )
            return;
        try {
            if (placeEntityList.jra.length > 0)
                await this.jraPlaceRepositoryFromStorage.registerPlaceEntityList(
                    RaceType.JRA,
                    placeEntityList.jra,
                );
            if (placeEntityList.nar.length > 0)
                await this.narPlaceRepositoryFromStorage.registerPlaceEntityList(
                    RaceType.NAR,
                    placeEntityList.nar,
                );

            if (placeEntityList.keirin.length > 0)
                await this.mechanicalRacingPlaceRepositoryFromStorage.registerPlaceEntityList(
                    RaceType.KEIRIN,
                    placeEntityList.keirin,
                );
            if (placeEntityList.autorace.length > 0)
                await this.mechanicalRacingPlaceRepositoryFromStorage.registerPlaceEntityList(
                    RaceType.AUTORACE,
                    placeEntityList.autorace,
                );
            if (placeEntityList.boatrace.length > 0)
                await this.mechanicalRacingPlaceRepositoryFromStorage.registerPlaceEntityList(
                    RaceType.BOATRACE,
                    placeEntityList.boatrace,
                );
        } catch (error) {
            console.error('開催場データの保存/更新に失敗しました', error);
            throw error;
        }
    }
}
