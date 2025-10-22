import type { CalendarData } from '../../domain/calendarData';
import type { SearchCalendarFilterEntity } from '../../repository/entity/filter/searchCalendarFilterEntity';
import type { RaceType } from '../../utility/raceType';
import type { GradeType } from '../../utility/validateAndType/gradeType';

export interface ICalendarUseCase {
    /**
     * カレンダーからレース情報を取得
     * @param searchCalendarFilter - カレンダーフィルター情報
     */
    fetchCalendarRaceList: (
        searchCalendarFilter: SearchCalendarFilterEntity,
    ) => Promise<CalendarData[]>;

    /**
     * カレンダーの更新を行う
     * @param searchCalendarFilter - カレンダーフィルター情報
     * @param displayGradeList - 表示するグレードリスト
     */
    updateCalendarRaceData: (
        searchCalendarFilter: SearchCalendarFilterEntity,
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
