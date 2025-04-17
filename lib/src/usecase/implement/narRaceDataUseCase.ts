import { inject, injectable } from 'tsyringe';

import { NarRaceData } from '../../domain/narRaceData';
import { NarPlaceEntity } from '../../repository/entity/narPlaceEntity';
import { NarRaceEntity } from '../../repository/entity/narRaceEntity';
import { IPlaceDataService } from '../../service/interface/IPlaceDataService';
import { IRaceDataService } from '../../service/interface/IRaceDataService';
import { NarGradeType } from '../../utility/data/nar/narGradeType';
import { NarRaceCourse } from '../../utility/data/nar/narRaceCourse';
import { DataLocation } from '../../utility/dataType';
import { getJSTDate } from '../../utility/date';
import { Logger } from '../../utility/logger';
import { IRaceDataUseCase } from '../interface/IRaceDataUseCase';

/**
 * 地方競馬（NAR）のレース開催データを管理するユースケース
 *
 * このクラスは以下の機能を提供します：
 * - 指定された期間のレース開催データの取得と絞り込み
 * - レース開催データの更新（Webから最新データを取得）
 * - 既存レースデータの更新（手動更新用）
 *
 * データの取得元は2種類あります：
 * - Storage: 保存済みのデータから取得（高速）
 * - Web: 地方競馬のWebサイトから直接取得（最新）
 *
 * フィルタリング機能：
 * - グレード（重賞、特別など）による絞り込み
 * - 競馬場（大井、門別、笠松など）による絞り込み
 */
@injectable()
export class NarRaceDataUseCase
    implements
        IRaceDataUseCase<NarRaceData, NarGradeType, NarRaceCourse, undefined>
{
    public constructor(
        @inject('NarPlaceDataService')
        private readonly placeDataService: IPlaceDataService<NarPlaceEntity>,
        @inject('NarRaceDataService')
        private readonly raceDataService: IRaceDataService<
            NarRaceEntity,
            NarPlaceEntity
        >,
    ) {}

    /**
     * 指定された期間のレース開催データを取得し、条件に応じてフィルタリングします
     *
     * このメソッドは以下の処理を行います：
     * 1. 開催場所データの取得（Storage）
     * 2. レースデータの取得（Storage）
     * 3. 指定された条件でのフィルタリング
     *    - グレードによる絞り込み（重賞、特別など）
     *    - 競馬場による絞り込み（大井、門別、笠松など）
     *
     * @param startDate - 取得開始日
     * @param finishDate - 取得終了日（この日を含む）
     * @param searchList - フィルタリング条件
     * @param searchList.gradeList - 取得対象のグレードリスト
     * @param searchList.locationList - 取得対象の競馬場リスト
     * @returns フィルタリング済みの地方競馬開催データの配列
     */
    public async fetchRaceDataList(
        startDate: Date,
        finishDate: Date,
        searchList?: {
            gradeList?: NarGradeType[];
            locationList?: NarRaceCourse[];
        },
    ): Promise<NarRaceData[]> {
        const placeEntityList: NarPlaceEntity[] =
            await this.placeDataService.fetchPlaceEntityList(
                startDate,
                finishDate,
                DataLocation.Storage,
            );

        const raceEntityList: NarRaceEntity[] =
            await this.raceDataService.fetchRaceEntityList(
                startDate,
                finishDate,
                DataLocation.Storage,
                placeEntityList,
            );

        const raceDataList: NarRaceData[] = raceEntityList.map(
            ({ raceData }) => raceData,
        );

        // フィルタリング処理
        const filteredRaceDataList: NarRaceData[] = raceDataList
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
     * 2. 地方競馬のWebサイトから最新のレースデータを取得
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
        const placeEntityList: NarPlaceEntity[] =
            await this.placeDataService.fetchPlaceEntityList(
                startDate,
                finishDate,
                DataLocation.Storage,
            );

        const raceEntityList: NarRaceEntity[] =
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
        raceDataList: NarRaceData[],
    ): Promise<void> {
        const raceEntityList: NarRaceEntity[] = raceDataList.map((raceData) =>
            NarRaceEntity.createWithoutId(raceData, getJSTDate(new Date())),
        );
        await this.raceDataService.updateRaceEntityList(raceEntityList);
    }
}
