import type { CalendarData } from '../../domain/calendarData';
import type { RaceType } from '../../utility/raceType';
import type { HorseRacingRaceEntity } from '../entity/horseRacingRaceEntity';
import type { JraRaceEntity } from '../entity/jraRaceEntity';
import type { MechanicalRacingRaceEntity } from '../entity/mechanicalRacingRaceEntity';
import type { SearchCalendarFilterEntity } from '../entity/searchCalendarFilterEntity';


export interface ICalendarRepository {
    
    getEvents: (
        raceTypeList: RaceType[],
        searchFilter: SearchCalendarFilterEntity,
    ) => Promise<CalendarData[]>;

    
    upsertEvents: (
        raceEntityList:
            | JraRaceEntity[]
            | HorseRacingRaceEntity[]
            | MechanicalRacingRaceEntity[],
    ) => Promise<void>;

    
    deleteEvents: (calendarDataList: CalendarData[]) => Promise<void>;
}
