import { RaceType } from '../src';
import { validatePositionNumber } from '../src/types/positionNumber';

/**
 * PositionNumberのテスト
 */
import { describe, expect, it } from 'vitest';

/**
 * PositionNumberのテスト
 */
describe('PositionNumber', () => {
    it(`正常系`, () => {
        const positionNumber = 1;
        const result = validatePositionNumber(RaceType.JRA, positionNumber);
        expect(result).toBe(positionNumber);
    });

    it(`異常系: 枠番が異常な場合`, () => {
        const positionNumber = -1;
        expect(() =>
            validatePositionNumber(RaceType.JRA, positionNumber),
        ).toThrow('枠番は1以上である必要があります');
    });
});
