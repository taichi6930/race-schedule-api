CREATE TABLE IF NOT EXISTS held_day (
    id TEXT PRIMARY KEY,
    race_type TEXT NOT NULL,
    held_times INTEGER NOT NULL,
    held_day_times INTEGER NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_held_day_race_type ON held_day(race_type);
CREATE INDEX IF NOT EXISTS idx_held_day_held_times ON held_day(held_times);
CREATE INDEX IF NOT EXISTS idx_held_day_held_day_times ON held_day(held_day_times);

CREATE TRIGGER IF NOT EXISTS trg_held_day_updated_at
AFTER UPDATE ON held_day
FOR EACH ROW
BEGIN
    UPDATE held_day SET updated_at = CURRENT_TIMESTAMP
    WHERE id = NEW.id;
END;
