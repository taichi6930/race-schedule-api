import { validateWorldRaceNumber } from '../../../../../../lib/src/utility/data/world/worldRaceNumber';

/**
 * WorldRaceNumberのテスト
 */
describe('WorldRaceNumber', () => {
    it('正常系: レース番号が正常な場合', () => {
        const raceNumber = 1;
        const result = validateWorldRaceNumber(raceNumber);
        expect(result).toBe(raceNumber);
    });
});
