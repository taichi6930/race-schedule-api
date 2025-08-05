-- DBスキーマ定義
CREATE TABLE IF NOT EXISTS players (
    race_type TEXT NOT NULL
    ,player_no TEXT NOT NULL
    ,player_name TEXT NOT NULL
    ,priority INTEGER NOT NULL DEFAULT 0
    ,created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ,updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ,UNIQUE(race_type, player_no)
);

CREATE TRIGGER IF NOT EXISTS update_players_updated_at
AFTER UPDATE ON players
FOR EACH ROW
BEGIN
    UPDATE players SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;

CREATE TABLE IF NOT EXISTS places (
    id INTEGER PRIMARY KEY
    ,race_type TEXT NOT NULL
    ,date_time DATETIME NOT NULL
    ,location TEXT NOT NULL
    ,created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ,updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ,UNIQUE(id)
);

CREATE TRIGGER IF NOT EXISTS update_places_updated_at
AFTER UPDATE ON places
FOR EACH ROW
BEGIN
    UPDATE places SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;