CREATE TABLE IF NOT EXISTS place (
    place_id TEXT PRIMARY KEY, -- 開催場ID（RaceType + YYYYMMDD + location_codeの組み合わせ）
    race_type TEXT NOT NULL, -- レース種別
    date_time DATETIME NOT NULL, -- 開催日時
    location_code TEXT NOT NULL, -- 開催場コード
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, -- 作成日時
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP -- 更新日時
);
-- race_type, date_time, location_codeの組み合わせで一意制約
CREATE UNIQUE INDEX IF NOT EXISTS idx_place_unique_race_type_date_time_location_code
    ON place(race_type, date_time, location_code);

-- インデックス作成
CREATE INDEX IF NOT EXISTS idx_place_race_type ON place(race_type);
CREATE INDEX IF NOT EXISTS idx_place_location_code ON place(location_code);
CREATE INDEX IF NOT EXISTS idx_place_date_time ON place(date_time);
-- 複合インデックス（検索高速化用、必要に応じて）
CREATE INDEX IF NOT EXISTS idx_place_race_type_date_time_location_code
    ON place(race_type, date_time, location_code);

-- updated_at自動更新トリガー
CREATE TRIGGER IF NOT EXISTS trg_place_updated_at
AFTER UPDATE ON place
FOR EACH ROW
BEGIN
    UPDATE place SET updated_at = CURRENT_TIMESTAMP
    WHERE place_id = NEW.place_id;
END;
