-- カレンダー更新用 queue-batch テーブル作成
CREATE TABLE IF NOT EXISTS queue_batch (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    race_type TEXT NOT NULL,
    status INTEGER NOT NULL DEFAULT 0, -- 0:未実施, 1:実行済, 9:失敗
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- updated_atをレコード更新時に自動更新するトリガー（SQLite用例）
CREATE TRIGGER IF NOT EXISTS trigger_queue_batch_updated_at
AFTER UPDATE ON queue_batch
FOR EACH ROW
BEGIN
    UPDATE queue_batch SET updated_at = CURRENT_TIMESTAMP WHERE id = OLD.id;
END;
