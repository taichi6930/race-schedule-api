/**
 * Player モデル
 * 選手情報に関するデータベース操作のヘルパー関数
 */

import type { PlayerInsert, PlayerRow } from '../types/schemas';

/**
 * PlayerRowが有効かバリデーション
 * @param row データベースから取得した行
 * @returns バリデーション結果
 */
export function isValidPlayerRow(row: unknown): row is PlayerRow {
    return (
        typeof row === 'object' &&
        row !== null &&
        typeof (row as PlayerRow).race_type === 'string' &&
        typeof (row as PlayerRow).player_no === 'string' &&
        typeof (row as PlayerRow).player_name === 'string' &&
        typeof (row as PlayerRow).priority === 'number' &&
        typeof (row as PlayerRow).created_at === 'string' &&
        typeof (row as PlayerRow).updated_at === 'string'
    );
}

/**
 * PlayerInsertデータのバリデーション
 * @param data 挿入データ
 * @returns バリデーション結果
 */
export function isValidPlayerInsert(data: unknown): data is PlayerInsert {
    return (
        typeof data === 'object' &&
        data !== null &&
        typeof (data as PlayerInsert).race_type === 'string' &&
        typeof (data as PlayerInsert).player_no === 'string' &&
        typeof (data as PlayerInsert).player_name === 'string' &&
        typeof (data as PlayerInsert).priority === 'number'
    );
}

/**
 * 選手リストを優先度でソート
 * @param players 選手リスト
 * @returns ソート済み選手リスト
 */
export function sortPlayersByPriority(players: PlayerRow[]): PlayerRow[] {
    return [...players].toSorted((a, b) => a.priority - b.priority);
}
