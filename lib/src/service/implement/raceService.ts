import { inject, injectable } from 'tsyringe';

import { PlaceEntityForAWS } from '../../repository/entity/placeEntity';
import { RaceEntityForAWS } from '../../repository/entity/raceEntity';
import { SearchRaceFilterEntityForAWS } from '../../repository/entity/searchRaceFilterEntity';
import { IRaceRepositoryForAWS } from '../../repository/interface/IRaceRepositoryForAWS';
import { DataLocation, DataLocationType } from '../../utility/dataType';
import { Logger } from '../../utility/logger';
import { RACE_TYPE_LIST_ALL, RaceType } from '../../utility/raceType';
import { IRaceService } from '../interface/IRaceService';

/**
 * 開催場所データの取得と更新を担当する基底サービスクラス
 */
@injectable()
export class RaceService implements IRaceService {
    private readonly raceRepositoryFromStorage: Record<
        RaceType,
        IRaceRepositoryForAWS
    >;
    private readonly raceRepositoryFromHtml: Record<
        RaceType,
        IRaceRepositoryForAWS
    >;

    public constructor(
        @inject('HorseRacingRaceRepositoryFromStorage')
        protected horseRacingRaceRepositoryFromStorage: IRaceRepositoryForAWS,
        @inject('JraRaceRepositoryFromHtml')
        protected jraRaceRepositoryFromHtml: IRaceRepositoryForAWS,
        @inject('NarRaceRepositoryFromHtml')
        protected narRaceRepositoryFromHtml: IRaceRepositoryForAWS,
        @inject('OverseasRaceRepositoryFromHtml')
        protected overseasRaceRepositoryFromHtml: IRaceRepositoryForAWS,
        @inject('KeirinRaceRepositoryFromHtml')
        protected keirinRaceRepositoryFromHtml: IRaceRepositoryForAWS,
        @inject('AutoraceRaceRepositoryFromHtml')
        protected autoraceRaceRepositoryFromHtml: IRaceRepositoryForAWS,
        @inject('BoatraceRaceRepositoryFromHtml')
        protected boatraceRaceRepositoryFromHtml: IRaceRepositoryForAWS,
        @inject('MechanicalRacingRaceRepositoryFromStorage')
        protected mechanicalRacingRaceRepositoryFromStorage: IRaceRepositoryForAWS,
    ) {
        this.raceRepositoryFromStorage = {
            [RaceType.JRA]: this.horseRacingRaceRepositoryFromStorage,
            [RaceType.NAR]: this.horseRacingRaceRepositoryFromStorage,
            [RaceType.OVERSEAS]: this.horseRacingRaceRepositoryFromStorage,
            [RaceType.KEIRIN]: this.mechanicalRacingRaceRepositoryFromStorage,
            [RaceType.AUTORACE]: this.mechanicalRacingRaceRepositoryFromStorage,
            [RaceType.BOATRACE]: this.mechanicalRacingRaceRepositoryFromStorage,
        };

        this.raceRepositoryFromHtml = {
            [RaceType.JRA]: this.jraRaceRepositoryFromHtml,
            [RaceType.NAR]: this.narRaceRepositoryFromHtml,
            [RaceType.OVERSEAS]: this.overseasRaceRepositoryFromHtml,
            [RaceType.KEIRIN]: this.keirinRaceRepositoryFromHtml,
            [RaceType.AUTORACE]: this.autoraceRaceRepositoryFromHtml,
            [RaceType.BOATRACE]: this.boatraceRaceRepositoryFromHtml,
        };
    }

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
        placeEntityList?: PlaceEntityForAWS[],
    ): Promise<RaceEntityForAWS[]> {
        const result: RaceEntityForAWS[] = [];
        try {
            for (const raceType of RACE_TYPE_LIST_ALL) {
                if (raceTypeList.includes(raceType)) {
                    const searchFilter = new SearchRaceFilterEntityForAWS(
                        startDate,
                        finishDate,
                        raceType,
                        placeEntityList?.filter(
                            (placeEntity) =>
                                placeEntity.placeData.raceType === raceType,
                        ) ?? [],
                    );
                    const raceEntityList = await (
                        type === DataLocation.Storage
                            ? this.raceRepositoryFromStorage[raceType]
                            : this.raceRepositoryFromHtml[raceType]
                    ).fetchRaceEntityList(searchFilter);
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
     * @throws Error データの保存/更新に失敗した場合
     */
    @Logger
    public async updateRaceEntityList(
        raceEntityList: RaceEntityForAWS[],
    ): Promise<{
        code: number;
        message: string;
        successDataCount: number;
        failureDataCount: number;
    }> {
        try {
            const response = await Promise.all(
                RACE_TYPE_LIST_ALL.map(async (raceType) =>
                    this.saveRaceEntityList(
                        this.raceRepositoryFromStorage[raceType],
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
    private async saveRaceEntityList(
        repository: IRaceRepositoryForAWS,
        raceType: RaceType,
        entityList?: RaceEntityForAWS[],
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
}
