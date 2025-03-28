/**
 * 日付をフォーマットする
 * @param date
 * @returns
 */
export const formatDate = (date: Date): string => {
    return date.toISOString().replace('Z', '+09:00');
};

/**
 * リンクタグを作成する
 * @param text
 * @param url
 * @returns
 */
export const createAnchorTag = (text: string, url: string): string =>
    `<a href="${url}">${text}</a>`;

/**
 * 日付をフォーマットする
 */
declare global {
    interface Date {
        getXDigitMonth: (digit: number) => string;
        getXDigitDays: (digit: number) => string;
        getXDigitHours: (digit: number) => string;
        getXDigitMinutes: (digit: number) => string;
    }
}

/**
 * 月をX桁に変換する
 */
Date.prototype.getXDigitMonth = function (digit: number): string {
    return (this.getMonth() + 1).toString().padStart(digit, '0');
};

/**
 * 日をX桁に変換する
 */
Date.prototype.getXDigitDays = function (digit: number): string {
    return this.getDate().toString().padStart(digit, '0');
};

/**
 * 時をX桁に変換する
 */
Date.prototype.getXDigitHours = function (digit: number): string {
    return this.getHours().toString().padStart(digit, '0');
};

/**
 * 分をX桁に変換する
 */
Date.prototype.getXDigitMinutes = function (digit: number): string {
    return this.getMinutes().toString().padStart(digit, '0');
};

declare global {
    interface Number {
        toXDigits: (digit: number) => string;
    }
}

Number.prototype.toXDigits = function (this: number, digit: number): string {
    return this.toString().padStart(digit, '0');
};
