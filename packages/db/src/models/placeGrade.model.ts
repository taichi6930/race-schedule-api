/**
 * PlaceGrade モデル
 * 開催場グレード情報に関するデータベース操作のヘルパー関数
 */

import type { PlaceGradeInsert, PlaceGradeRow } from '../types/schemas';

/**
 * PlaceGradeRowが有効かバリデーション
 * @param row データベースから取得した行
 * @returns バリデーション結果
 */
export function isValidPlaceGradeRow(row: unknown): row is PlaceGradeRow {
    return (
        typeof row === 'object' &&
        row !== null &&
        typeof (row as PlaceGradeRow).place_id === 'string' &&
        typeof (row as PlaceGradeRow).place_grade === 'string' &&
        typeof (row as PlaceGradeRow).created_at === 'string' &&
        typeof (row as PlaceGradeRow).updated_at === 'string'
    );
}

/**
 * PlaceGradeInsertデータのバリデーション
 * @param data 挿入データ
 * @returns バリデーション結果
 */
export function isValidPlaceGradeInsert(
    data: unknown,
): data is PlaceGradeInsert {
    return (
        typeof data === 'object' &&
        data !== null &&
        typeof (data as PlaceGradeInsert).place_id === 'string' &&
        typeof (data as PlaceGradeInsert).place_grade === 'string'
    );
}
