import { validateHeldDayTimes } from '../../../../../../lib/src/utility/data/common/heldDayTimes';

/**
 * HeldDayTimesのテスト
 */
describe('HeldDayTimes', () => {
    it('正常系: レース番号が正常な場合', () => {
        const raceNumber = 1;
        const result = validateHeldDayTimes(raceNumber);
        expect(result).toBe(raceNumber);
    });

    it('異常系: レース番号が異常な場合', () => {
        const raceNumber = -1;
        expect(() => validateHeldDayTimes(raceNumber)).toThrow(
            '開催日数は1以上である必要があります',
        );
    });
});
