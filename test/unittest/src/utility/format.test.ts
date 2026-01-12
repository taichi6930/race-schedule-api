import {
    formatDayDigits,
    formatHourDigits,
    formatMinuteDigits,
    formatMonthDigits,
    replaceFromCodePoint,
    toXDigits,
} from '../../../../packages/shared/src/utilities/format';

describe('replaceFromCodePoint', () => {
    test('正規表現で全角数字を半角数字に変換できること', () => {
        const input = '１２３４５';
        const expected = '12345';
        expect(replaceFromCodePoint(input, /[\uFF10-\uFF19]/g)).toBe(expected);
    });

    test('文字列パターンで単一文字を変換できること', () => {
        const input = 'テスト１２３テスト';
        expect(replaceFromCodePoint(input, '１')).toBe('テスト1２３テスト');
    });

    test('変換対象がない場合は元の文字列を返すこと', () => {
        const input = 'テスト123テスト';
        expect(replaceFromCodePoint(input, /[\uFF10-\uFF19]/g)).toBe(input);
    });
});

describe('date digit formatters', () => {
    const baseDate = new Date(2024, 0, 5, 4, 7);

    test('formatMonthDigits pads month values', () => {
        expect(formatMonthDigits(baseDate, 2)).toBe('01');
    });

    test('formatDayDigits pads day values', () => {
        expect(formatDayDigits(baseDate, 2)).toBe('05');
    });

    test('formatHourDigits pads hour values', () => {
        expect(formatHourDigits(baseDate, 2)).toBe('04');
    });

    test('formatMinuteDigits pads minute values', () => {
        expect(formatMinuteDigits(baseDate, 2)).toBe('07');
    });
});

describe('toXDigits', () => {
    test('指定桁でゼロ埋めできること', () => {
        expect(toXDigits(5, 3)).toBe('005');
    });

    test('既に桁数を満たしていればそのまま返すこと', () => {
        expect(toXDigits(1234, 2)).toBe('1234');
    });
});
