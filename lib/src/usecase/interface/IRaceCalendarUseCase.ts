import type { CalendarData } from '../../domain/calendarData';
import type { GradeType } from '../../utility/data/common/gradeType';
import type { RaceType } from '../../utility/raceType';

export interface IRaceCalendarUseCase {
    
    fetchRacesFromCalendar: (
        startDate: Date,
        finishDate: Date,
        raceTypeList: RaceType[],
    ) => Promise<CalendarData[]>;
    
    updateRacesToCalendar: (
        startDate: Date,
        finishDate: Date,
        raceTypeList: RaceType[],
        displayGradeList: {
            [RaceType.JRA]: GradeType[];
            [RaceType.NAR]: GradeType[];
            [RaceType.OVERSEAS]: GradeType[];
            [RaceType.KEIRIN]: GradeType[];
            [RaceType.AUTORACE]: GradeType[];
            [RaceType.BOATRACE]: GradeType[];
        },
    ) => Promise<void>;
}
