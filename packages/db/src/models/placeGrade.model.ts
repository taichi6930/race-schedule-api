/**
 * PlaceGrade モデル
 * 開催場グレード情報に関するデータベース操作のヘルパー関数
 */

import type { PlaceGradeRow, PlaceGradeInsert, PlaceGradeUpdate } from '../types/schemas';

/**
 * PlaceGradeRowが有効かバリデーション
 * @param row データベースから取得した行
 * @returns バリデーション結果
 */
export function isValidPlaceGradeRow(row: any): row is PlaceGradeRow {
  return (
    typeof row === 'object' &&
    row !== null &&
    typeof row.place_id === 'string' &&
    typeof row.place_grade === 'string' &&
    typeof row.created_at === 'string' &&
    typeof row.updated_at === 'string'
  );
}

/**
 * PlaceGradeInsertデータのバリデーション
 * @param data 挿入データ
 * @returns バリデーション結果
 */
export function isValidPlaceGradeInsert(data: any): data is PlaceGradeInsert {
  return (
    typeof data === 'object' &&
    data !== null &&
    typeof data.place_id === 'string' &&
    typeof data.place_grade === 'string'
  );
}
