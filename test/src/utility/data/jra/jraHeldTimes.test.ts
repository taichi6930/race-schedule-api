import { validateJraHeldTimes } from '../../../../../lib/src/utility/data/jra/jraHeldTimes';

/**
 * JraHeldTimesのテスト
 */
describe('JraHeldTimes', () => {
    it('正常系: レース番号が正常な場合', () => {
        const raceNumber = 1;
        const result = validateJraHeldTimes(raceNumber);
        expect(result).toBe(raceNumber);
    });

    it('異常系: レース番号が異常な場合', () => {
        const raceNumber = -1;
        expect(() => validateJraHeldTimes(raceNumber)).toThrow(
            '開催回数は1以上である必要があります',
        );
    });

    it('異常系: レース番号がundefinedの場合', () => {
        const raceNumber = undefined;
        expect(() => validateJraHeldTimes(raceNumber)).toThrow(
            '開催回数がundefinedです',
        );
    });
});
