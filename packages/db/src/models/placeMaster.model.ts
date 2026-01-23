/**
 * PlaceMaster モデル
 * 開催場マスター情報に関するデータベース操作のヘルパー関数
 */

import type { PlaceMasterInsert, PlaceMasterRow } from '../types/schemas';

/**
 * PlaceMasterRowが有効かバリデーション
 * @param row データベースから取得した行
 * @returns バリデーション結果
 */
export function isValidPlaceMasterRow(row: unknown): row is PlaceMasterRow {
    return (
        typeof row === 'object' &&
        row !== null &&
        typeof (row as PlaceMasterRow).race_type === 'string' &&
        typeof (row as PlaceMasterRow).course_code_type === 'string' &&
        typeof (row as PlaceMasterRow).place_name === 'string' &&
        typeof (row as PlaceMasterRow).place_code === 'string' &&
        typeof (row as PlaceMasterRow).created_at === 'string' &&
        typeof (row as PlaceMasterRow).updated_at === 'string'
    );
}

/**
 * PlaceMasterInsertデータのバリデーション
 * @param data 挿入データ
 * @returns バリデーション結果
 */
export function isValidPlaceMasterInsert(
    data: unknown,
): data is PlaceMasterInsert {
    return (
        typeof data === 'object' &&
        data !== null &&
        typeof (data as PlaceMasterInsert).race_type === 'string' &&
        typeof (data as PlaceMasterInsert).course_code_type === 'string' &&
        typeof (data as PlaceMasterInsert).place_name === 'string' &&
        typeof (data as PlaceMasterInsert).place_code === 'string'
    );
}
