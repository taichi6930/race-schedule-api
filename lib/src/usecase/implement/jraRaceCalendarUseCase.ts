import 'reflect-metadata'; // reflect-metadataをインポート

import { inject, injectable } from 'tsyringe';

import { CalendarData } from '../../domain/calendarData';
import { JraPlaceEntity } from '../../repository/entity/jraPlaceEntity';
import { JraRaceEntity } from '../../repository/entity/jraRaceEntity';
import { ICalendarService } from '../../service/interface/ICalendarService';
import { IRaceDataService } from '../../service/interface/IRaceDataService';
import { JraGradeType } from '../../utility/data/jra/jraGradeType';
import { DataLocation } from '../../utility/dataType';
import { Logger } from '../../utility/logger';
import { IRaceCalendarUseCase } from '../interface/IRaceCalendarUseCase';

/**
 * JRA（中央競馬）のレース開催情報をGoogleカレンダーで管理するユースケース
 *
 * このクラスは以下の機能を提供します：
 * - カレンダーからレース開催情報の取得
 * - カレンダー情報の更新（重要なレースのみを表示）
 *
 * カレンダー管理の特徴：
 * - 保存済みのレースデータからカレンダーイベントを生成
 * - 既存のカレンダーイベントと同期（不要なイベントの削除）
 *
 * フィルタリング条件：
 * - 指定されたグレード（GⅠ、GⅡ、GⅢなど）に該当するレース
 * - 競馬場（東京、中山、阪神など）は自動的に情報に含まれる
 */
@injectable()
export class JraRaceCalendarUseCase implements IRaceCalendarUseCase {
    public constructor(
        @inject('JraCalendarService')
        private readonly calendarService: ICalendarService<JraRaceEntity>,
        @inject('JraRaceDataService')
        private readonly raceDataService: IRaceDataService<
            JraRaceEntity,
            JraPlaceEntity
        >,
    ) {}

    /**
     * 指定された期間のレース情報をカレンダーから取得します
     *
     * このメソッドは、GoogleカレンダーAPIを使用して
     * 登録済みのJRA開催情報を取得します。
     *
     * @param startDate - 取得開始日
     * @param finishDate - 取得終了日（この日を含む）
     * @returns カレンダーに登録されているレース開催情報の配列
     * @remarks Loggerデコレータにより、処理の開始・終了・エラーが自動的にログに記録されます
     */
    @Logger
    public async getRacesFromCalendar(
        startDate: Date,
        finishDate: Date,
    ): Promise<CalendarData[]> {
        return this.calendarService.getEvents(startDate, finishDate);
    }

    /**
     * カレンダーのレース情報を最新の状態に更新します
     *
     * このメソッドは以下の処理を行います：
     * 1. 指定された期間のレースデータを取得
     * 2. 表示条件（グレード）に基づくフィルタリング
     * 3. 既存のカレンダーイベントと比較
     * 4. 不要なイベントの削除と新規/更新イベントの登録
     *
     * @param startDate - 更新対象期間の開始日
     * @param finishDate - 更新対象期間の終了日（この日を含む）
     * @param displayGradeList - 表示対象のグレードリスト（GⅠ、GⅡ、GⅢなど）
     * @remarks Loggerデコレータにより、処理の開始・終了・エラーが自動的にログに記録されます
     */
    @Logger
    public async updateRacesToCalendar(
        startDate: Date,
        finishDate: Date,
        displayGradeList: JraGradeType[],
    ): Promise<void> {
        // レース情報を取得する
        const raceEntityList: JraRaceEntity[] =
            await this.raceDataService.fetchRaceEntityList(
                startDate,
                finishDate,
                DataLocation.Storage,
            );

        // displayGradeListに含まれるレース情報のみを抽出
        const filteredRaceEntityList: JraRaceEntity[] = raceEntityList.filter(
            (raceEntity) =>
                displayGradeList.includes(raceEntity.raceData.grade),
        );
        // カレンダーの取得を行う
        const calendarDataList: CalendarData[] =
            await this.calendarService.getEvents(startDate, finishDate);

        // 1. raceEntityListのIDに存在しないcalendarDataListを取得
        const deleteCalendarDataList: CalendarData[] = calendarDataList.filter(
            (calendarData) =>
                !filteredRaceEntityList.some(
                    (raceEntity) => raceEntity.id === calendarData.id,
                ),
        );
        await this.calendarService.deleteEvents(deleteCalendarDataList);
        // 2. deleteCalendarDataListのIDに該当しないraceEntityListを取得し、upsertする
        const upsertRaceEntityList: JraRaceEntity[] =
            filteredRaceEntityList.filter(
                (raceEntity) =>
                    !deleteCalendarDataList.some(
                        (deleteCalendarData) =>
                            deleteCalendarData.id === raceEntity.id,
                    ),
            );
        await this.calendarService.upsertEvents(upsertRaceEntityList);
    }
}
