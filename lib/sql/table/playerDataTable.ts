/**
 * 選手データテーブルのスキーマ定義
 * id: 選手の一意な識別子
 *     競輪選手は `keirin014396` のような形式
 *     競艇選手は `boatrace014396` のような形式
 *     オートレース選手は `autorace014396` のような形式
 * name: 選手の名前
 * playerNumber: 選手番号
 * raceType: レースの種類（競輪、競艇、オートレース)
 *           競輪は `KEIRIN`
 *           競艇は `BOATRACE`
 *           オートレースは `AUTORACE`
 * priority: 選手の優先度（数値が大きいほど優先度が高い）
 * created_at: レコードの作成日時
 * updated_at: レコードの更新日時 triggerを使用して自動的に更新
 */
export const PLAYER_DATA_SCHEMA_QUERIES: string[] = [
    `CREATE TABLE IF NOT EXISTS player_data (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        playerNumber TEXT NOT NULL,
        raceType TEXT NOT NULL,
        priority INTEGER NOT NULL,
        created_at TEXT NOT NULL DEFAULT (DATETIME('now', 'localtime')),
        updated_at TEXT NOT NULL DEFAULT (DATETIME('now', 'localtime'))
    )`,
];

/**
 * 選手データテーブルのインデックス定義
 * id: 選手の一意な識別子
 * name: 選手の名前
 * playerNumber: 選手番号
 * raceType: レースの種類（競輪、競艇、オートレース)
 *           競輪は `KEIRIN`
 *           競艇は `BOATRACE`
 *           オートレースは `AUTORACE`
 */
export const PLAYER_DATA_INDEX_QUERIES: string[] = [
    `CREATE UNIQUE INDEX IF NOT EXISTS idx_player_data_id ON player_data (id)`,
    `CREATE INDEX IF NOT EXISTS idx_player_data_player_number ON player_data (playerNumber)`,
    `CREATE INDEX IF NOT EXISTS idx_player_data_race_type ON player_data (raceType)`,
    `CREATE INDEX IF NOT EXISTS idx_player_data_priority ON player_data (priority)`,
];

/**
 * 選手データテーブルのトリガー定義
 * レコードの更新時に updated_at を自動的に更新するトリガー
 */
export const PLAYER_DATA_TRIGGER_QUERIES: string[] = [
    `CREATE TRIGGER IF NOT EXISTS trg_player_data_update
    AFTER UPDATE ON player_data
    FOR EACH ROW
    BEGIN
        UPDATE player_data SET updated_at = DATETIME('now', 'localtime') WHERE id = OLD.id;
    END;`,
];

/**
 * 選手データテーブルのスキーマ定義、インデックス定義、トリガー定義をまとめた配列
 */
export const PLAYER_DATA_TABLE_QUERIES = [
    ...PLAYER_DATA_SCHEMA_QUERIES,
    ...PLAYER_DATA_INDEX_QUERIES,
    ...PLAYER_DATA_TRIGGER_QUERIES,
];
