import { getGoogleCalendarColorId } from '../../../../../lib/src/utility/googleCalendar';
import type { GradeType } from '../../../../../lib/src/utility/validateAndType/gradeType';
import { RaceType } from '../../../../../src/utility/raceType';
describe('getGoogleCalendarColorId', () => {
    it('JRA: リストに入っているGⅠの場合、Googleカレンダーの色IDを返す', () => {
        const raceGrade: GradeType = 'GⅠ';
        const result = getGoogleCalendarColorId(RaceType.JRA, raceGrade);
        expect(result).toBe('9');
    });
    it('JRA: リストに入っていない場合、Googleカレンダーの色IDを返す', () => {
        const raceGrade: GradeType = 'GⅣ';
        const result = getGoogleCalendarColorId(RaceType.JRA, raceGrade);
        expect(result).toBe('8');
    });
    it('NAR: リストに入っているGⅠの場合、Googleカレンダーの色IDを返す', () => {
        const raceGrade: GradeType = 'GⅠ';
        const result = getGoogleCalendarColorId(RaceType.NAR, raceGrade);
        expect(result).toBe('9');
    });
    it('NAR: リストに入っていない場合、Googleカレンダーの色IDを返す', () => {
        const raceGrade: GradeType = 'GⅣ';
        const result = getGoogleCalendarColorId(RaceType.NAR, raceGrade);
        expect(result).toBe('8');
    });
    it('OVERSEAS: リストに入っているGⅠの場合、Googleカレンダーの色IDを返す', () => {
        const raceGrade: GradeType = 'GⅠ';
        const result = getGoogleCalendarColorId(RaceType.OVERSEAS, raceGrade);
        expect(result).toBe('9');
    });
    it('KEIRIN: リストに入っているGⅠの場合、Googleカレンダーの色IDを返す', () => {
        const raceGrade: GradeType = 'GⅠ';
        const result = getGoogleCalendarColorId(RaceType.KEIRIN, raceGrade);
        expect(result).toBe('9');
    });
    it('AUTORACE: リストに入っているGⅠの場合、Googleカレンダーの色IDを返す', () => {
        const raceGrade: GradeType = 'GⅠ';
        const result = getGoogleCalendarColorId(RaceType.AUTORACE, raceGrade);
        expect(result).toBe('9');
    });
    it('BOATRACE: リストに入っているGⅠの場合、Googleカレンダーの色IDを返す', () => {
        const raceGrade: GradeType = 'GⅠ';
        const result = getGoogleCalendarColorId(RaceType.BOATRACE, raceGrade);
        expect(result).toBe('9');
    });
});
