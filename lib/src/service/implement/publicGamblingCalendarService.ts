import 'reflect-metadata';
import '../../utility/format';

import { inject, injectable } from 'tsyringe';

import { CalendarData } from '../../domain/calendarData';
import { RaceEntity } from '../../repository/entity/raceEntity';
import { SearchCalendarFilterEntity } from '../../repository/entity/searchCalendarFilterEntity';
import { ICalendarRepository } from '../../repository/interface/ICalendarRepository';
import { Logger } from '../../utility/logger';
import { ALL_RACE_TYPE_LIST, RaceType } from '../../utility/raceType';
import { ICalendarService } from '../interface/ICalendarService';

/**
 * Googleカレンダーとの連携機能を提供する基底サービスクラス
 *
 * このクラスは、各種競技のレース情報をGoogleカレンダーと
 * 同期するための共通機能を提供する抽象基底クラスです。主な責務：
 * - カレンダーイベントの取得
 * - イベントの作成・更新
 * - イベントの削除
 * - ロギングとエラーハンドリング
 *
 * 特徴：
 * - Google Calendar APIとの統合
 * - カレンダーイベントのライフサイクル管理
 * - バッチ処理による効率的な操作
 * - 詳細なロギング機能
 * @typeParam R - レースエンティティの型。IRaceEntityを実装している必要があります。
 *               このエンティティの情報がカレンダーイベントに変換されます。
 * @example
 * ```typescript
 * class MyCalendarService extends BaseCalendarService<MyRaceEntity> {
 *   protected calendarRepository = new MyCalendarRepository();
 * }
 * ```
 */
@injectable()
export class PublicGamblingCalendarService implements ICalendarService {
    public constructor(
        @inject('CalendarRepository')
        protected readonly calendarRepository: ICalendarRepository,
    ) {}
    /**
     * 指定された期間のカレンダーイベントを取得します
     *
     * このメソッドは、Googleカレンダーから指定された期間の
     * レース関連イベントを取得します。取得されたイベントは
     * アプリケーション固有のCalendarData形式に変換されます。
     * @param startDate - 取得開始日
     * @param finishDate - 取得終了日（この日を含む）
     * @param raceTypeList - レース種別のリスト
     * @returns カレンダーイベントの配列
     * @throws カレンダーAPIとの通信エラーなど
     * @remarks Loggerデコレータにより、処理の開始・終了・エラーが自動的にログに記録されます
     */
    @Logger
    public async fetchEvents(
        startDate: Date,
        finishDate: Date,
        raceTypeList: RaceType[],
    ): Promise<CalendarData[]> {
        const searchFilter = new SearchCalendarFilterEntity(
            startDate,
            finishDate,
        );

        return this.calendarRepository.getEvents(raceTypeList, searchFilter);
    }

    /**
     * レース情報をカレンダーイベントとして登録・更新します
     *
     * このメソッドは、レースエンティティの情報をGoogleカレンダーの
     * イベントとして同期します。既存のイベントは更新され、
     * 新しいレースは新規イベントとして作成されます。
     *
     * 空の配列が渡された場合は早期リターンし、不要な
     * API呼び出しを防止します。
     * @param raceEntityList - 登録・更新するレースエンティティの配列
     * @throws カレンダーAPIとの通信エラーなど
     * @remarks Loggerデコレータにより、処理の開始・終了・エラーが自動的にログに記録されます
     */
    @Logger
    public async upsertEvents(raceEntityList: {
        [RaceType.JRA]: RaceEntity[];
        [RaceType.NAR]: RaceEntity[];
        [RaceType.OVERSEAS]: RaceEntity[];
        [RaceType.KEIRIN]: RaceEntity[];
        [RaceType.AUTORACE]: RaceEntity[];
        [RaceType.BOATRACE]: RaceEntity[];
    }): Promise<void> {
        const raceTypeList = ALL_RACE_TYPE_LIST;
        for (const raceType of raceTypeList) {
            await this.calendarRepository.upsertEvents(
                raceEntityList[raceType],
            );
        }
    }

    /**
     * 指定されたカレンダーイベントを削除します
     *
     * このメソッドは、不要になったレースイベント（中止された
     * レースなど）をカレンダーから削除します。削除は完全な
     * 削除であり、元に戻すことはできません。
     *
     * 空の配列が渡された場合は早期リターンし、不要な
     * API呼び出しを防止します。
     * @param calendarDataList - 削除するカレンダーイベントの配列
     * @throws カレンダーAPIとの通信エラーなど
     * @remarks Loggerデコレータにより、処理の開始・終了・エラーが自動的にログに記録されます
     */
    @Logger
    public async deleteEvents(calendarDataList: CalendarData[]): Promise<void> {
        await this.calendarRepository.deleteEvents(calendarDataList);
    }
}
