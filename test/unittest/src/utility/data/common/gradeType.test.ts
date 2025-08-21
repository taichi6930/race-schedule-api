import { validateGradeType } from '../../../../../../lib/src/utility/data/common/gradeType';
import { ALL_RACE_TYPE_LIST } from '../../../../../../lib/src/utility/raceType';

/**
 * RaceCourseのテスト
 */
describe('GradeType', () => {
    for (const raceType of ALL_RACE_TYPE_LIST) {
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
