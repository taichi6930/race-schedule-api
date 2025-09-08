import type { CalendarData } from '../../../lib/src/domain/calendarData';
import type { GradeType } from '../../../lib/src/utility/validateAndType/gradeType';
import type { SearchCalendarFilterEntity } from '../../repository/entity/searchCalendarFilterEntity';
import type { CommonParameter } from '../../utility/commonParameter';
import type { RaceType } from '../../utility/raceType';

export interface ICalendarUseCase {
    /**
     * カレンダーからレース情報を取得
     * @param startDate - 取得開始日
     * @param finishDate - 取得終了日（含む）
     * @param raceTypeList - レース種別リスト
     */
    fetchCalendarRaceList: (
        commonParameter: CommonParameter,
        searchCalendarFilter: SearchCalendarFilterEntity,
    ) => Promise<CalendarData[]>;

    /**
     * カレンダーの更新を行う
     */
    updateCalendarRaceData: (
        commonParameter: CommonParameter,
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
