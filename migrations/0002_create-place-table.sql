-- placeテーブル作成

CREATE TABLE IF NOT EXISTS place (
    id TEXT PRIMARY KEY,
    race_type TEXT NOT NULL,
    date_time TEXT NOT NULL,
    location_name TEXT NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- インデックス作成
CREATE INDEX IF NOT EXISTS idx_place_race_type ON place(race_type);
CREATE INDEX IF NOT EXISTS idx_place_location_name ON place(location_name);
CREATE INDEX IF NOT EXISTS idx_place_date_time ON place(date_time);

-- updated_at自動更新トリガー
CREATE TRIGGER IF NOT EXISTS trg_place_updated_at
AFTER UPDATE ON place
FOR EACH ROW
BEGIN
    UPDATE place SET updated_at = CURRENT_TIMESTAMP
    WHERE id = NEW.id;
END;

INSERT INTO place (id, race_type, date_time, location_name) VALUES
('keirin2025100111', 'KEIRIN', '2025-10-01 00:00:00', '函館');