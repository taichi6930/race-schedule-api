import { validateGradeType } from '../../../../../../lib/src/utility/data/common/gradeType';
import { RACE_TYPE_LIST_ALL } from '../../../../../../lib/src/utility/raceType';

/**
 * RaceCourseのテスト
 */
describe('GradeType', () => {
    for (const raceType of RACE_TYPE_LIST_ALL) {
        it(`正常系: ${raceType}のグレードが正常な場合`, () => {
            const result = validateGradeType(raceType, 'GⅠ');
            expect(result).toBe('GⅠ');
        });

        it(`異常系: ${raceType}のグレードが異常な場合`, () => {
            expect(() => validateGradeType(raceType, '不正なグレード')).toThrow(
                `${raceType}のグレードではありません`,
            );
        });
    }
});
