import { validateGradeType } from '../../../../../../lib/src/utility/data/common/gradeType';
import { RaceType } from '../../../../../../lib/src/utility/raceType';

/**
 * RaceCourseのテスト
 */
describe('GradeType', () => {
    for (const {
        descriptions,
        okPattern,
        ngPattern,
        raceType,
        falseDescriptions,
    } of [
        {
            descriptions: '中央競馬グレード',
            okPattern: 'GⅠ',
            ngPattern: 'G2',
            raceType: RaceType.JRA,
            falseDescriptions: 'JRAのグレードではありません',
        },
        {
            descriptions: '地方競馬のグレード',
            okPattern: 'GⅠ',
            ngPattern: 'G2',
            raceType: RaceType.NAR,
            falseDescriptions: 'NARのグレードではありません',
        },
        {
            descriptions: '海外競馬のグレード',
            okPattern: 'GⅠ',
            ngPattern: 'G2',
            raceType: RaceType.WORLD,
            falseDescriptions: 'WORLDのグレードではありません',
        },
        {
            descriptions: '競輪のグレード',
            okPattern: 'GⅠ',
            ngPattern: 'G2',
            raceType: RaceType.KEIRIN,
            falseDescriptions: 'KEIRINのグレードではありません',
        },
        {
            descriptions: 'オートレースのグレード',
            okPattern: 'SG',
            ngPattern: 'G2',
            raceType: RaceType.AUTORACE,
            falseDescriptions: 'AUTORACEのグレードではありません',
        },
        {
            descriptions: 'ボートレースのグレード',
            okPattern: 'SG',
            ngPattern: 'G2',
            raceType: RaceType.BOATRACE,
            falseDescriptions: 'BOATRACEのグレードではありません',
        },
    ]) {
        it(`正常系: ${raceType}のグレードが正常な場合 - ${descriptions}`, () => {
            const result = validateGradeType(raceType, okPattern);
            expect(result).toBe(okPattern);
        });

        it(`異常系: ${raceType}のグレードが異常な場合 - ${falseDescriptions}`, () => {
            expect(() => validateGradeType(raceType, ngPattern)).toThrow(
                falseDescriptions,
            );
        });
    }
});
