CREATE TABLE IF NOT EXISTS place_grade (
    id TEXT PRIMARY KEY,
    race_type TEXT NOT NULL,
    grade TEXT NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_place_grade_race_type ON place_grade(race_type);
CREATE INDEX IF NOT EXISTS idx_place_grade_grade ON place_grade(grade);
CREATE INDEX IF NOT EXISTS idx_place_grade_race_type_grade ON place_grade(race_type, grade);

CREATE TRIGGER IF NOT EXISTS trg_place_grade_updated_at
AFTER UPDATE ON place_grade
FOR EACH ROW
BEGIN
    UPDATE place_grade SET updated_at = CURRENT_TIMESTAMP
    WHERE id = NEW.id;
END;
