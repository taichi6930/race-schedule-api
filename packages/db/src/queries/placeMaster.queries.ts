/**
 * PlaceMaster テーブルのクエリ定義
 */

/**
 * 開催場マスターを挿入するクエリ
 */
export const INSERT_PLACE_MASTER = `
  INSERT INTO place_master (race_type, course_code_type, place_name, place_code)
  VALUES (?, ?, ?, ?)
`;

/**
 * 開催場マスターを更新するクエリ
 */
export const UPDATE_PLACE_MASTER = `
  UPDATE place_master
  SET place_code = ?
  WHERE race_type = ? AND course_code_type = ? AND place_name = ?
`;

/**
 * 主キーで開催場マスターを検索するクエリ
 */
export const SELECT_PLACE_MASTER_BY_KEY = `
  SELECT * FROM place_master
  WHERE race_type = ? AND course_code_type = ? AND place_name = ?
`;

/**
 * レース種別で開催場マスターを検索するクエリ
 */
export const SELECT_PLACE_MASTERS_BY_RACE_TYPE = `
  SELECT * FROM place_master
  WHERE race_type = ?
  ORDER BY place_name ASC
`;

/**
 * レース種別とコースコード種別で開催場マスターを検索するクエリ
 */
export const SELECT_PLACE_MASTERS_BY_RACE_TYPE_AND_COURSE_CODE_TYPE = `
  SELECT * FROM place_master
  WHERE race_type = ? AND course_code_type = ?
  ORDER BY place_name ASC
`;

/**
 * 開催場コードで開催場マスターを検索するクエリ
 */
export const SELECT_PLACE_MASTER_BY_PLACE_CODE = `
  SELECT * FROM place_master
  WHERE place_code = ?
`;

/**
 * 開催場名で部分一致検索するクエリ
 */
export const SELECT_PLACE_MASTERS_BY_NAME_LIKE = `
  SELECT * FROM place_master
  WHERE race_type = ? AND place_name LIKE ?
  ORDER BY place_name ASC
`;

/**
 * 開催場マスターを削除するクエリ
 */
export const DELETE_PLACE_MASTER = `
  DELETE FROM place_master
  WHERE race_type = ? AND course_code_type = ? AND place_name = ?
`;

/**
 * レース種別で全開催場マスターを削除するクエリ
 */
export const DELETE_PLACE_MASTERS_BY_RACE_TYPE = `
  DELETE FROM place_master
  WHERE race_type = ?
`;

/**
 * 全開催場マスターを取得するクエリ
 */
export const SELECT_ALL_PLACE_MASTERS = `
  SELECT * FROM place_master
  ORDER BY race_type ASC, place_name ASC
`;
