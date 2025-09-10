CREATE TABLE IF NOT EXISTS race_stage (
    id TEXT PRIMARY KEY,
    race_type TEXT NOT NULL,
    stage INTEGER NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_race_stage_race_type ON race_stage(race_type);
CREATE INDEX IF NOT EXISTS idx_race_stage_stage ON race_stage(stage);

CREATE TRIGGER IF NOT EXISTS trg_race_stage_updated_at
AFTER UPDATE ON race_stage
FOR EACH ROW
BEGIN
    UPDATE race_stage SET updated_at = CURRENT_TIMESTAMP
    WHERE id = NEW.id;
END;
