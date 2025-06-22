/**
 * 場所データテーブルの作成クエリ
 */
export const CREATE_PLACE_DATA_TABLE = `
CREATE TABLE IF NOT EXISTS place_data (
    id TEXT PRIMARY KEY,
    race_type TEXT NOT NULL,
    datetime TEXT NOT NULL,
    location TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (DATETIME('now', 'localtime')),
    updated_at TEXT NOT NULL DEFAULT (DATETIME('now', 'localtime'))
);`;

/**
 * 場所データテーブルの更新日時トリガー
 */
export const CREATE_PLACE_DATA_TRIGGER = `
CREATE TRIGGER IF NOT EXISTS update_place_timestamp 
AFTER UPDATE ON place_data
BEGIN
    UPDATE place_data 
    SET updated_at = DATETIME('now', 'localtime') 
    WHERE rowid == NEW.rowid;
END;`;
