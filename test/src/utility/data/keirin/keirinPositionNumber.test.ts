import { validateKeirinPositionNumber } from '../../../../../lib/src/utility/data/common/positionNumber';

/**
 * KeirinPositionNumberのテスト
 */
describe('KeirinPositionNumber', () => {
    it('正常系: 枠番が正常な場合', () => {
        const positionNumber = 1;
        const result = validateKeirinPositionNumber(positionNumber);
        expect(result).toBe(positionNumber);
    });

    it('異常系: 枠番が異常な場合', () => {
        const positionNumber = -1;
        expect(() => validateKeirinPositionNumber(positionNumber)).toThrow(
            '枠番は1以上である必要があります',
        );
    });
});
