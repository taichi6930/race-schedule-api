import type { CalendarData } from '../../domain/calendarData';
import type { RaceType } from '../../utility/raceType';
import type { GradeType } from '../../utility/validateAndType/gradeType';

export interface IRaceCalendarUseCase {
    /**
     * カレンダーからレース情報を取得
     * @param startDate - 取得開始日
     * @param finishDate - 取得終了日（含む）
     * @param raceTypeList - レース種別リスト
     */
    fetchRacesFromCalendar: (
        startDate: Date,
        finishDate: Date,
        raceTypeList: RaceType[],
    ) => Promise<CalendarData[]>;

    /**
     * カレンダーの更新を行う
     * @param startDate - 取得開始日
     * @param finishDate - 取得終了日（含む）
     * @param raceTypeList - レース種別リスト
     * @param displayGradeList - 表示対象のグレードリスト
     */
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
