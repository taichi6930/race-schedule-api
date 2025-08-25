import { validateHeldTimes } from '../../../../../lib/src/utility/validateAndType/heldTimes';

/**
 * HeldTimesのテスト
 */
describe('HeldTimes', () => {
    it('正常系: レース番号が正常な場合', () => {
        const raceNumber = 1;
        const result = validateHeldTimes(raceNumber);
        expect(result).toBe(raceNumber);
    });

    it('異常系: レース番号が異常な場合', () => {
        const raceNumber = -1;
        expect(() => validateHeldTimes(raceNumber)).toThrow(
            '開催回数は1以上である必要があります',
        );
    });
});
