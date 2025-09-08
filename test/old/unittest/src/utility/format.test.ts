import '../../../../../lib/src/utility/format';

describe('String.prototype.replaceFromCodePoint', () => {
    // 基本的な全角数字の変換テスト
    test('全角数字を半角数字に変換できること', () => {
        const input = '１２３４５';
        const expected = '12345';
        expect(input.replaceFromCodePoint(/[\uFF10-\uFF19]/g)).toBe(expected);
    });

    // 文字列パターンによる単一文字の変換テスト
    test('文字列パターンで全角数字を半角数字に変換できること', () => {
        const input = 'テスト１２３テスト';
        expect(input.replaceFromCodePoint('１')).toBe('テスト1２３テスト');
    });

    // 正規表現パターンによる複数文字の変換テスト
    test('正規表現パターンで全角数字を半角数字に変換できること', () => {
        const input = 'テスト１２３テスト';
        const expected = 'テスト123テスト';
        expect(input.replaceFromCodePoint(/[\uFF10-\uFF19]/g)).toBe(expected);
    });

    // 変換対象が存在しない場合のテスト
    test('変換対象が存在しない場合は元の文字列を返すこと', () => {
        const input = 'テスト123テスト';
        expect(input.replaceFromCodePoint(/[\uFF10-\uFF19]/g)).toBe(input);
    });

    // コードポイントのnullish処理の確認テスト
    test('nullish文字のケースで正しく変換できること', () => {
        const input = '１２３';
        const expected = '1２３';
        expect(input.replaceFromCodePoint('１')).toBe(expected);
    });
});
