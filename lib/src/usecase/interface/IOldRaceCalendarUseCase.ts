import type { CalendarData } from '../../domain/calendarData';
import type { GradeType } from '../../utility/data/base';

export interface IOldRaceCalendarUseCase {
    /**
     * カレンダーからレース情報の取得を行う
     * @param startDate
     * @param finishDate
     */
    fetchRacesFromCalendar: (
        startDate: Date,
        finishDate: Date,
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
