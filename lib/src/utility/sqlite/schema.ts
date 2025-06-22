/**
 * Places テーブルの作成クエリ
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
 * PlaceMedia テーブルの作成クエリ
 */
export const CREATE_PLACE_MEDIA_TABLE = `
CREATE TABLE IF NOT EXISTS place_media (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    place_id INTEGER NOT NULL,
    media_type TEXT NOT NULL,
    user_id TEXT NOT NULL,
    is_active BOOLEAN DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (place_id) REFERENCES places(id),
    UNIQUE(place_id, media_type)
)`;

/**
 * テーブル作成クエリの配列
 */
export const SCHEMA_QUERIES = [CREATE_PLACES_TABLE, CREATE_PLACE_MEDIA_TABLE];
