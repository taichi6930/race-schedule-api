import 'reflect-metadata';

import { inject, injectable } from 'tsyringe';

import type { CalendarData } from '../../domain/calendarData';
import type { ICalendarGateway } from '../../gateway/interface/iCalendarGateway';
import {
    fromGoogleCalendarDataToCalendarData,
    toGoogleCalendarData,
} from '../../utility/googleCalendar';
import { Logger } from '../../utility/logger';
import { RaceType } from '../../utility/raceType';
import { HorseRacingRaceEntity } from '../entity/horseRacingRaceEntity';
import { JraRaceEntity } from '../entity/jraRaceEntity';
import { MechanicalRacingRaceEntity } from '../entity/mechanicalRacingRaceEntity';
import { SearchCalendarFilterEntity } from '../entity/searchCalendarFilterEntity';
import type { ICalendarRepository } from '../interface/ICalendarRepository';


@injectable()
export class GoogleCalendarRepository implements ICalendarRepository {
    public constructor(
        @inject('GoogleCalendarGateway')
        protected readonly googleCalendarGateway: ICalendarGateway,
    ) {}

    
    @Logger
    public async getEvents(
        raceTypeList: RaceType[],
        searchFilter: SearchCalendarFilterEntity,
    ): Promise<CalendarData[]> {
        const calendarDataList: CalendarData[] = [];
        for (const raceType of raceTypeList) {
            
            try {
                const _calendarDataList =
                    await this.googleCalendarGateway.fetchCalendarDataList(
                        raceType,
                        searchFilter.startDate,
                        searchFilter.finishDate,
                    );
                calendarDataList.push(
                    ..._calendarDataList.map((calendarData) =>
                        fromGoogleCalendarDataToCalendarData(
                            raceType,
                            calendarData,
                        ),
                    ),
                );
            } catch (error) {
                console.error(
                    'Google Calendar APIからのイベント取得に失敗しました',
                    error,
                );
            }
        }
        return calendarDataList;
    }

    
    @Logger
    public async upsertEvents(
        raceEntityList:
            | JraRaceEntity[]
            | HorseRacingRaceEntity[]
            | MechanicalRacingRaceEntity[],
    ): Promise<void> {
        
        await Promise.all(
            raceEntityList.map(async (raceEntity) => {
                try {
                    
                    let isExist = false;
                    try {
                        await this.googleCalendarGateway
                            .fetchCalendarData(
                                raceEntity.raceData.raceType,
                                raceEntity.id,
                            )
                            .then((calendarData) => {
                                console.debug('calendarData', calendarData);
                            });
                        isExist = true;
                    } catch (error) {
                        console.error(
                            'Google Calendar APIからのイベント取得に失敗しました',
                            error,
                        );
                    }
                    
                    await (isExist
                        ? this.googleCalendarGateway.updateCalendarData(
                              raceEntity.raceData.raceType,
                              toGoogleCalendarData(raceEntity),
                          )
                        : this.googleCalendarGateway.insertCalendarData(
                              raceEntity.raceData.raceType,
                              toGoogleCalendarData(raceEntity),
                          ));
                } catch (error) {
                    console.error(
                        'Google Calendar APIへのイベント登録に失敗しました',
                        error,
                    );
                }
            }),
        );
    }

    
    @Logger
    public async deleteEvents(calendarDataList: CalendarData[]): Promise<void> {
        await Promise.all(
            calendarDataList.map(async (calendarData) => {
                try {
                    await this.googleCalendarGateway.deleteCalendarData(
                        calendarData.raceType,
                        calendarData.id,
                    );
                } catch (error) {
                    console.error(
                        'Google Calendar APIからのイベント削除に失敗しました',
                        error,
                    );
                }
            }),
        );
    }
}
