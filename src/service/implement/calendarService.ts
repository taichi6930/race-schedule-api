import 'reflect-metadata';

import { inject, injectable } from 'tsyringe';

import { CalendarData } from '../../domain/calendarData';
import { SearchCalendarFilterEntity } from '../../repository/entity/filter/searchCalendarFilterEntity';
import { RaceEntity } from '../../repository/entity/raceEntity';
import { ICalendarRepository } from '../../repository/interface/ICalendarRepository';
import { CommonParameter } from '../../utility/cloudFlareEnv';
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
     * @param commonParameter
     * @param searchCalendarFilter
     * @returns カレンダーイベント配列
     */
    @Logger
    public async fetchEvents(
        commonParameter: CommonParameter,
        searchCalendarFilter: SearchCalendarFilterEntity,
    ): Promise<CalendarData[]> {
        return this.calendarRepository.getEvents(
            commonParameter,
            searchCalendarFilter,
        );
    }

    /**
     * レース情報をカレンダーイベントとして登録・更新
     * @param commonParameter
     * @param raceEntityList - 登録・更新するレースエンティティ配列
     */
    @Logger
    public async upsertEvents(
        commonParameter: CommonParameter,
        raceEntityList: RaceEntity[],
    ): Promise<void> {
        await this.calendarRepository.upsertEvents(
            commonParameter,
            raceEntityList,
        );
    }

    /**
     * 指定したカレンダーイベントを削除
     * @param commonParameter
     * @param calendarDataList - 削除するカレンダーイベント配列
     */
    @Logger
    public async deleteEvents(
        commonParameter: CommonParameter,
        calendarDataList: CalendarData[],
    ): Promise<void> {
        await this.calendarRepository.deleteEvents(
            commonParameter,
            calendarDataList,
        );
    }
}
