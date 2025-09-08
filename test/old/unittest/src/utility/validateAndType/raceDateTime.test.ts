import { validateRaceDateTime } from '../../../../../../lib/src/utility/validateAndType/raceDateTime';

/**
 * RaceDateTimeのテスト
 */
describe('RaceDateTime', () => {
    it('正常系', () => {
        const dateTime = new Date();
        const result = validateRaceDateTime(dateTime);
        expect(result).toStrictEqual(dateTime);
    });

    it('異常系', () => {
        const dateTime = new Date('');
        expect(() => validateRaceDateTime(dateTime)).toThrow();
    });
});
