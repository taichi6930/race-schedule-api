import 'reflect-metadata'; // reflect-metadataをインポート

import { inject, injectable } from 'tsyringe';

import { CalendarData } from '../../domain/calendarData';
import { KeirinPlaceEntity } from '../../repository/entity/keirinPlaceEntity';
import { KeirinRaceEntity } from '../../repository/entity/keirinRaceEntity';
import { ICalendarService } from '../../service/interface/ICalendarService';
import { IRaceDataService } from '../../service/interface/IRaceDataService';
import { KeirinGradeType } from '../../utility/data/keirin/keirinGradeType';
import { KeirinPlayerList } from '../../utility/data/keirin/keirinPlayerNumber';
import { KeirinSpecifiedGradeAndStageList } from '../../utility/data/keirin/keirinRaceStage';
import { DataLocation } from '../../utility/dataType';
import { Logger } from '../../utility/logger';
import { IRaceCalendarUseCase } from '../interface/IRaceCalendarUseCase';

/**
 * 競輪のレース開催情報をGoogleカレンダーで管理するユースケース
 *
 * このクラスは以下の機能を提供します：
 * - カレンダーからレース開催情報の取得
 * - カレンダー情報の更新（重要なレースのみを表示）
 * - 優先度に基づくレース情報のフィルタリング
 *
 * カレンダー管理の特徴：
 * - 保存済みのレースデータからカレンダーイベントを生成
 * - 重要度の低いレースは表示対象から除外
 * - 既存のカレンダーイベントと同期（不要なイベントの削除）
 *
 * フィルタリング条件：
 * - レースの優先度とレース出場選手の優先度の合計が6以上
 * - 指定されたグレード（GI、GII、GIIIなど）に該当するレース
 * - レースステージ（予選、準決勝、決勝など）の重要度を考慮
 */
@injectable()
export class KeirinRaceCalendarUseCase implements IRaceCalendarUseCase {
    public constructor(
        @inject('KeirinCalendarService')
        private readonly calendarService: ICalendarService<KeirinRaceEntity>,
        @inject('KeirinRaceDataService')
        private readonly raceDataService: IRaceDataService<
            KeirinRaceEntity,
            KeirinPlaceEntity
        >,
    ) {}

    /**
     * 指定された期間のレース情報をカレンダーから取得します
     *
     * このメソッドは、GoogleカレンダーAPIを使用して
     * 登録済みの競輪開催情報を取得します。
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
     * 2. 表示条件に基づくフィルタリング
     * 3. 既存のカレンダーイベントと比較
     * 4. 不要なイベントの削除と新規/更新イベントの登録
     *
     * @param startDate - 更新対象期間の開始日
     * @param finishDate - 更新対象期間の終了日（この日を含む）
     * @param displayGradeList - 表示対象のグレードリスト（GI、GII、GIIIなど）
     * @remarks Loggerデコレータにより、処理の開始・終了・エラーが自動的にログに記録されます
     */
    @Logger
    public async updateRacesToCalendar(
        startDate: Date,
        finishDate: Date,
        displayGradeList: KeirinGradeType[],
    ): Promise<void> {
        const raceEntityList: KeirinRaceEntity[] =
            await this.raceDataService.fetchRaceEntityList(
                startDate,
                finishDate,
                DataLocation.Storage,
            );

        const filteredRaceEntityList: KeirinRaceEntity[] =
            this.filterRaceEntity(raceEntityList, displayGradeList);

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
        const upsertRaceEntityList: KeirinRaceEntity[] =
            filteredRaceEntityList.filter(
                (raceEntity) =>
                    !deleteCalendarDataList.some(
                        (deleteCalendarData) =>
                            deleteCalendarData.id === raceEntity.id,
                    ),
            );
        await this.calendarService.upsertEvents(upsertRaceEntityList);
    }

    /**
     * レース情報を表示条件に基づいてフィルタリングします
     *
     * このメソッドは以下の条件でフィルタリングを行います：
     * 1. レースの優先度判定
     *    - 指定されたグレードに該当するか（GI、GII、GIIIなど）
     *    - レースステージ（予選、準決勝、決勝など）の重要度
     * 2. 選手の優先度判定
     *    - 出場選手の中で最も高い優先度を使用
     *    - SS級、S級などの選手ランクに基づく
     * 3. 総合優先度の計算
     *    - レース優先度と選手優先度の合計が6以上のレースを表示
     *
     * @param raceEntityList - フィルタリング対象のレースエンティティリスト
     * @param displayGradeList - 表示対象のグレードリスト
     * @returns フィルタリング条件を満たすレースエンティティの配列
     * @remarks 優先度の計算にはKeirinPlayerListとKeirinSpecifiedGradeAndStageListを使用
     */
    private filterRaceEntity(
        raceEntityList: KeirinRaceEntity[],
        displayGradeList: KeirinGradeType[],
    ): KeirinRaceEntity[] {
        const filteredRaceEntityList: KeirinRaceEntity[] =
            raceEntityList.filter((raceEntity) => {
                const maxPlayerPriority = raceEntity.racePlayerDataList.reduce(
                    (maxPriority, playerData) => {
                        const playerPriority =
                            KeirinPlayerList.find(
                                (keirinPlayer) =>
                                    playerData.playerNumber ===
                                    Number(keirinPlayer.playerNumber),
                            )?.priority ?? 0;
                        return Math.max(maxPriority, playerPriority);
                    },
                    0,
                );

                const racePriority: number =
                    KeirinSpecifiedGradeAndStageList.find((raceGradeList) => {
                        return (
                            displayGradeList.includes(
                                raceEntity.raceData.grade,
                            ) &&
                            raceGradeList.grade === raceEntity.raceData.grade &&
                            raceGradeList.stage === raceEntity.raceData.stage
                        );
                    })?.priority ?? 0;

                return racePriority + maxPlayerPriority >= 6;
            });
        return filteredRaceEntityList;
    }
}
