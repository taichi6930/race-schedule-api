/**
 * エラーメッセージを一貫したフォーマットで生成するユーティリティ
 *
 * - prefix: エラー発生箇所や処理名
 * - error: Errorインスタンスまたはunknown
 * - 例: createErrorMessage('API', error) → 'API: ...'
 * - 不明なエラーは 'Unknown error' を付加
 *
 * 使用例:
 *   try { ... } catch (e) {
 *     console.error(createErrorMessage('Data Fetch', e));
 *   }
 */

export const createErrorMessage = (prefix: string, error: unknown): string => {
    if (error instanceof Error) {
        return `${prefix}: ${error.message}`;
    }
    return `${prefix}: Unknown error`;
};
