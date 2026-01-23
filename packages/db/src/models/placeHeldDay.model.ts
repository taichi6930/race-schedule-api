/**
 * PlaceHeldDay モデル
 * 開催日情報に関するデータベース操作のヘルパー関数
 */

import type { PlaceHeldDayInsert, PlaceHeldDayRow } from '../types/schemas';

/**
 * PlaceHeldDayRowが有効かバリデーション
 * @param row データベースから取得した行
 * @returns バリデーション結果
 */
export function isValidPlaceHeldDayRow(row: unknown): row is PlaceHeldDayRow {
    return (
        typeof row === 'object' &&
        row !== null &&
        typeof (row as PlaceHeldDayRow).place_id === 'string' &&
        typeof (row as PlaceHeldDayRow).held_times === 'number' &&
        typeof (row as PlaceHeldDayRow).held_day_times === 'number' &&
        typeof (row as PlaceHeldDayRow).created_at === 'string' &&
        typeof (row as PlaceHeldDayRow).updated_at === 'string'
    );
}

/**
 * PlaceHeldDayInsertデータのバリデーション
 * @param data 挿入データ
 * @returns バリデーション結果
 */
export function isValidPlaceHeldDayInsert(
    data: unknown,
): data is PlaceHeldDayInsert {
    return (
        typeof data === 'object' &&
        data !== null &&
        typeof (data as PlaceHeldDayInsert).place_id === 'string' &&
        typeof (data as PlaceHeldDayInsert).held_times === 'number' &&
        typeof (data as PlaceHeldDayInsert).held_day_times === 'number'
    );
}
