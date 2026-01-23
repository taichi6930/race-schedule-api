/**
 * Player テーブルのクエリ定義
 */

/**
 * 選手を挿入するクエリ
 */
export const INSERT_PLAYER = `
  INSERT INTO player (race_type, player_no, player_name, priority)
  VALUES (?, ?, ?, ?)
`;

/**
 * 選手を更新するクエリ
 */
export const UPDATE_PLAYER = `
  UPDATE player
  SET player_name = ?, priority = ?
  WHERE race_type = ? AND player_no = ?
`;

/**
 * レース種別と選手番号で検索するクエリ
 */
export const SELECT_PLAYER_BY_RACE_TYPE_AND_NO = `
  SELECT * FROM player
  WHERE race_type = ? AND player_no = ?
`;

/**
 * レース種別で全選手を検索するクエリ
 */
export const SELECT_PLAYERS_BY_RACE_TYPE = `
  SELECT * FROM player
  WHERE race_type = ?
  ORDER BY priority ASC
`;

/**
 * レース種別と優先度範囲で検索するクエリ
 */
export const SELECT_PLAYERS_BY_RACE_TYPE_AND_PRIORITY_RANGE = `
  SELECT * FROM player
  WHERE race_type = ?
    AND priority >= ?
    AND priority <= ?
  ORDER BY priority ASC
`;

/**
 * 選手名で部分一致検索するクエリ
 */
export const SELECT_PLAYERS_BY_NAME_LIKE = `
  SELECT * FROM player
  WHERE race_type = ?
    AND player_name LIKE ?
  ORDER BY priority ASC
`;

/**
 * 選手を削除するクエリ
 */
export const DELETE_PLAYER = `
  DELETE FROM player
  WHERE race_type = ? AND player_no = ?
`;

/**
 * レース種別で全選手を削除するクエリ
 */
export const DELETE_PLAYERS_BY_RACE_TYPE = `
  DELETE FROM player
  WHERE race_type = ?
`;

/**
 * 選手の優先度を一括更新するクエリ（トランザクション内で使用）
 */
export const UPDATE_PLAYER_PRIORITY = `
  UPDATE player
  SET priority = ?
  WHERE race_type = ? AND player_no = ?
`;
