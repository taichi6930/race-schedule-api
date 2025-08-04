import type { GradeType } from '../../../lib/src/utility/data/common/gradeType';
import {
    getAutoraceGoogleCalendarColorId,
    getBoatraceGoogleCalendarColorId,
    getJraGoogleCalendarColorId,
    getKeirinGoogleCalendarColorId,
    getNarGoogleCalendarColorId,
    getWorldGoogleCalendarColorId,
} from '../../../lib/src/utility/googleCalendar';
describe('getGoogleJraCalendarColorId', () => {
    it('リストに入っているGⅠの場合、Googleカレンダーの色IDを返す', () => {
        const raceGrade: GradeType = 'GⅠ';
        const result = getJraGoogleCalendarColorId(raceGrade);

        expect(result).toBe('9');
    });

    it('リストに入っていない場合、Googleカレンダーの色IDを返す', () => {
        const raceGrade: GradeType = 'GⅣ';
        const result = getJraGoogleCalendarColorId(raceGrade);

        expect(result).toBe('8');
    });
});

describe('getGoogleNarCalendarColorId', () => {
    it('リストに入っているGⅠの場合、Googleカレンダーの色IDを返す', () => {
        const raceGrade: GradeType = 'GⅠ';
        const result = getNarGoogleCalendarColorId(raceGrade);

        expect(result).toBe('9');
    });

    it('リストに入っていない場合、Googleカレンダーの色IDを返す', () => {
        const raceGrade: GradeType = 'GⅣ';
        const result = getNarGoogleCalendarColorId(raceGrade);

        expect(result).toBe('8');
    });
});

describe('getGoogleWorldCalendarColorId', () => {
    it('リストに入っているGⅠの場合、Googleカレンダーの色IDを返す', () => {
        const raceGrade: GradeType = 'GⅠ';
        const result = getWorldGoogleCalendarColorId(raceGrade);

        expect(result).toBe('9');
    });
});

describe('getKeirinGoogleCalendarColorId', () => {
    it('リストに入っているGⅠの場合、Googleカレンダーの色IDを返す', () => {
        const raceGrade: GradeType = 'GⅠ';
        const result = getKeirinGoogleCalendarColorId(raceGrade);

        expect(result).toBe('9');
    });
});

describe('getAutoraceGoogleCalendarColorId', () => {
    it('リストに入っているGⅠの場合、Googleカレンダーの色IDを返す', () => {
        const raceGrade: GradeType = 'GⅠ';
        const result = getAutoraceGoogleCalendarColorId(raceGrade);

        expect(result).toBe('9');
    });
});

describe('getBoatraceGoogleCalendarColorId', () => {
    it('リストに入っているGⅠの場合、Googleカレンダーの色IDを返す', () => {
        const raceGrade: GradeType = 'GⅠ';
        const result = getBoatraceGoogleCalendarColorId(raceGrade);

        expect(result).toBe('9');
    });
});
