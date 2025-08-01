import { validateRaceCourse } from '../../../../../lib/src/utility/data/common/raceCourse';
import { RaceType } from '../../../../../lib/src/utility/raceType';

/**
 * KeirinRaceCourseのテスト
 */
describe('KeirinRaceCourse', () => {
    it('正常系: 競輪場が正常な場合', () => {
        const course = '立川';
        const result = validateRaceCourse(RaceType.KEIRIN, course);
        expect(result).toBe(course);
    });

    it('異常系: 競輪場が異常な場合', () => {
        const course = '東京';
        expect(() => validateRaceCourse(RaceType.KEIRIN, course)).toThrow(
            '競輪場ではありません',
        );
    });
});
