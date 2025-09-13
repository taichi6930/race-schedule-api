import type { CalendarData } from '../../../../src/domain/calendarData';
import type { RaceType } from '../../../../src/utility/raceType';
import type { GradeType } from '../../../../src/utility/validateAndType/gradeType';

export interface IRaceCalendarUseCaseForAWS {
    /**
     * カレンダーからレース情報を取得
     * @param startDate - 取得開始日
     * @param finishDate - 取得終了日（含む）
     * @param raceTypeList - レース種別リスト
     */
    fetchCalendarRaceList: (
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
    updateCalendarRaceData: (
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
