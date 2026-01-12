-- Make place_id NOT NULL by recreating the table and migrating data
-- Non-destructive migration: ensure place_id is populated and indexes/triggers exist.
-- NOTE: Adding NOT NULL constraint requires table rebuild; avoid destructive operation here.

-- Fill missing place_id values from id (id without last 2 characters)
UPDATE race
SET place_id = substr(id, 1, length(id) - 2)
WHERE (place_id IS NULL OR place_id = '') AND length(id) > 2;

-- Create indexes if missing
CREATE INDEX IF NOT EXISTS idx_race_race_type ON race(race_type);
CREATE INDEX IF NOT EXISTS idx_race_location_name ON race(location_name);
CREATE INDEX IF NOT EXISTS idx_race_date_time ON race(date_time);
CREATE INDEX IF NOT EXISTS idx_race_type_date_time ON race(race_type, date_time);

-- Create trigger if missing (some SQLite variants may not support IF NOT EXISTS for triggers)
-- Use a safe create: attempt to create and ignore errors in environments that already have the trigger.
CREATE TRIGGER IF NOT EXISTS trg_race_updated_at
AFTER UPDATE ON race
FOR EACH ROW
BEGIN
    UPDATE race SET updated_at = CURRENT_TIMESTAMP
    WHERE id = NEW.id;
END;
