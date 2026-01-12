/**
 * 日付をフォーマットする
 * @param date - フォーマットする日付
 * @returns ISOフォーマットかつ日本時間（+09:00）の日付文字列
 */
export const formatDate = (date: Date): string => {
    return date.toISOString().replace('Z', '+09:00');
};

/**
 * リンクタグを作成する
 * @param text - リンクのテキスト
 * @param url - リンク先のURL
 * @returns HTMLのアンカータグ文字列
 */
export const createAnchorTag = (text: string, url: string): string =>
    `<a href="${url}">${text}</a>`;

const padNumber = (value: number, digit: number): string => {
    return value.toString().padStart(digit, '0');
};

export const formatMonthDigits = (date: Date, digit: number): string =>
    padNumber(date.getMonth() + 1, digit);

export const formatDayDigits = (date: Date, digit: number): string =>
    padNumber(date.getDate(), digit);

export const formatHourDigits = (date: Date, digit: number): string =>
    padNumber(date.getHours(), digit);

export const formatMinuteDigits = (date: Date, digit: number): string =>
    padNumber(date.getMinutes(), digit);

export const toXDigits = (value: number, digit: number): string =>
    padNumber(value, digit);

export const replaceFromCodePoint = (
    input: string,
    searchValue: string | RegExp,
): string => {
    return input.replace(searchValue, (s) =>
        String.fromCodePoint((s.codePointAt(0) ?? 0) - 0xfee0),
    );
};
