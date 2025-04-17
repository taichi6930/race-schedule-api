import { inject, injectable } from 'tsyringe';

import { KeirinRaceData } from '../../domain/keirinRaceData';
import { KeirinPlaceEntity } from '../../repository/entity/keirinPlaceEntity';
import { KeirinRaceEntity } from '../../repository/entity/keirinRaceEntity';
import { IPlaceDataService } from '../../service/interface/IPlaceDataService';
import { IRaceDataService } from '../../service/interface/IRaceDataService';
import { KeirinGradeType } from '../../utility/data/keirin/keirinGradeType';
import { KeirinRaceCourse } from '../../utility/data/keirin/keirinRaceCourse';
import { KeirinRaceStage } from '../../utility/data/keirin/keirinRaceStage';
import { DataLocation } from '../../utility/dataType';
import { getJSTDate } from '../../utility/date';
import { Logger } from '../../utility/logger';
import { IRaceDataUseCase } from '../interface/IRaceDataUseCase';

/**
 * 競輪のレース開催データを管理するユースケース
 *
 * このクラスは以下の機能を提供します：
 * - 指定された期間のレース開催データの取得と絞り込み
 * - レース開催データの更新（Webから最新データを取得）
 * - 既存レースデータの更新（手動更新用）
 *
 * データの取得元は2種類あります：
 * - Storage: 保存済みのデータから取得（高速）
 * - Web: KEIRIN公式サイトから直接取得（最新）
 *
 * フィルタリング機能：
 * - グレード（GⅠ、GⅡ、GⅢなど）による絞り込み
 * - 競輪場（松戸、京王閣、小倉など）による絞り込み
 * - レースステージ（予選、準決勝、決勝など）による絞り込み
 */
