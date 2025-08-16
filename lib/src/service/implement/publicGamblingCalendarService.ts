import 'reflect-metadata';
import '../../utility/format';

import { inject, injectable } from 'tsyringe';

import { CalendarData } from '../../domain/calendarData';
import { HorseRacingRaceEntity } from '../../repository/entity/horseRacingRaceEntity';
import { JraRaceEntity } from '../../repository/entity/jraRaceEntity';
import { MechanicalRacingRaceEntity } from '../../repository/entity/mechanicalRacingRaceEntity';
import { SearchCalendarFilterEntity } from '../../repository/entity/searchCalendarFilterEntity';
import { ICalendarRepository } from '../../repository/interface/ICalendarRepository';
import { Logger } from '../../utility/logger';
import { RaceType } from '../../utility/raceType';
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
     * @param raceEntityList.jra
     * @param raceEntityList.nar
     * @param raceEntityList.overseas
     * @param raceEntityList.mechanicalRacing
     * @throws カレンダーAPIとの通信エラーなど
     * @remarks Loggerデコレータにより、処理の開始・終了・エラーが自動的にログに記録されます
     */
    @Logger
    public async upsertEvents(raceEntityList: {
        jra: JraRaceEntity[];
        nar: HorseRacingRaceEntity[];
        overseas: HorseRacingRaceEntity[];
        mechanicalRacing: MechanicalRacingRaceEntity[];
    }): Promise<void> {
        await this.calendarRepository.upsertEvents(raceEntityList.jra);
        await this.calendarRepository.upsertEvents(raceEntityList.nar);
        await this.calendarRepository.upsertEvents(raceEntityList.overseas);
        await this.calendarRepository.upsertEvents(
            raceEntityList.mechanicalRacing,
        );
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
     * @param calendarDataList.jra
     * @param calendarDataList.nar
     * @param calendarDataList.keirin
     * @param calendarDataList.overseas
     * @param calendarDataList.boatrace
     * @param calendarDataList.autorace
     * @throws カレンダーAPIとの通信エラーなど
     * @remarks Loggerデコレータにより、処理の開始・終了・エラーが自動的にログに記録されます
     */
    @Logger
    public async deleteEvents(calendarDataList: {
        jra?: CalendarData[];
        nar?: CalendarData[];
        keirin?: CalendarData[];
        overseas?: CalendarData[];
        boatrace?: CalendarData[];
        autorace?: CalendarData[];
    }): Promise<void> {
        if (
            calendarDataList.jra?.length === 0 &&
            calendarDataList.nar?.length === 0 &&
            calendarDataList.keirin?.length === 0 &&
            calendarDataList.overseas?.length === 0 &&
            calendarDataList.boatrace?.length === 0 &&
            calendarDataList.autorace?.length === 0
        ) {
            console.debug('削除対象のイベントが見つかりませんでした。');
            return;
        }
        if (calendarDataList.jra && calendarDataList.jra.length > 0) {
            await this.calendarRepository.deleteEvents(calendarDataList.jra);
        }
        if (calendarDataList.nar && calendarDataList.nar.length > 0) {
            await this.calendarRepository.deleteEvents(calendarDataList.nar);
        }

        if (calendarDataList.overseas && calendarDataList.overseas.length > 0) {
            await this.calendarRepository.deleteEvents(
                calendarDataList.overseas,
            );
        }
        if (calendarDataList.keirin && calendarDataList.keirin.length > 0) {
            await this.calendarRepository.deleteEvents(calendarDataList.keirin);
        }
        if (calendarDataList.boatrace && calendarDataList.boatrace.length > 0) {
            await this.calendarRepository.deleteEvents(
                calendarDataList.boatrace,
            );
        }
        if (calendarDataList.autorace && calendarDataList.autorace.length > 0) {
            await this.calendarRepository.deleteEvents(
                calendarDataList.autorace,
            );
        }
    }
}
