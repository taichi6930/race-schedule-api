import type { CalendarData } from '../../domain/calendarData';
import type { GradeType } from '../../utility/data/base';

export interface IRaceCalendarUseCase {
    /**
     * カレンダーからレース情報の取得を行う
     * @param startDate
     * @param finishDate
     */
    getRacesFromCalendar: (
        startDate: Date,
        finishDate: Date,
        raceTypeList?: string[],
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
        displayGradeList: GradeType[],
    ) => Promise<void>;
}
