/**
 * データ更新結果の詳細を表す型
 *
 * 更新に失敗した個々のレコードの情報を保持します
 */
export interface FailureDetail {
    /** データベースまたはテーブルの識別子 */
    db: string;
    /** 失敗したレコードのID */
    id: string;
    /** 失敗の理由 */
    reason: string;
}

/**
 * データ更新（Upsert）操作の結果を表す型
 *
 * 成功件数、失敗件数、および失敗の詳細を含みます
 */
export interface UpsertResult {
    /** 更新に成功したレコード数 */
    successCount: number;
    /** 更新に失敗したレコード数 */
    failureCount: number;
    /** 失敗の詳細リスト */
    failures: FailureDetail[];
}
