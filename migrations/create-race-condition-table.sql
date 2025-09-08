CREATE TABLE IF NOT EXISTS race_condition (
    id TEXT PRIMARY KEY,
    race_type TEXT NOT NULL,
    surface_type TEXT NOT NULL,
    distance INTEGER NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_race_condition_race_type ON race_condition(race_type);
CREATE INDEX IF NOT EXISTS idx_race_condition_surface_type ON race_condition(surface_type);
CREATE INDEX IF NOT EXISTS idx_race_condition_distance ON race_condition(distance);

CREATE TRIGGER IF NOT EXISTS trg_race_condition_updated_at
AFTER UPDATE ON race_condition
FOR EACH ROW
BEGIN
    UPDATE race_condition SET updated_at = CURRENT_TIMESTAMP
    WHERE id = NEW.id;
END;
