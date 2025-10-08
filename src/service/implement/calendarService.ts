import 'reflect-metadata';

import { inject, injectable } from 'tsyringe';

import { CalendarData } from '../../domain/calendarData';
import { SearchCalendarFilterEntity } from '../../repository/entity/filter/searchCalendarFilterEntity';
import { RaceEntity } from '../../repository/entity/raceEntity';
import { ICalendarRepository } from '../../repository/interface/ICalendarRepository';
import { Logger } from '../../utility/logger';
import { ICalendarService } from '../interface/ICalendarService';

/**
 * 公営競技レース情報をGoogleカレンダーと同期するサービス
 *
 * カレンダーイベントの取得・登録・削除などの共通機能を提供します。
 */
@injectable()
export class CalendarService implements ICalendarService {
    public constructor(
        @inject('CalendarRepository')
        protected readonly calendarRepository: ICalendarRepository,
    ) {}

    /**
     * 指定期間・種別のカレンダーイベントを取得
     * @param startDate - 取得開始日
     * @param finishDate - 取得終了日（含む）
     * @param raceTypeList - レース種別リスト
     * @param searchCalendarFilter
     * @returns カレンダーイベント配列
     */
    @Logger
    public async fetchEvents(
        searchCalendarFilter: SearchCalendarFilterEntity,
    ): Promise<CalendarData[]> {
        return this.calendarRepository.getEvents(searchCalendarFilter);
    }

    /**
     * レース情報をカレンダーイベントとして登録・更新
     * @param raceEntityList - 登録・更新するレースエンティティ配列
     */
    @Logger
    public async upsertEvents(raceEntityList: RaceEntity[]): Promise<void> {
        await this.calendarRepository.upsertEvents(raceEntityList);
    }

    /**
     * 指定したカレンダーイベントを削除
     * @param calendarDataList - 削除するカレンダーイベント配列
     */
    @Logger
    public async deleteEvents(calendarDataList: CalendarData[]): Promise<void> {
        await this.calendarRepository.deleteEvents(calendarDataList);
    }
}
