
-- place_master テーブル作成
CREATE TABLE IF NOT EXISTS place_master (
	race_type VARCHAR(32) NOT NULL,         -- レース種別
	course_code_type VARCHAR(32) NOT NULL,  -- コースコード種別
	place_name VARCHAR(255) NOT NULL,       -- 開催場名
	place_code VARCHAR(32) NOT NULL,        -- 開催場コード
	created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, -- 作成日時
	updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, -- 更新日時
	PRIMARY KEY (race_type, course_code_type, place_name)
);

CREATE TRIGGER IF NOT EXISTS trg_place_master_updated_at
AFTER UPDATE ON place_master
FOR EACH ROW
BEGIN
    UPDATE place_master SET updated_at = CURRENT_TIMESTAMP
    WHERE race_type = NEW.race_type AND course_code_type = NEW.course_code_type AND place_name = NEW.place_name;
END;
