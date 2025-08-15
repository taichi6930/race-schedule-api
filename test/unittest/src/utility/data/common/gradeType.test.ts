import { validateGradeType } from '../../../../../../lib/src/utility/data/common/gradeType';
import { RaceType } from '../../../../../../lib/src/utility/raceType';

/**
 * RaceCourseのテスト
 */
describe('GradeType', () => {
    for (const { okPattern, raceType } of [
        {
            okPattern: 'GⅠ',
            raceType: RaceType.JRA,
        },
        {
            okPattern: 'GⅠ',
            raceType: RaceType.NAR,
        },
        {
            okPattern: 'GⅠ',
            raceType: RaceType.OVERSEAS,
        },
        {
            okPattern: 'GⅠ',
            raceType: RaceType.KEIRIN,
        },
        {
            okPattern: 'SG',
            raceType: RaceType.AUTORACE,
        },
        {
            okPattern: 'SG',
            raceType: RaceType.BOATRACE,
        },
    ]) {
        it(`正常系: ${raceType}のグレードが正常な場合`, () => {
            const result = validateGradeType(raceType, okPattern);
            expect(result).toBe(okPattern);
        });

        it(`異常系: ${raceType}のグレードが異常な場合`, () => {
            expect(() => validateGradeType(raceType, '不正なグレード')).toThrow(
                `${raceType}のグレードではありません`,
            );
        });
    }
});
