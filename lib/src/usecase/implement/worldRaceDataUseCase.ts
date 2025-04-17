import { inject, injectable } from 'tsyringe';

import { WorldRaceData } from '../../domain/worldRaceData';
import { WorldPlaceEntity } from '../../repository/entity/worldPlaceEntity';
import { WorldRaceEntity } from '../../repository/entity/worldRaceEntity';
import { IRaceDataService } from '../../service/interface/IRaceDataService';
import { WorldGradeType } from '../../utility/data/world/worldGradeType';
import { WorldRaceCourse } from '../../utility/data/world/worldRaceCourse';
import { DataLocation } from '../../utility/dataType';
import { getJSTDate } from '../../utility/date';
import { Logger } from '../../utility/logger';
import { IRaceDataUseCase } from '../interface/IRaceDataUseCase';

/**
 * 世界の主要競馬レースの開催データを管理するユースケース
 *
 * このクラスは以下の機能を提供します：
 * - 指定された期間のレース開催データの取得と絞り込み
 * - レース開催データの更新（Webから最新データを取得）
 * - 既存レースデータの更新（手動更新用）
 *
 * データの取得元は2種類あります：
 * - Storage: 保存済みのデータから取得（高速）
 * - Web: 世界の競馬情報サイトから直接取得（最新）
 *
 * フィルタリング機能：
 * - グレード（G1、G2、G3など）による絞り込み
 * - 開催国・競馬場（ドバイ、香港、フランスなど）による絞り込み
 *
 * 注：他のレースユースケースと異なり、開催場所データ（PlaceData）は使用せず、
 * 直接レースデータを取得・管理します。これは世界の主要レースが限定的で、
 * 開催場所データを別途管理する必要性が低いためです。
 */
@injectable()
export class WorldRaceDataUseCase
    implements
        IRaceDataUseCase<
            WorldRaceData,
            WorldGradeType,
            WorldRaceCourse,
            undefined
        >
{
    public constructor(
        @inject('WorldRaceDataService')
        private readonly raceDataService: IRaceDataService<
            WorldRaceEntity,
            WorldPlaceEntity
        >,
    ) {}

    /**
     * 指定された期間のレース開催データを取得し、条件に応じてフィルタリングします
     *
     * このメソッドは以下の処理を行います：
     * 1. レースデータの取得（Storage）
     * 2. 指定された条件でのフィルタリング
     *    - グレードによる絞り込み（国際G1など）
     *    - 開催地による絞り込み（ドバイ、香港など）
     *
     * @param startDate - 取得開始日
     * @param finishDate - 取得終了日（この日を含む）
     * @param searchList - フィルタリング条件
     * @param searchList.gradeList - 取得対象のグレードリスト
     * @param searchList.locationList - 取得対象の開催地リスト
     * @returns フィルタリング済みの世界の主要レース開催データの配列
     */
    public async fetchRaceDataList(
        startDate: Date,
        finishDate: Date,
        searchList?: {
            gradeList?: WorldGradeType[];
            locationList?: WorldRaceCourse[];
        },
    ): Promise<WorldRaceData[]> {
        const raceEntityList: WorldRaceEntity[] =
            await this.raceDataService.fetchRaceEntityList(
                startDate,
                finishDate,
                DataLocation.Storage,
            );

        const raceDataList: WorldRaceData[] = raceEntityList.map(
            ({ raceData }) => raceData,
        );

        // フィルタリング処理
        const filteredRaceDataList: WorldRaceData[] = raceDataList
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
     * 1. 世界の競馬情報サイトから最新のレースデータを取得
     * 2. 取得したデータでStorageを更新
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
        const raceEntityList: WorldRaceEntity[] =
            await this.raceDataService.fetchRaceEntityList(
                startDate,
                finishDate,
                DataLocation.Web,
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
     * @param raceDataList - 更新する世界の主要レース開催データの配列
     * @remarks
     * - Loggerデコレータにより、処理の開始・終了・エラーが自動的にログに記録されます
     * - 更新時刻は現在のJST時刻が使用されます
     */
    @Logger
    public async upsertRaceDataList(
        raceDataList: WorldRaceData[],
    ): Promise<void> {
        const raceEntityList: WorldRaceEntity[] = raceDataList.map((raceData) =>
            WorldRaceEntity.createWithoutId(raceData, getJSTDate(new Date())),
        );
        await this.raceDataService.updateRaceEntityList(raceEntityList);
    }
}
