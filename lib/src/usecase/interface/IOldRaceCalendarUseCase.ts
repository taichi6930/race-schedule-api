import type { GradeType } from '../../utility/data/base';

export interface IOldRaceCalendarUseCase {
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
