/**
 * Race モデル
 * レース情報に関するデータベース操作のヘルパー関数
 */

import type { RaceInsert, RaceRow } from '../types/schemas';

/**
 * レースIDを生成
 * @param raceType レース種別
 * @param dateTime 開催日時（YYYY-MM-DD HH:MM:SS）
 * @param locationCode 開催場コード
 * @param raceNumber レース番号
 * @returns レースID（RaceType + YYYYMMDD + location_code + race_number）
 */
export function generateRaceId(
    raceType: string,
    dateTime: string,
    locationCode: string,
    raceNumber: number,
): string {
    const dateOnly = dateTime.split(' ')[0].replace(/-/g, '');
    const paddedRaceNumber = String(raceNumber).padStart(2, '0');
    return `${raceType}${dateOnly}${locationCode}${paddedRaceNumber}`;
}

/**
 * RaceRowが有効かバリデーション
 * @param row データベースから取得した行
 * @returns バリデーション結果
 */
export function isValidRaceRow(row: unknown): row is RaceRow {
    return (
        typeof row === 'object' &&
        row !== null &&
        typeof (row as RaceRow).race_id === 'string' &&
        typeof (row as RaceRow).place_id === 'string' &&
        typeof (row as RaceRow).race_type === 'string' &&
        typeof (row as RaceRow).date_time === 'string' &&
        typeof (row as RaceRow).location_code === 'string' &&
        typeof (row as RaceRow).race_number === 'number' &&
        typeof (row as RaceRow).created_at === 'string' &&
        typeof (row as RaceRow).updated_at === 'string'
    );
}

/**
 * RaceInsertデータのバリデーション
 * @param data 挿入データ
 * @returns バリデーション結果
 */
export function isValidRaceInsert(data: unknown): data is RaceInsert {
    return (
        typeof data === 'object' &&
        data !== null &&
        typeof (data as RaceInsert).race_id === 'string' &&
        typeof (data as RaceInsert).place_id === 'string' &&
        typeof (data as RaceInsert).race_type === 'string' &&
        typeof (data as RaceInsert).date_time === 'string' &&
        typeof (data as RaceInsert).location_code === 'string' &&
        typeof (data as RaceInsert).race_number === 'number'
    );
}
