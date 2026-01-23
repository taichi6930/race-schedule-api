/**
 * Race テーブルのクエリ定義
 */

/**
 * レースを挿入するクエリ
 */
export const INSERT_RACE = `
  INSERT INTO race (race_id, place_id, race_type, date_time, location_code, race_number)
  VALUES (?, ?, ?, ?, ?, ?)
`;

/**
 * レースを更新するクエリ
 */
export const UPDATE_RACE = `
  UPDATE race
  SET place_id = ?, race_type = ?, date_time = ?, location_code = ?, race_number = ?
  WHERE race_id = ?
`;

/**
 * レースIDで検索するクエリ
 */
export const SELECT_RACE_BY_ID = `
  SELECT * FROM race
  WHERE race_id = ?
`;

/**
 * 開催場IDで全レースを検索するクエリ
 */
export const SELECT_RACES_BY_PLACE_ID = `
  SELECT * FROM race
  WHERE place_id = ?
  ORDER BY race_number ASC
`;

/**
 * レース種別で検索するクエリ
 */
export const SELECT_RACES_BY_RACE_TYPE = `
  SELECT * FROM race
  WHERE race_type = ?
  ORDER BY date_time DESC, race_number ASC
`;

/**
 * レース種別と日時範囲で検索するクエリ
 */
export const SELECT_RACES_BY_RACE_TYPE_AND_DATE_RANGE = `
  SELECT * FROM race
  WHERE race_type = ?
    AND date_time >= ?
    AND date_time <= ?
  ORDER BY date_time ASC, race_number ASC
`;

/**
 * レース種別、日時、開催場コードで検索するクエリ
 */
export const SELECT_RACES_BY_RACE_TYPE_DATE_AND_LOCATION = `
  SELECT * FROM race
  WHERE race_type = ?
    AND date_time = ?
    AND location_code = ?
  ORDER BY race_number ASC
`;

/**
 * レースを削除するクエリ
 */
export const DELETE_RACE = `
  DELETE FROM race
  WHERE race_id = ?
`;

/**
 * 開催場IDで全レースを削除するクエリ
 */
export const DELETE_RACES_BY_PLACE_ID = `
  DELETE FROM race
  WHERE place_id = ?
`;

/**
 * レースと開催場情報を結合して取得するクエリ
 */
export const SELECT_RACE_WITH_PLACE = `
  SELECT
    r.*,
    p.race_type as place_race_type,
    p.date_time as place_date_time,
    p.location_code as place_location_code
  FROM race r
  INNER JOIN place p ON r.place_id = p.place_id
  WHERE r.race_id = ?
`;

/**
 * レース種別と日時範囲でレースと開催場情報を結合して取得するクエリ
 */
export const SELECT_RACES_WITH_PLACE_BY_RACE_TYPE_AND_DATE_RANGE = `
  SELECT
    r.*,
    p.race_type as place_race_type,
    p.date_time as place_date_time,
    p.location_code as place_location_code
  FROM race r
  INNER JOIN place p ON r.place_id = p.place_id
  WHERE r.race_type = ?
    AND r.date_time >= ?
    AND r.date_time <= ?
  ORDER BY r.date_time ASC, r.race_number ASC
`;
