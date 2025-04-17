/**
 * エラー処理に関するユーティリティ関数を提供するモジュール
 *
 * このモジュールは、アプリケーション全体で一貫したエラーメッセージの
 * フォーマットと処理を実現するための機能を提供します。主な目的：
 * - エラーメッセージの標準化
 * - エラートレースの容易化
 * - デバッグ情報の適切な提供
 */

/**
 * 一貫したフォーマットでエラーメッセージを生成します
 *
 * このメソッドは、エラーの発生箇所や種類を明確にするために、
 * プレフィックスとエラー内容を組み合わせた標準的なフォーマットの
 * メッセージを生成します。
 *
 * メッセージのフォーマット規則：
 * - プレフィックスは処理の種類や場所を示す（例: "JRA Data Fetch"）
 * - プレフィックスとエラー内容はコロンで区切る
 * - 不明なエラーの場合は "Unknown error" を使用
 *
 * @param prefix - エラーの発生箇所や種類を示すプレフィックス
 *                例: "Database Connection", "API Request"
 * @param error - 発生したエラーオブジェクト。unknownとして受け取り、
 *               型に応じて適切に処理
 * @returns プレフィックスとエラーメッセージを組み合わせた文字列
 * @example
 * ```typescript
 * try {
 *   await fetchData();
 * } catch (error) {
 *   const message = createErrorMessage("Data Fetch", error);
 *   // 出力例: "Data Fetch: Network connection failed"
 *   console.error(message);
 * }
 * ```
 *
 * 注意:
 * - プレフィックスは簡潔かつ意味のある文字列にすべき
 * - センシティブな情報がエラーメッセージに含まれないよう注意
 * - エラーチェーンの場合は元のエラーメッセージを保持
 */
export const createErrorMessage = (prefix: string, error: unknown): string => {
    if (error instanceof Error) {
        return `${prefix}: ${error.message}`;
    }
    return `${prefix}: Unknown error`;
};
