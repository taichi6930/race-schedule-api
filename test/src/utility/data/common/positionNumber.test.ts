import { validatePositionNumber } from '../../../../../lib/src/utility/data/common/positionNumber';
import { RaceType } from '../../../../../lib/src/utility/raceType';

/**
 * PositionNumberのテスト
 */
describe('PositionNumber', () => {
    it('正常系: 枠番が正常な場合', () => {
        const positionNumber = 1;
        const result = validatePositionNumber(
            RaceType.AUTORACE,
            positionNumber,
        );
        expect(result).toBe(positionNumber);
    });

    it('異常系: 枠番が異常な場合', () => {
        const positionNumber = -1;
        expect(() =>
            validatePositionNumber(RaceType.AUTORACE, positionNumber),
        ).toThrow('枠番は1以上である必要があります');
    });
});
