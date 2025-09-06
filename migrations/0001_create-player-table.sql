-- ユーザーテーブル作成

CREATE TABLE IF NOT EXISTS player (
    race_type TEXT NOT NULL,
    player_no TEXT NOT NULL,
    player_name TEXT NOT NULL,
    priority INTEGER NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (race_type, player_no)
);

-- インデックス作成
CREATE INDEX IF NOT EXISTS idx_player_race_type ON player(race_type);
CREATE INDEX IF NOT EXISTS idx_player_player_name ON player(player_name);
CREATE INDEX IF NOT EXISTS idx_player_priority ON player(priority);

-- updated_at自動更新トリガー
CREATE TRIGGER IF NOT EXISTS trg_player_updated_at
AFTER UPDATE ON player
FOR EACH ROW
BEGIN
    UPDATE player SET updated_at = CURRENT_TIMESTAMP
    WHERE race_type = NEW.race_type AND player_no = NEW.player_no;
END;
