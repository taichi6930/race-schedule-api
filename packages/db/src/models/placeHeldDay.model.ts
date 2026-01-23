/**
 * PlaceHeldDay モデル
 * 開催日情報に関するデータベース操作のヘルパー関数
 */

import type { PlaceHeldDayRow, PlaceHeldDayInsert, PlaceHeldDayUpdate } from '../types/schemas';

/**
 * PlaceHeldDayRowが有効かバリデーション
 * @param row データベースから取得した行
 * @returns バリデーション結果
 */
export function isValidPlaceHeldDayRow(row: any): row is PlaceHeldDayRow {
  return (
    typeof row === 'object' &&
    row !== null &&
    typeof row.place_id === 'string' &&
    typeof row.held_times === 'number' &&
    typeof row.held_day_times === 'number' &&
    typeof row.created_at === 'string' &&
    typeof row.updated_at === 'string'
  );
}

/**
 * PlaceHeldDayInsertデータのバリデーション
 * @param data 挿入データ
 * @returns バリデーション結果
 */
export function isValidPlaceHeldDayInsert(data: any): data is PlaceHeldDayInsert {
  return (
    typeof data === 'object' &&
    data !== null &&
    typeof data.place_id === 'string' &&
    typeof data.held_times === 'number' &&
    typeof data.held_day_times === 'number'
  );
}
