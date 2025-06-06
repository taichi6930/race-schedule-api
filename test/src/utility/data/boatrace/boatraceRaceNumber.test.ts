import { validateBoatraceRaceNumber } from '../../../../../lib/src/utility/data/boatrace/boatraceRaceNumber';

/**
 * BoatraceRaceNumberのテスト
 */
describe('BoatraceRaceNumber', () => {
    it('正常系: レース番号が正常な場合', () => {
        const raceNumber = 1;
        const result = validateBoatraceRaceNumber(raceNumber);
        expect(result).toBe(raceNumber);
    });

    it('異常系: レース番号が異常な場合', () => {
        const raceNumber = -1;
        expect(() => validateBoatraceRaceNumber(raceNumber)).toThrow(
            'レース番号は1以上である必要があります',
        );
    });
});
