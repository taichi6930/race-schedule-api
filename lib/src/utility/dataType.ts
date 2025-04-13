/**
 * アプリケーション全体で使用される共通データ型の定義
 *
 * このモジュールは、アプリケーション内でのデータ取得元や
 * データ形式を統一的に管理するための型定義を提供します。
 */

/**
 * データの取得元を示す定数オブジェクト
 *
 * アプリケーション内でのデータ取得元を以下の2種類に分類します：
 *
 * @property Storage - 永続化されたストレージからのデータ取得
 *                    - S3やローカルファイルシステムなど
 *                    - 高速なアクセスが可能
 *                    - キャッシュされたデータを使用
 *
 * @property Web - 外部Webサイトからの直接取得
 *                - JRA、地方競馬などの公式サイト
 *                - 最新のデータを取得可能
 *                - アクセス制限やレート制限に注意
 */
export const DataLocation = {
    Storage: 'storage',
    Web: 'web',
} as const;

/**
 * データ取得元を表すユニオン型
 *
 * この型は、DataLocationオブジェクトから自動的に生成され、
 * 有効なデータ取得元のみを受け入れる型安全性を提供します。
 *
 * @example
 * ```typescript
 * function fetchData(source: DataLocationType) {
 *   switch (source) {
 *     case DataLocation.Storage:
 *       return fetchFromStorage();
 *     case DataLocation.Web:
 *       return fetchFromWeb();
 *     default:
 *       // 型チェックにより、ここには到達しない
 *       throw new Error('Invalid data location');
 *   }
 * }
 * ```
 */
export type DataLocationType = (typeof DataLocation)[keyof typeof DataLocation];
