/**
 * メソッドの実行状況を自動でログ出力するデコレータ
 *
 * - メソッドの開始・終了・エラーをタイムスタンプ付きで出力
 * - 実行時間（ms）も記録
 * - 非同期メソッド（Promiseを返す）専用
 *
 * 使用例：
 *   class Example {
 *     @Logger
 *     async fetchData() { ... }
 *   }
 *   // [2024-01-01 12:00:00] [Example.fetchData] 開始
 *   // [2024-01-01 12:00:01] [Example.fetchData] 終了 (1000 ms)
 */

import { format } from 'date-fns';

/**
 * @Logger デコレータ
 * - メソッドの開始・終了・エラーを自動でログ出力
 * - 非同期メソッド専用
 *
 * @param _target - デコレータのターゲット
 * @param propertyKey - メソッド名
 * @param descriptor - プロパティディスクリプタ
 */
export function Logger(
    _target: object,
    propertyKey: string,
    descriptor: PropertyDescriptor,
): void {
    const originalMethod = descriptor.value;
    descriptor.value = async function (...args: unknown[]): Promise<unknown> {
        const constructorName = Object.getPrototypeOf(this).constructor.name;
        const startTime = Date.now();
        console.log(
            `${format(new Date(), 'yyyy-MM-dd HH:mm:ss')} [${constructorName}.${propertyKey}] 開始`,
        );
        try {
            const result: unknown = await originalMethod.apply(this, args);
            const endTime = Date.now();
            const elapsed = endTime - startTime;
            console.log(
                `${format(new Date(), 'yyyy-MM-dd HH:mm:ss')} [${constructorName}.${propertyKey}] 終了`,
                `(${elapsed} ms)`,
            );
            return result;
        } catch (error) {
            const endTime = Date.now();
            const elapsed = endTime - startTime;
            console.error(
                `${format(new Date(), 'yyyy-MM-dd HH:mm:ss')} [${constructorName}.${propertyKey}] エラー (${elapsed} ms)`,
                error,
            );
            throw error;
        }
    };
}
