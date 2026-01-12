CREATE TABLE IF NOT EXISTS race_player (
    id TEXT PRIMARY KEY,
    race_type TEXT NOT NULL,
    race_id TEXT NOT NULL,
    position_number INTEGER NOT NULL,
    player_number INTEGER NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_race_player_race_type ON race_player(race_type);
CREATE INDEX IF NOT EXISTS idx_race_player_race_id ON race_player(race_id);
CREATE INDEX IF NOT EXISTS idx_race_player_position_number ON race_player(position_number);

CREATE TRIGGER IF NOT EXISTS trg_race_player_updated_at
AFTER UPDATE ON race_player
FOR EACH ROW
BEGIN
    UPDATE race_player SET updated_at = CURRENT_TIMESTAMP
    WHERE id = NEW.id;
END;
