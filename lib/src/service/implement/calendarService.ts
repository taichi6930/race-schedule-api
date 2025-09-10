import 'reflect-metadata';
import '../../utility/format';

import { inject, injectable } from 'tsyringe';

import { RaceEntity } from '../../../../src/repository/entity/raceEntity';
import { RaceType } from '../../../../src/utility/raceType';
import { CalendarData } from '../../domain/calendarData';
import { SearchCalendarFilterEntityForAWS } from '../../repository/entity/searchCalendarFilterEntity';
import { ICalendarRepositoryForAWS } from '../../repository/interface/ICalendarRepository';
import { Logger } from '../../utility/logger';
import { ICalendarServiceForAWS } from '../interface/ICalendarService';

/**
 * 公営競技レース情報をGoogleカレンダーと同期するサービス
 *
 * カレンダーイベントの取得・登録・削除などの共通機能を提供します。
 */
@injectable()
export class CalendarServiceForAWS implements ICalendarServiceForAWS {
    public constructor(
        @inject('CalendarRepository')
        protected readonly calendarRepository: ICalendarRepositoryForAWS,
    ) {}

    /**
     * 指定期間・種別のカレンダーイベントを取得
     * @param startDate - 取得開始日
     * @param finishDate - 取得終了日（含む）
     * @param raceTypeList - レース種別リスト
     * @returns カレンダーイベント配列
     */
    @Logger
    public async fetchEvents(
        startDate: Date,
        finishDate: Date,
        raceTypeList: RaceType[],
    ): Promise<CalendarData[]> {
        const searchFilter = new SearchCalendarFilterEntityForAWS(
            startDate,
            finishDate,
            raceTypeList,
        );
        return this.calendarRepository.getEvents(searchFilter);
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
