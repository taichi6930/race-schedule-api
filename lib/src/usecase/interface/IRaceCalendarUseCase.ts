import type { CalendarData } from '../../domain/calendarData';
import type { GradeType } from '../../utility/data/common/gradeType';
import type { RaceType } from '../../utility/raceType';

export interface IRaceCalendarUseCase {
    /**
     * カレンダーからレース情報の取得を行う
     * @param startDate
     * @param finishDate
     */
    fetchRacesFromCalendar: (
        startDate: Date,
        finishDate: Date,
        raceTypeList: RaceType[],
    ) => Promise<CalendarData[]>;
    /**
     * カレンダーの更新を行う
     * @param startDate
     * @param finishDate
     * @param displayGradeList
     */
    updateRacesToCalendar: (
        startDate: Date,
        finishDate: Date,
        raceTypeList: RaceType[],
        displayGradeList: {
            jra: GradeType[];
            nar: GradeType[];
            world: GradeType[];
            keirin: GradeType[];
            autorace: GradeType[];
            boatrace: GradeType[];
        },
    ) => Promise<void>;
}
