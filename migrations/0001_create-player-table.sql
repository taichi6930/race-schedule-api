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

-- -- 初期データ挿入（必要に応じて編集・削除してください）
INSERT INTO player (race_type, player_no, player_name, priority) VALUES
-- ('KEIRIN', '014396', '脇本雄太', 6),
-- ('KEIRIN', '014838', '古性優作', 6),
-- ('KEIRIN', '014681', '松浦悠士', 6),
-- ('KEIRIN', '013162', '佐藤慎太郎', 6),
-- ('KEIRIN', '014534', '深谷知広', 6),
-- ('KEIRIN', '015242', '眞杉匠', 5),
-- ('KEIRIN', '015009', '清水裕友', 6),
-- ('KEIRIN', '014741', '郡司浩平', 6),
-- ('KEIRIN', '015413', '寺崎浩平', 3),
-- ('KEIRIN', '014054', '新田祐大', 3),
-- ('KEIRIN', '015034', '新山響平', 5),
-- ('KEIRIN', '015451', '山口拳矢', 2),
-- ('KEIRIN', '015527', '北井佑季', 4),
-- ('KEIRIN', '015597', '太田海也', 4),
-- ('KEIRIN', '015553', '犬伏湧也', 4),
-- ('KEIRIN', '015298', '嘉永泰斗', 4),
-- ('KEIRIN', '015400', '久米詩', 4),
-- ('KEIRIN', '015306', '佐藤水菜', 4),
-- ('KEIRIN', '015219', '梅川風子', 3),
-- ('KEIRIN', '015080', '児玉碧衣', 4),
-- ('KEIRIN', '015587', '吉川美穂', 3),
-- ('KEIRIN', '015218', '太田りゆ', 3),
-- ('KEIRIN', '015679', '又多風緑', 3),
-- ('KEIRIN', '015679', '又多風緑', 3);
-- ('KEIRIN', '015669', '河内桜雪', 3),
-- ('KEIRIN', '999999', 'test', 3),
-- ('BOATRACE', '4320', '峰竜太', 6),
-- ('BOATRACE', '999999', 'test', 3),
-- ('AUTORACE', '5954', '青山周平', 6),
-- ('AUTORACE', '999999', 'test', 3);

-- curl -X POST "http://localhost:8787/players" \
--   -H "Content-Type: application/json" \
--   -d '{
--     "race_type": "AUTORACE",
--     "player_no": "5954",
--     "player_name": "青山周平",
--     "priority": 6
--   }'