import 'reflect-metadata'; // reflect-metadataをインポート

import { inject, injectable } from 'tsyringe';

import { CalendarData } from '../../domain/calendarData';
import { NarPlaceEntity } from '../../repository/entity/narPlaceEntity';
import { NarRaceEntity } from '../../repository/entity/narRaceEntity';
import { IRaceRepository } from '../../repository/interface/IRaceRepository';
import { FetchRaceListRequest } from '../../repository/request/fetchRaceListRequest';
import { ICalendarService } from '../../service/interface/ICalendarService';
import { Logger } from '../../utility/logger';
import { IRaceCalendarUseCase } from '../interface/IRaceCalendarUseCase';

@injectable()
export class NarRaceCalendarUseCase implements IRaceCalendarUseCase {
    constructor(
        @inject('NarCalendarService')
        private readonly calendarService: ICalendarService<NarRaceEntity>,
        @inject('NarRaceRepositoryFromStorage')
        private readonly narRaceRepositoryFromStorage: IRaceRepository<
            NarRaceEntity,
            NarPlaceEntity
        >,
    ) {}

    /**
     * カレンダーからレース情報の取得を行う
     * @param startDate
     * @param finishDate
     * @returns CalendarData[]
     */
    @Logger
    async getRacesFromCalendar(
        startDate: Date,
        finishDate: Date,
    ): Promise<CalendarData[]> {
        try {
            return await this.calendarService.getEvents(startDate, finishDate);
        } catch (error) {
            console.error(
                'Google Calendar APIからのイベント取得に失敗しました',
                error,
            );
            return [];
        }
    }
    /**
     * カレンダーの更新を行う
     * @param startDate
     * @param finishDate
     * @param displayGradeList
     */
    @Logger
    async updateRacesToCalendar(
        startDate: Date,
        finishDate: Date,
        displayGradeList: string[],
    ): Promise<void> {
        try {
            // startDateからfinishDateまでレース情報を取得
            const fetchRaceDataListRequest =
                new FetchRaceListRequest<NarPlaceEntity>(startDate, finishDate);
            const fetchRaceDataListResponse =
                await this.narRaceRepositoryFromStorage.fetchRaceEntityList(
                    fetchRaceDataListRequest,
                );
            // レース情報を取得
            const raceEntityList: NarRaceEntity[] =
                fetchRaceDataListResponse.raceEntityList;

            // displayGradeListに含まれるレース情報のみを抽出
            const filteredRaceEntityList: NarRaceEntity[] =
                raceEntityList.filter((raceEntity) =>
                    displayGradeList.includes(raceEntity.raceData.grade),
                );

            // レース情報をカレンダーに登録
            await this.calendarService.upsertEvents(filteredRaceEntityList);
        } catch (error) {
            console.error(
                'Google Calendar APIへのイベント登録に失敗しました',
                error,
            );
        }
    }

    /**
     * カレンダーのクレンジングを行う
     * 既に旧システムのレース情報が登録されている場合、削除する
     * @param startDate
     * @param finishDate
     */
    @Logger
    async cleansingRacesFromCalendar(
        startDate: Date,
        finishDate: Date,
        displayGradeList: string[],
    ): Promise<void> {
        try {
            // startDateからfinishDateまでレース情報を取得
            const fetchRaceDataListRequest =
                new FetchRaceListRequest<NarPlaceEntity>(startDate, finishDate);
            const fetchRaceDataListResponse =
                await this.narRaceRepositoryFromStorage.fetchRaceEntityList(
                    fetchRaceDataListRequest,
                );
            // レース情報を取得
            const raceEntityList: NarRaceEntity[] =
                fetchRaceDataListResponse.raceEntityList;

            // displayGradeListに含まれるレース情報のみを抽出
            const filteredRaceEntityList: NarRaceEntity[] =
                raceEntityList.filter((raceEntity) =>
                    displayGradeList.includes(raceEntity.raceData.grade),
                );

            await this.calendarService.cleansingEvents(
                startDate,
                finishDate,
                filteredRaceEntityList,
            );
        } catch (error) {
            console.error(
                'Google Calendar APIからのイベントクレンジングに失敗しました',
                error,
            );
        }
    }
}
