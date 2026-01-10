import { validateRaceDistance } from '../../../../../packages/shared/src/types/raceDistance';

/**
 * RaceDistanceのテスト
 */
describe('RaceDistance', () => {
    it('正常系: レース距離が正常な場合', () => {
        const distance = 1000;
        const result = validateRaceDistance(distance);
        expect(result).toBe(distance);
    });

    it('異常系: レース距離が異常な場合', () => {
        const distance = -1;
        expect(() => validateRaceDistance(distance)).toThrow(
            '距離は0よりも大きい必要があります',
        );
    });
});
