
export const formatDate = (date: Date): string => {
    return date.toISOString().replace('Z', '+09:00');
};


export const createAnchorTag = (text: string, url: string): string =>
    `<a href="${url}">${text}</a>`;


declare global {
    interface Date {
        getXDigitMonth: (digit: number) => string;
        getXDigitDays: (digit: number) => string;
        getXDigitHours: (digit: number) => string;
        getXDigitMinutes: (digit: number) => string;
    }
}


Date.prototype.getXDigitMonth = function (digit: number): string {
    return (this.getMonth() + 1).toString().padStart(digit, '0');
};


Date.prototype.getXDigitDays = function (digit: number): string {
    return this.getDate().toString().padStart(digit, '0');
};


Date.prototype.getXDigitHours = function (digit: number): string {
    return this.getHours().toString().padStart(digit, '0');
};


Date.prototype.getXDigitMinutes = function (digit: number): string {
    return this.getMinutes().toString().padStart(digit, '0');
};

declare global {
    interface Number {
        toXDigits: (digit: number) => string;
    }

    interface String {
        replaceFromCodePoint: (searchValue: string | RegExp) => string;
    }
}

Number.prototype.toXDigits = function (this: number, digit: number): string {
    return this.toString().padStart(digit, '0');
};

String.prototype.replaceFromCodePoint = function (
    searchValue: string | RegExp,
): string {
    return this.replace(searchValue, (s) =>
        String.fromCodePoint((s.codePointAt(0) ?? 0) - 0xfee0),
    );
};
