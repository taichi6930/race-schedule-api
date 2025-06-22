/**
 * 開催回数データテーブルの作成クエリ
 */
export const CREATE_PLACE_HELD_DATA_TABLE = `
CREATE TABLE IF NOT EXISTS place_held_data (
    id TEXT PRIMARY KEY,
    race_type TEXT NOT NULL,
    held_times INTEGER NOT NULL,
    held_day_times INTEGER NOT NULL,
    created_at TEXT NOT NULL DEFAULT (DATETIME('now', 'localtime')),
    updated_at TEXT NOT NULL DEFAULT (DATETIME('now', 'localtime'))
);`;

/**
 * 開催回数データテーブルの更新日時トリガー
 */
export const CREATE_PLACE_HELD_DATA_TRIGGER = `
CREATE TRIGGER IF NOT EXISTS update_place_held_timestamp 
AFTER UPDATE ON place_held_data
BEGIN
    UPDATE place_held_data 
    SET updated_at = DATETIME('now', 'localtime') 
    WHERE rowid == NEW.rowid;
END;`;
