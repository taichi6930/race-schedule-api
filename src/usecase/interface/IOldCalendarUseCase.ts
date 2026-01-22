import type { CalendarDataDto } from '../../../packages/api/src/domain/calendarData';
import type { RaceType } from '../../../packages/shared/src/types/raceType';
import type { GradeType } from '../../../packages/shared/src/utilities/gradeType';
import type { OldSearchCalendarFilterEntity } from '../../repository/entity/filter/oldSearchCalendarFilterEntity';

export interface IOldCalendarUseCase {
    /**
     * カレンダーからレース情報を取得
     * @param searchCalendarFilter - カレンダーフィルター情報
     */
    fetchCalendarRaceList: (
        searchCalendarFilter: OldSearchCalendarFilterEntity,
    ) => Promise<CalendarDataDto[]>;

    /**
     * カレンダーの更新を行う
     * @param searchCalendarFilter - カレンダーフィルター情報
     * @param displayGradeList - 表示するグレードリスト
     */
    updateCalendarRaceData: (
        searchCalendarFilter: OldSearchCalendarFilterEntity,
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
