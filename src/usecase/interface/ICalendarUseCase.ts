import type { CalendarData } from '../../domain/calendarData';
import type { SearchCalendarFilterEntity } from '../../repository/entity/filter/searchCalendarFilterEntity';
import type { RaceType } from '../../utility/raceType';
import type { GradeType } from '../../utility/validateAndType/gradeType';

export interface ICalendarUseCase {
    /**
     * カレンダーからレース情報を取得
     * @param startDate - 取得開始日
     * @param finishDate - 取得終了日（含む）
     * @param raceTypeList - レース種別リスト
     */
    fetchCalendarRaceList: (
        searchCalendarFilter: SearchCalendarFilterEntity,
    ) => Promise<CalendarData[]>;

    /**
     * カレンダーの更新を行う
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
