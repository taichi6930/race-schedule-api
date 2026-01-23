/**
 * Player モデル
 * 選手マスタ情報に関するデータベース操作のヘルパー関数
 */

import type { PlayerRow, PlayerInsert, PlayerUpdate } from '../types/schemas';

/**
 * PlayerRowが有効かバリデーション
 * @param row データベースから取得した行
 * @returns バリデーション結果
 */
export function isValidPlayerRow(row: any): row is PlayerRow {
  return (
    typeof row === 'object' &&
    row !== null &&
    typeof row.race_type === 'string' &&
    typeof row.player_no === 'string' &&
    typeof row.player_name === 'string' &&
    typeof row.priority === 'number' &&
    typeof row.created_at === 'string' &&
    typeof row.updated_at === 'string'
  );
}

/**
 * PlayerInsertデータのバリデーション
 * @param data 挿入データ
 * @returns バリデーション結果
 */
export function isValidPlayerInsert(data: any): data is PlayerInsert {
  return (
    typeof data === 'object' &&
    data !== null &&
    typeof data.race_type === 'string' &&
    typeof data.player_no === 'string' &&
    typeof data.player_name === 'string' &&
    typeof data.priority === 'number'
  );
}

/**
 * 選手の優先度でソート
 * @param players 選手のリスト
 * @returns ソートされた選手のリスト
 */
export function sortPlayersByPriority(players: PlayerRow[]): PlayerRow[] {
  return [...players].sort((a, b) => a.priority - b.priority);
}
