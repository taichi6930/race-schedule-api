import { describe, expect, it } from 'vitest';
// @ts-ignore: 型宣言が見つからない場合はtsconfigで型解決する
import { validateHeldDayTimes } from '../src/types/heldDayTimes';

describe('HeldDayTimes', () => {
    describe('正常系', () => {
        it.each<number>([1, 5, 100])(
            '開催日数: %s は正常',
            (raceNumber: number) => {
                expect(validateHeldDayTimes(raceNumber)).toBe(raceNumber);
            },
        );
    });
    describe('異常系', () => {
        it.each<number>([0, -1, -100])(
            '開催日数: %s はエラー',
            (raceNumber: number) => {
                expect(() => validateHeldDayTimes(raceNumber)).toThrow(
                    '開催日数は1以上である必要があります',
                );
            },
        );
    });
});
