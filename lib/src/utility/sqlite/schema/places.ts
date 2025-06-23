/**
 * Places テーブルのスキーマ定義
 */
export const CREATE_PLACES_TABLE = `
CREATE TABLE IF NOT EXISTS places (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    race_type TEXT NOT NULL,
    code TEXT,
    prefecture TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(name, race_type)
)`;

/**
 * Places テーブルのトリガー定義
 */
export const CREATE_PLACES_TRIGGER = `
CREATE TRIGGER IF NOT EXISTS update_places_timestamp
    AFTER UPDATE ON places
BEGIN
    UPDATE places SET updated_at = CURRENT_TIMESTAMP
    WHERE id = NEW.id;
END;
`;
