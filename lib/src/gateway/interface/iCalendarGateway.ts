import type { calendar_v3 } from 'googleapis';

import type { RaceType } from '../../utility/raceType';


export interface ICalendarGateway {
    
    fetchCalendarDataList: (
        raceType: RaceType,
        startDate: Date,
        finishDate: Date,
    ) => Promise<calendar_v3.Schema$Event[]>;

    
    fetchCalendarData: (
        raceType: RaceType,
        eventId: string,
    ) => Promise<calendar_v3.Schema$Event>;

    
    updateCalendarData: (
        raceType: RaceType,
        calendarData: calendar_v3.Schema$Event,
    ) => Promise<void>;

    
    insertCalendarData: (
        raceType: RaceType,
        calendarData: calendar_v3.Schema$Event,
    ) => Promise<void>;

    
    deleteCalendarData: (raceType: RaceType, eventId: string) => Promise<void>;
}
