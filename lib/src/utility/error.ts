/**
 * エラーメッセージを生成する
 * @param prefix メッセージのプレフィックス
 * @param error エラーオブジェクト
 * @returns フォーマットされたエラーメッセージ
 */
export const createErrorMessage = (prefix: string, error: unknown): string => {
    if (error instanceof Error) {
        return `${prefix}: ${error.message}`;
    }
    return `${prefix}: Unknown error`;
};
