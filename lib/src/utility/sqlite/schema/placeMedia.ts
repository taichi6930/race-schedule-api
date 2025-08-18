
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


export const CREATE_PLACE_MEDIA_TRIGGER = `
CREATE TRIGGER IF NOT EXISTS update_place_media_timestamp 
    AFTER UPDATE ON place_media
BEGIN
    UPDATE place_media SET updated_at = CURRENT_TIMESTAMP
    WHERE id = NEW.id;
END;
`;
