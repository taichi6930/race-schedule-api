import { describe, expect, it } from 'vitest';

import { validateUpdateDate } from '../../../../lib/src/utility/updateDate';

/**
 * UpdateDateのテスト
 */
describe('UpdateDate', () => {
    it('正常系', () => {
        const dateTime = new Date();
        const result = validateUpdateDate(dateTime);
        expect(result).toStrictEqual(dateTime);
    });

    it('正常系 文字列', () => {
        const dateTime = '2021-01-01';
        const result = validateUpdateDate(dateTime);
        expect(result).toStrictEqual(new Date(dateTime));
    });

    it('異常系', () => {
        const dateTime = '2021-01-500';
        expect(() => validateUpdateDate(dateTime)).toThrow();
    });

    it('異常系 undefined', () => {
        const dateTime = undefined;
        expect(() => validateUpdateDate(dateTime)).toThrow();
    });
});
