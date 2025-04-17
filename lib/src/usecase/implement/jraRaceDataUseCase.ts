import { inject, injectable } from 'tsyringe';

import { JraRaceData } from '../../domain/jraRaceData';
import { JraPlaceEntity } from '../../repository/entity/jraPlaceEntity';
import { JraRaceEntity } from '../../repository/entity/jraRaceEntity';
import { IPlaceDataService } from '../../service/interface/IPlaceDataService';
import { IRaceDataService } from '../../service/interface/IRaceDataService';
import { JraGradeType } from '../../utility/data/jra/jraGradeType';
import { JraRaceCourse } from '../../utility/data/jra/jraRaceCourse';
import { DataLocation } from '../../utility/dataType';
import { getJSTDate } from '../../utility/date';
import { Logger } from '../../utility/logger';
import { IRaceDataUseCase } from '../interface/IRaceDataUseCase';

/**
 * JRA（中央競馬）のレース開催データを管理するユースケース
 *
 * このクラスは以下の機能を提供します：
 * - 指定された期間のレース開催データの取得と絞り込み
 * - レース開催データの更新（Webから最新データを取得）
 * - 既存レースデータの更新（手動更新用）
 *
 * データの取得元は2種類あります：
 * - Storage: 保存済みのデータから取得（高速）
 * - Web: JRA公式サイトから直接取得（最新）
 *
 * フィルタリング機能：
 * - グレード（GⅠ、GⅡ、GⅢなど）による絞り込み
 * - 競馬場（東京、中山、阪神など）による絞り込み
 */
@injectable()
export class JraRaceDataUseCase
    implements
        IRaceDataUseCase<JraRaceData, JraGradeType, JraRaceCourse, undefined>
{
    public constructor(
        @inject('JraPlaceDataService')
        private readonly placeDataService: IPlaceDataService<JraPlaceEntity>,
        @inject('JraRaceDataService')
        private readonly raceDataService: IRaceDataService<
            JraRaceEntity,
            JraPlaceEntity
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
     *    - 競馬場による絞り込み（東京、中山、阪神など）
     *
     * @param startDate - 取得開始日
     * @param finishDate - 取得終了日（この日を含む）
     * @param searchList - フィルタリング条件
     * @param searchList.gradeList - 取得対象のグレードリスト
     * @param searchList.locationList - 取得対象の競馬場リスト
     * @returns フィルタリング済みのJRAレース開催データの配列
     */
    public async fetchRaceDataList(
        startDate: Date,
        finishDate: Date,
        searchList?: {
            gradeList?: JraGradeType[];
            locationList?: JraRaceCourse[];
        },
    ): Promise<JraRaceData[]> {
        const placeEntityList: JraPlaceEntity[] =
            await this.placeDataService.fetchPlaceEntityList(
                startDate,
                finishDate,
                DataLocation.Storage,
            );

        const raceEntityList: JraRaceEntity[] =
            await this.raceDataService.fetchRaceEntityList(
                startDate,
                finishDate,
                DataLocation.Storage,
                placeEntityList,
            );

        const raceDataList: JraRaceData[] = raceEntityList.map(
            ({ raceData }) => raceData,
        );

        // フィルタリング処理
        const filteredRaceDataList: JraRaceData[] = raceDataList
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
            });

        return filteredRaceDataList;
    }

    /**
     * レース開催データを最新の情報に更新します
     *
     * このメソッドは以下の処理を行います：
     * 1. 開催場所データの取得（Storage）
     * 2. JRA公式サイトから最新のレースデータを取得
     * 3. 取得したデータでStorageを更新
     *
     * @param startDate - 更新対象期間の開始日
     * @param finishDate - 更新対象期間の終了日（この日を含む）
     * @remarks Loggerデコレータにより、処理の開始・終了・エラーが自動的にログに記録されます
     */
    @Logger
    public async updateRaceEntityList(
        startDate: Date,
        finishDate: Date,
    ): Promise<void> {
        const placeEntityList: JraPlaceEntity[] =
            await this.placeDataService.fetchPlaceEntityList(
                startDate,
                finishDate,
                DataLocation.Storage,
            );

        const raceEntityList: JraRaceEntity[] =
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
     * - 更新時刻は現在のJST時刻が使用されます
     */
    @Logger
    public async upsertRaceDataList(
        raceDataList: JraRaceData[],
    ): Promise<void> {
        const raceEntityList: JraRaceEntity[] = raceDataList.map((raceData) =>
            JraRaceEntity.createWithoutId(raceData, getJSTDate(new Date())),
        );
        await this.raceDataService.updateRaceEntityList(raceEntityList);
    }
}
