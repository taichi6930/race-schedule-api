import { testRaceTypeListAll } from '../../../test/unittest/src/mock/common/baseCommonData';
import { validatePositionNumber } from '../src/types/positionNumber';

/**
 * PositionNumberのテスト
 */
describe.each(testRaceTypeListAll)('PositionNumber(%s)', (raceType) => {
    it(`正常系: 枠番が正常な場合(${raceType})`, () => {
        const positionNumber = 1;
        const result = validatePositionNumber(raceType, positionNumber);
        expect(result).toBe(positionNumber);
    });

    it(`異常系: 枠番が異常な場合(${raceType})`, () => {
        const positionNumber = -1;
        expect(() => validatePositionNumber(raceType, positionNumber)).toThrow(
            '枠番は1以上である必要があります',
        );
    });
});
