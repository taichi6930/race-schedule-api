import { validateBoatraceRaceDateTime } from '../../../../../lib/src/utility/data/boatrace/boatraceRaceDateTime';

/**
 * BoatraceRaceDateTimeのテスト
 */
describe('BoatraceRaceDateTime', () => {
    it('正常系', () => {
        const dateTime = new Date();
        const result = validateBoatraceRaceDateTime(dateTime);
        expect(result).toStrictEqual(dateTime);
    });

    it('異常系', () => {
        const dateTime = new Date('');
        expect(() => validateBoatraceRaceDateTime(dateTime)).toThrow();
    });
});
