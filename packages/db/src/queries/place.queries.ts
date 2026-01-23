/**
 * Place テーブルのクエリ定義
 */

/**
 * 開催場を挿入するクエリ
 */
export const INSERT_PLACE = `
  INSERT INTO place (place_id, race_type, date_time, location_code)
  VALUES (?, ?, ?, ?)
`;

/**
 * 開催場を更新するクエリ
 */
export const UPDATE_PLACE = `
  UPDATE place
  SET race_type = ?, date_time = ?, location_code = ?
  WHERE place_id = ?
`;

/**
 * 開催場IDで検索するクエリ
 */
export const SELECT_PLACE_BY_ID = `
  SELECT * FROM place
  WHERE place_id = ?
`;

/**
 * レース種別で開催場を検索するクエリ
 */
export const SELECT_PLACES_BY_RACE_TYPE = `
  SELECT * FROM place
  WHERE race_type = ?
  ORDER BY date_time DESC
`;

/**
 * レース種別と日時範囲で開催場を検索するクエリ
 */
export const SELECT_PLACES_BY_RACE_TYPE_AND_DATE_RANGE = `
  SELECT * FROM place
  WHERE race_type = ?
    AND date_time >= ?
    AND date_time <= ?
  ORDER BY date_time ASC
`;

/**
 * レース種別と開催場コードで開催場を検索するクエリ
 */
export const SELECT_PLACES_BY_RACE_TYPE_AND_LOCATION = `
  SELECT * FROM place
  WHERE race_type = ?
    AND location_code = ?
  ORDER BY date_time DESC
`;

/**
 * 開催場を削除するクエリ
 */
export const DELETE_PLACE = `
  DELETE FROM place
  WHERE place_id = ?
`;

/**
 * 開催場グレードを挿入するクエリ
 */
export const INSERT_PLACE_GRADE = `
  INSERT INTO place_grade (place_id, place_grade)
  VALUES (?, ?)
`;

/**
 * 開催場グレードを更新するクエリ
 */
export const UPDATE_PLACE_GRADE = `
  UPDATE place_grade
  SET place_grade = ?
  WHERE place_id = ?
`;

/**
 * 開催場IDで開催場グレードを検索するクエリ
 */
export const SELECT_PLACE_GRADE_BY_ID = `
  SELECT * FROM place_grade
  WHERE place_id = ?
`;

/**
 * グレードで開催場グレードを検索するクエリ
 */
export const SELECT_PLACE_GRADES_BY_GRADE = `
  SELECT * FROM place_grade
  WHERE place_grade = ?
`;

/**
 * 開催場グレードを削除するクエリ
 */
export const DELETE_PLACE_GRADE = `
  DELETE FROM place_grade
  WHERE place_id = ?
`;

/**
 * 開催日情報を挿入するクエリ
 */
export const INSERT_PLACE_HELD_DAY = `
  INSERT INTO place_held_day (place_id, held_times, held_day_times)
  VALUES (?, ?, ?)
`;

/**
 * 開催日情報を更新するクエリ
 */
export const UPDATE_PLACE_HELD_DAY = `
  UPDATE place_held_day
  SET held_times = ?, held_day_times = ?
  WHERE place_id = ?
`;

/**
 * 開催場IDで開催日情報を検索するクエリ
 */
export const SELECT_PLACE_HELD_DAY_BY_ID = `
  SELECT * FROM place_held_day
  WHERE place_id = ?
`;

/**
 * 開催日情報を削除するクエリ
 */
export const DELETE_PLACE_HELD_DAY = `
  DELETE FROM place_held_day
  WHERE place_id = ?
`;

/**
 * 開催場情報を完全に取得するクエリ（place + place_grade + place_held_day）
 */
export const SELECT_PLACE_WITH_DETAILS = `
  SELECT
    p.*,
    pg.place_grade,
    phd.held_times,
    phd.held_day_times
  FROM place p
  LEFT JOIN place_grade pg ON p.place_id = pg.place_id
  LEFT JOIN place_held_day phd ON p.place_id = phd.place_id
  WHERE p.place_id = ?
`;

/**
 * レース種別と日時範囲で開催場情報を完全に取得するクエリ
 */
export const SELECT_PLACES_WITH_DETAILS_BY_RACE_TYPE_AND_DATE_RANGE = `
  SELECT
    p.*,
    pg.place_grade,
    phd.held_times,
    phd.held_day_times
  FROM place p
  LEFT JOIN place_grade pg ON p.place_id = pg.place_id
  LEFT JOIN place_held_day phd ON p.place_id = phd.place_id
  WHERE p.race_type = ?
    AND p.date_time >= ?
    AND p.date_time <= ?
  ORDER BY p.date_time ASC
`;
