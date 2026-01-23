/**
 * Place モデル
 * 開催場情報に関するデータベース操作のヘルパー関数
 */

import type { PlaceRow, PlaceInsert, PlaceUpdate } from '../types/schemas';

/**
 * 開催場IDを生成
 * @param raceType レース種別
 * @param dateTime 開催日時（YYYY-MM-DD HH:MM:SS）
 * @param locationCode 開催場コード
 * @returns 開催場ID（RaceType + YYYYMMDD + location_code）
 */
export function generatePlaceId(
  raceType: string,
  dateTime: string,
  locationCode: string,
): string {
  const dateOnly = dateTime.split(' ')[0].replace(/-/g, '');
  return `${raceType}${dateOnly}${locationCode}`;
}

/**
 * PlaceRowが有効かバリデーション
 * @param row データベースから取得した行
 * @returns バリデーション結果
 */
export function isValidPlaceRow(row: any): row is PlaceRow {
  return (
    typeof row === 'object' &&
    row !== null &&
    typeof row.place_id === 'string' &&
    typeof row.race_type === 'string' &&
    typeof row.date_time === 'string' &&
    typeof row.location_code === 'string' &&
    typeof row.created_at === 'string' &&
    typeof row.updated_at === 'string'
  );
}

/**
 * PlaceInsertデータのバリデーション
 * @param data 挿入データ
 * @returns バリデーション結果
 */
export function isValidPlaceInsert(data: any): data is PlaceInsert {
  return (
    typeof data === 'object' &&
    data !== null &&
    typeof data.place_id === 'string' &&
    typeof data.race_type === 'string' &&
    typeof data.date_time === 'string' &&
    typeof data.location_code === 'string'
  );
}
