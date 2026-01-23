/**
 * PlaceMaster モデル
 * 開催場マスター情報に関するデータベース操作のヘルパー関数
 */

import type { PlaceMasterRow, PlaceMasterInsert, PlaceMasterUpdate } from '../types/schemas';

/**
 * PlaceMasterRowが有効かバリデーション
 * @param row データベースから取得した行
 * @returns バリデーション結果
 */
export function isValidPlaceMasterRow(row: any): row is PlaceMasterRow {
  return (
    typeof row === 'object' &&
    row !== null &&
    typeof row.race_type === 'string' &&
    typeof row.course_code_type === 'string' &&
    typeof row.place_name === 'string' &&
    typeof row.place_code === 'string' &&
    typeof row.created_at === 'string' &&
    typeof row.updated_at === 'string'
  );
}

/**
 * PlaceMasterInsertデータのバリデーション
 * @param data 挿入データ
 * @returns バリデーション結果
 */
export function isValidPlaceMasterInsert(data: any): data is PlaceMasterInsert {
  return (
    typeof data === 'object' &&
    data !== null &&
    typeof data.race_type === 'string' &&
    typeof data.course_code_type === 'string' &&
    typeof data.place_name === 'string' &&
    typeof data.place_code === 'string'
  );
}
