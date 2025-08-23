import { describe, expect, it } from 'vitest';

import { validateRaceName } from '../../../../../../lib/src/utility/data/common/raceName';

/**
 * RaceNameのテスト
 */
describe('RaceName', () => {
    describe('validateRaceName', () => {
        it('正常系', () => {
            expect(validateRaceName('レース名')).toBe('レース名');
        });

        it('異常系', () => {
            expect(() => validateRaceName('')).toThrow(
                '空文字は許可されていません',
            );
        });
    });
});
