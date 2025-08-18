import type { CalendarData } from '../../domain/calendarData';
import type { HorseRacingRaceEntity } from '../../repository/entity/horseRacingRaceEntity';
import type { JraRaceEntity } from '../../repository/entity/jraRaceEntity';
import type { MechanicalRacingRaceEntity } from '../../repository/entity/mechanicalRacingRaceEntity';
import type { RaceType } from '../../utility/raceType';

export interface ICalendarService {
    
    fetchEvents: (
        startDate: Date,
        finishDate: Date,
        raceTypeList: RaceType[],
    ) => Promise<CalendarData[]>;

    
    upsertEvents: (raceEntityList: {
        [RaceType.JRA]: JraRaceEntity[];
        [RaceType.NAR]: HorseRacingRaceEntity[];
        [RaceType.OVERSEAS]: HorseRacingRaceEntity[];
        [RaceType.KEIRIN]: MechanicalRacingRaceEntity[];
        [RaceType.AUTORACE]: MechanicalRacingRaceEntity[];
        [RaceType.BOATRACE]: MechanicalRacingRaceEntity[];
    }) => Promise<void>;

    
    deleteEvents: (calendarDataList: CalendarData[]) => Promise<void>;
}
