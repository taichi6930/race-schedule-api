import { validateGradeType } from '../../../../../../lib/src/utility/data/common/gradeType';
import { testRaceTypeListAll } from '../../../mock/common/baseCommonData';

/**
 * RaceCourseのテスト
 */
describe('GradeType', () => {
    for (const raceType of testRaceTypeListAll) {
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