@injectable()
export class KeirinRaceDataUseCase
    implements
        IRaceDataUseCase<
            KeirinRaceData,
            KeirinGradeType,
            KeirinRaceCourse,
            KeirinRaceStage
        >
{
    public constructor(
        @inject('KeirinPlaceDataService')
        private readonly placeDataService: IPlaceDataService<KeirinPlaceEntity>,
        @inject('KeirinRaceDataService')
        private readonly raceDataService: IRaceDataService<
            KeirinRaceEntity,
            KeirinPlaceEntity
        >,
    ) {}

    /**
     * 指定された期間のレース開催データを取得し、条件に応じてフィルタリングします
     *
     * このメソッドは以下の処理を行います：
     * 1. 開催場所データの取得（Storage）
     * 2. レースデータの取得（Storage）
     * 3. 指定された条件でのフィルタリング
     *    - グレードによる絞り込み（GⅠ、GⅡ、GⅢなど）
     *    - 競輪場による絞り込み（松戸、京王閣、小倉など）
     *    - レースステージによる絞り込み（予選、準決勝、決勝など）
     *
     * @param startDate - 取得開始日
     * @param finishDate - 取得終了日（この日を含む）
     * @param searchList - フィルタリング条件
     * @param searchList.gradeList - 取得対象のグレードリスト
     * @param searchList.locationList - 取得対象の競輪場リスト
     * @param searchList.stageList - 取得対象のレースステージリスト
     * @returns フィルタリング済みの競輪開催データの配列
     */
    public async fetchRaceDataList(
        startDate: Date,
        finishDate: Date,
        searchList?: {
            gradeList?: KeirinGradeType[];
            locationList?: KeirinRaceCourse[];
            stageList?: KeirinRaceStage[];
        },
    ): Promise<KeirinRaceData[]> {
        const placeEntityList: KeirinPlaceEntity[] =
            await this.placeDataService.fetchPlaceEntityList(
                startDate,
                finishDate,
                DataLocation.Storage,
            );

        const raceEntityList: KeirinRaceEntity[] =
            await this.raceDataService.fetchRaceEntityList(
                startDate,
                finishDate,
                DataLocation.Storage,
                placeEntityList,
            );

        const raceDataList: KeirinRaceData[] = raceEntityList.map(
            ({ raceData }) => raceData,
        );

        // フィルタリング処理
        const filteredRaceDataList: KeirinRaceData[] = raceDataList
            // グレードリストが指定されている場合は、指定されたグレードのレースのみを取得する
            .filter((raceData) => {
                if (searchList?.gradeList) {
                    return searchList.gradeList.includes(raceData.grade);
                }
                return true;
            })
            // 開催場が指定されている場合は、指定された開催場のレースのみを取得する
            .filter((raceData) => {
                if (searchList?.locationList) {
                    return searchList.locationList.includes(raceData.location);
                }
                return true;
            })
            // レースステージが指定されている場合は、指定されたレースステージのレースのみを取得する
            .filter((raceData) => {
                if (searchList?.stageList) {
                    return searchList.stageList.includes(raceData.stage);
                }
                return true;
            });

        return filteredRaceDataList;
    }

    /**
     * レース開催データを最新の情報に更新します
     *
     * このメソッドは以下の処理を行います：
     * 1. 開催場所データの取得と絞り込み
     *    - グレードによる絞り込み
     *    - 競輪場による絞り込み
     * 2. KEIRIN公式サイトから最新のレースデータを取得
     * 3. 取得したデータでStorageを更新
     *
     * @param startDate - 更新対象期間の開始日
     * @param finishDate - 更新対象期間の終了日（この日を含む）
     * @param searchList - 更新対象の絞り込み条件
     * @param searchList.gradeList - 更新対象のグレードリスト
     * @param searchList.locationList - 更新対象の競輪場リスト
     * @remarks Loggerデコレータにより、処理の開始・終了・エラーが自動的にログに記録されます
     */
    @Logger
    public async updateRaceEntityList(
        startDate: Date,
        finishDate: Date,
        searchList?: {
            gradeList?: KeirinGradeType[];
            locationList?: KeirinRaceCourse[];
        },
    ): Promise<void> {
        // フィルタリング処理
        const fetchedPlaceEntityList =
            await this.placeDataService.fetchPlaceEntityList(
                startDate,
                finishDate,
                DataLocation.Storage,
            );
        const placeEntityList: KeirinPlaceEntity[] = fetchedPlaceEntityList
            .filter((placeEntity) => {
                if (searchList?.gradeList) {
                    return searchList.gradeList.includes(
                        placeEntity.placeData.grade,
                    );
                }
                return true;
            })
            .filter((placeEntity) => {
                if (searchList?.locationList) {
                    return searchList.locationList.includes(
                        placeEntity.placeData.location,
                    );
                }
                return true;
            });

        // placeEntityListが空の場合は処理を終了する
        if (placeEntityList.length === 0) {
            return;
        }

        const raceEntityList: KeirinRaceEntity[] =
            await this.raceDataService.fetchRaceEntityList(
                startDate,
                finishDate,
                DataLocation.Web,
                placeEntityList,
            );

        await this.raceDataService.updateRaceEntityList(raceEntityList);
    }

    /**
     * 指定されたレース開催データでStorageを更新します
     *
     * このメソッドは主に以下の用途で使用されます：
     * - 手動でのデータ修正
     * - テスト用データの登録
     * - 外部システムからのデータインポート
     *
     * @param raceDataList - 更新するレース開催データの配列
     * @remarks
     * - Loggerデコレータにより、処理の開始・終了・エラーが自動的にログに記録されます
     * - 選手データは空の配列として登録されます
     */
    @Logger
    public async upsertRaceDataList(
        raceDataList: KeirinRaceData[],
    ): Promise<void> {
        const raceEntityList: KeirinRaceEntity[] = raceDataList.map(
            (raceData) =>
                KeirinRaceEntity.createWithoutId(
                    raceData,
                    [],
                    getJSTDate(new Date()),
                ),
        );
        await this.raceDataService.updateRaceEntityList(raceEntityList);
    }
}
