import { validateAutoracePositionNumber } from '../../../../../lib/src/utility/data/common/positionNumber';

/**
 * AutoracePositionNumberのテスト
 */
describe('AutoracePositionNumber', () => {
    it('正常系: 枠番が正常な場合', () => {
        const positionNumber = 1;
        const result = validateAutoracePositionNumber(positionNumber);
        expect(result).toBe(positionNumber);
    });

    it('異常系: 枠番が異常な場合', () => {
        const positionNumber = -1;
        expect(() => validateAutoracePositionNumber(positionNumber)).toThrow(
            '枠番は1以上である必要があります',
        );
    });
});
