import { CalendarData } from "../../domain/calendarData";

export interface IRaceCalendarUseCase<R> {
    /**
     * カレンダーからレース情報の取得を行う
     * @param startDate
     * @param finishDate
     * @returns CalendarData[]
     */
    getRacesFromCalendar(startDate: Date, finishDate: Date): Promise<CalendarData[]>;
    /**
     * カレンダーの更新を行う
     * @param startDate
     * @param finishDate
     * @param displayGradeList
     */
    updateRacesToCalendar(startDate: Date, finishDate: Date, displayGradeList: string[]): Promise<void>;
    /**
     * カレンダーのクレンジングを行う
     * 既に旧システムのレース情報が登録されている場合、削除する
     * @param startDate
     * @param finishDate
     */
    cleansingRacesFromCalendar(startDate: Date, finishDate: Date): Promise<void>;
}