-- player テーブル: 選手マスタ情報
CREATE TABLE IF NOT EXISTS player (
    race_type TEXT NOT NULL,         -- レース種別（JRA, NAR, KEIRIN, AUTORACE, BOATRACE）
    player_no TEXT NOT NULL,         -- 選手番号
    player_name TEXT NOT NULL,       -- 選手名
    priority INTEGER NOT NULL,       -- 優先度
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (race_type, player_no)
);

-- インデックス
CREATE INDEX IF NOT EXISTS idx_player_race_type ON player(race_type);
CREATE INDEX IF NOT EXISTS idx_player_priority ON player(priority);

-- updated_at自動更新トリガー（レコード更新時に自動で更新日時を変更）
CREATE TRIGGER IF NOT EXISTS trg_player_updated_at
AFTER UPDATE ON player
FOR EACH ROW
BEGIN
    UPDATE player SET updated_at = CURRENT_TIMESTAMP
    WHERE race_type = NEW.race_type AND player_no = NEW.player_no;
END;
