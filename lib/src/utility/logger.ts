/**
 * アプリケーションのロギング機能を提供するモジュール
 *
 * このモジュールは、メソッドの実行状況を自動的にログ出力する
 * デコレータベースのロギング機能を提供します。主な機能：
 * - メソッドの開始・終了のログ出力
 * - エラー発生時の詳細なログ記録
 * - 実行時間の計測（開始・終了時刻の記録）
 * - 開発・本番環境での適切なログレベル制御
 */

import { format } from 'date-fns';

/**
 * メソッドの実行状況を自動的にログ出力するデコレータ
 *
 * このデコレータは、対象メソッドの実行前後とエラー発生時に
 * 自動的にログを出力します。出力される情報：
 * - タイムスタンプ（yyyy-MM-dd HH:mm:ss形式）
 * - クラス名とメソッド名
 * - 実行状態（開始/終了/エラー）
 *
 * ログのフォーマット：
 * `[timestamp] [ClassName.methodName] 状態`
 *
 * @param _target - デコレータのターゲットオブジェクト
 * @param propertyKey - 対象メソッド名
 * @param descriptor - メソッドのプロパティディスクリプタ
 *
 * @example
 * ```typescript
 * class ExampleService {
 *   @Logger
 *   async fetchData() {
 *     // メソッドの実装
 *   }
 * }
 *
 * // 出力例：
 * // 2024-01-01 12:00:00 [ExampleService.fetchData] 開始
 * // 2024-01-01 12:00:01 [ExampleService.fetchData] 終了
 * ```
 *
 * 注意:
 * - 非同期メソッド（Promise を返すメソッド）にのみ使用可能
 * - エラーが発生した場合も、元のエラーは正しく伝播
 * - 本番環境ではデバッグログは無効化される
 */
export function Logger(
    _target: object,
    propertyKey: string,
    descriptor: PropertyDescriptor,
): void {
    const originalMethod = descriptor.value;
    descriptor.value = async function (...args: unknown[]): Promise<unknown> {
        const constructorName = Object.getPrototypeOf(this).constructor.name;

        console.log(
            `${format(new Date(), 'yyyy-MM-dd HH:mm:ss')} [${constructorName}.${propertyKey}] 開始`,
        );
        try {
            const result: unknown = await originalMethod.apply(this, args);
            console.log(
                `${format(new Date(), 'yyyy-MM-dd HH:mm:ss')} [${constructorName}.${propertyKey}] 終了`,
            );
            return result;
        } catch (error) {
            console.error(
                `${format(new Date(), 'yyyy-MM-dd HH:mm:ss')} [${constructorName}.${propertyKey}] エラー`,
                error,
            );
            throw error;
        }
    };
}

/**
 * 本番環境でのデバッグログ制御
 *
 * IS_DEBUG環境変数が'false'の場合（本番環境）、
 * console.debugによるログ出力を無効化します。
 * これにより、本番環境でのログ量を適切に制御し、
 * パフォーマンスとログの可読性を向上させます。
 */
if (process.env.IS_DEBUG === 'false') {
    console.debug = (): void => {
        // Debugging is disabled in production
    };
}
