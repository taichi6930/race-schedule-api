import type { BoatraceGradeType } from '../../../lib/src/utility/data/boatrace/boatraceGradeType';
import type { AutoraceGradeType } from '../../../lib/src/utility/data/common/gradeType';
import type { JraGradeType } from '../../../lib/src/utility/data/jra/jraGradeType';
import type { KeirinGradeType } from '../../../lib/src/utility/data/keirin/keirinGradeType';
import type { NarGradeType } from '../../../lib/src/utility/data/nar/narGradeType';
import type { WorldGradeType } from '../../../lib/src/utility/data/world/worldGradeType';
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
        const raceGrade: JraGradeType = 'GⅠ';
        const result = getJraGoogleCalendarColorId(raceGrade);

        expect(result).toBe('9');
    });

    it('リストに入っていない場合、Googleカレンダーの色IDを返す', () => {
        const raceGrade: JraGradeType = 'GⅣ';
        const result = getJraGoogleCalendarColorId(raceGrade);

        expect(result).toBe('8');
    });
});

describe('getGoogleNarCalendarColorId', () => {
    it('リストに入っているGⅠの場合、Googleカレンダーの色IDを返す', () => {
        const raceGrade: NarGradeType = 'GⅠ';
        const result = getNarGoogleCalendarColorId(raceGrade);

        expect(result).toBe('9');
    });

    it('リストに入っていない場合、Googleカレンダーの色IDを返す', () => {
        const raceGrade: NarGradeType = 'GⅣ';
        const result = getNarGoogleCalendarColorId(raceGrade);

        expect(result).toBe('8');
    });
});

describe('getGoogleWorldCalendarColorId', () => {
    it('リストに入っているGⅠの場合、Googleカレンダーの色IDを返す', () => {
        const raceGrade: WorldGradeType = 'GⅠ';
        const result = getWorldGoogleCalendarColorId(raceGrade);

        expect(result).toBe('9');
    });
});

describe('getKeirinGoogleCalendarColorId', () => {
    it('リストに入っているGⅠの場合、Googleカレンダーの色IDを返す', () => {
        const raceGrade: KeirinGradeType = 'GⅠ';
        const result = getKeirinGoogleCalendarColorId(raceGrade);

        expect(result).toBe('9');
    });
});

describe('getAutoraceGoogleCalendarColorId', () => {
    it('リストに入っているGⅠの場合、Googleカレンダーの色IDを返す', () => {
        const raceGrade: AutoraceGradeType = 'GⅠ';
        const result = getAutoraceGoogleCalendarColorId(raceGrade);

        expect(result).toBe('9');
    });
});

describe('getBoatraceGoogleCalendarColorId', () => {
    it('リストに入っているGⅠの場合、Googleカレンダーの色IDを返す', () => {
        const raceGrade: BoatraceGradeType = 'GⅠ';
        const result = getBoatraceGoogleCalendarColorId(raceGrade);

        expect(result).toBe('9');
    });
});
