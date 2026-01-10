import { validateRaceNumber } from '../../../../../packages/shared/src/types/raceNumber';

/**
 * RaceNumberのテスト
 */
describe('RaceNumber', () => {
    it('正常系: レース番号が正常な場合', () => {
        const raceNumber = 1;
        const result = validateRaceNumber(raceNumber);
        expect(result).toBe(raceNumber);
    });

    it('異常系: レース番号が異常な場合', () => {
        const raceNumber = -1;
        expect(() => validateRaceNumber(raceNumber)).toThrow(
            'レース番号は1以上である必要があります',
        );
    });
});
