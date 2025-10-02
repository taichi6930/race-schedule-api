-- カレンダー更新用 queue-batch テーブル作成
CREATE TABLE queue_batch (
    update_type TEXT NOT NULL, -- CALENDAR, RACE, PLACE いずれかを指定
    id TEXT NOT NULL,
    race_type TEXT NOT NULL,
    queue_status INTEGER NOT NULL DEFAULT 0, -- 0:未実施, 1:実行済, 9:失敗
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (update_type, id, race_type)
);

-- updated_atをレコード更新時に自動更新するトリガー（SQLite用例）
CREATE TRIGGER trigger_queue_batch_updated_at
AFTER UPDATE ON queue_batch
FOR EACH ROW
BEGIN
    UPDATE queue_batch SET updated_at = CURRENT_TIMESTAMP
    WHERE id = OLD.id AND update_type = OLD.update_type AND race_type = OLD.race_type;
END;

-- INSERTをする
-- CALENDAR, id=OVERSEAS202512310401, race_type=OVERSEAS, queue_status=0
INSERT INTO queue_batch (update_type, id, race_type, queue_status)
VALUES ('CALENDAR', 'OVERSEAS202512310401', 'OVERSEAS', 0)