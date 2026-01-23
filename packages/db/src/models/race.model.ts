/**
 * Race モデル
 * レース情報に関するデータベース操作のヘルパー関数
 */

import type { RaceRow, RaceInsert, RaceUpdate } from '../types/schemas';

/**
 * レースIDを生成
 * @param raceType レース種別
 * @param dateTime 開催日時（YYYY-MM-DD HH:MM:SS）
 * @param locationCode 開催場コード
 * @param raceNumber レース番号
 * @returns レースID
 */
export function generateRaceId(
  raceType: string,
  dateTime: string,
  locationCode: string,
  raceNumber: number,
): string {
  const dateOnly = dateTime.split(' ')[0].replace(/-/g, '');
  const paddedNumber = String(raceNumber).padStart(2, '0');
  return `${raceType}${dateOnly}${locationCode}${paddedNumber}`;
}

/**
 * RaceRowが有効かバリデーション
 * @param row データベースから取得した行
 * @returns バリデーション結果
 */
export function isValidRaceRow(row: any): row is RaceRow {
  return (
    typeof row === 'object' &&
    row !== null &&
    typeof row.race_id === 'string' &&
    typeof row.place_id === 'string' &&
    typeof row.race_type === 'string' &&
    typeof row.date_time === 'string' &&
    typeof row.location_code === 'string' &&
    typeof row.race_number === 'number' &&
    typeof row.created_at === 'string' &&
    typeof row.updated_at === 'string'
  );
}

/**
 * RaceInsertデータのバリデーション
 * @param data 挿入データ
 * @returns バリデーション結果
 */
export function isValidRaceInsert(data: any): data is RaceInsert {
  return (
    typeof data === 'object' &&
    data !== null &&
    typeof data.race_id === 'string' &&
    typeof data.place_id === 'string' &&
    typeof data.race_type === 'string' &&
    typeof data.date_time === 'string' &&
    typeof data.location_code === 'string' &&
    typeof data.race_number === 'number'
  );
}
