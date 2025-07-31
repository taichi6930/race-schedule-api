import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';

// DBファイルのパス
const dbPath = path.resolve(__dirname, '../volume/app.db');
// スキーマファイルのパス
const schemaPath = path.resolve(__dirname, './schema.sql');

// DBファイルがなければ自動作成
const db = new Database(dbPath);

// スキーマSQLを読み込んで実行
const schema = fs.readFileSync(schemaPath, 'utf-8');
db.exec(schema);

// PlayerListデータ投入
type Player = {
    race_type: string;
    player_no: string;
    player_name: string;
    priority: number;
};

const playerList: Player[] = [
    {
        race_type: 'KEIRIN',
        player_no: '014396',
        player_name: '脇本雄太',
        priority: 6,
    },
    {
        race_type: 'KEIRIN',
        player_no: '014838',
        player_name: '古性優作',
        priority: 6,
    },
    {
        race_type: 'KEIRIN',
        player_no: '014681',
        player_name: '松浦悠士',
        priority: 6,
    },
    {
        race_type: 'KEIRIN',
        player_no: '013162',
        player_name: '佐藤慎太郎',
        priority: 6,
    },
    {
        race_type: 'KEIRIN',
        player_no: '014534',
        player_name: '深谷知広',
        priority: 6,
    },
    {
        race_type: 'KEIRIN',
        player_no: '015242',
        player_name: '眞杉匠',
        priority: 5,
    },
    {
        race_type: 'KEIRIN',
        player_no: '015009',
        player_name: '清水裕友',
        priority: 6,
    },
    {
        race_type: 'KEIRIN',
        player_no: '014741',
        player_name: '郡司浩平',
        priority: 6,
    },
    {
        race_type: 'KEIRIN',
        player_no: '015413',
        player_name: '寺崎浩平',
        priority: 3,
    },
    {
        race_type: 'KEIRIN',
        player_no: '014054',
        player_name: '新田祐大',
        priority: 3,
    },
    {
        race_type: 'KEIRIN',
        player_no: '015034',
        player_name: '新山響平',
        priority: 5,
    },
    {
        race_type: 'KEIRIN',
        player_no: '015451',
        player_name: '山口拳矢',
        priority: 2,
    },
    {
        race_type: 'KEIRIN',
        player_no: '015527',
        player_name: '北井佑季',
        priority: 4,
    },
    {
        race_type: 'KEIRIN',
        player_no: '015597',
        player_name: '太田海也',
        priority: 4,
    },
    {
        race_type: 'KEIRIN',
        player_no: '015553',
        player_name: '犬伏湧也',
        priority: 4,
    },
    {
        race_type: 'KEIRIN',
        player_no: '015298',
        player_name: '嘉永泰斗',
        priority: 4,
    },
    {
        race_type: 'KEIRIN',
        player_no: '015400',
        player_name: '久米詩',
        priority: 4,
    },
    {
        race_type: 'KEIRIN',
        player_no: '015306',
        player_name: '佐藤水菜',
        priority: 4,
    },
    {
        race_type: 'KEIRIN',
        player_no: '015219',
        player_name: '梅川風子',
        priority: 3,
    },
    {
        race_type: 'KEIRIN',
        player_no: '015080',
        player_name: '児玉碧衣',
        priority: 4,
    },
    {
        race_type: 'KEIRIN',
        player_no: '015587',
        player_name: '吉川美穂',
        priority: 3,
    },
    {
        race_type: 'KEIRIN',
        player_no: '015218',
        player_name: '太田りゆ',
        priority: 3,
    },
    {
        race_type: 'KEIRIN',
        player_no: '015679',
        player_name: '又多風緑',
        priority: 3,
    },
    {
        race_type: 'KEIRIN',
        player_no: '015669',
        player_name: '河内桜雪',
        priority: 3,
    },
    {
        race_type: 'KEIRIN',
        player_no: '999999',
        player_name: 'test',
        priority: 3,
    },
    {
        race_type: 'BOATRACE',
        player_no: '4320',
        player_name: '峰竜太',
        priority: 6,
    },
    {
        race_type: 'BOATRACE',
        player_no: '999999',
        player_name: 'test',
        priority: 3,
    },
    {
        race_type: 'AUTORACE',
        player_no: '5954',
        player_name: '青山周平',
        priority: 6,
    },
    {
        race_type: 'AUTORACE',
        player_no: '999999',
        player_name: 'test',
        priority: 3,
    },
];

const insertStmt = db.prepare(
    `INSERT INTO users (race_type, player_no, player_name, priority) VALUES (@race_type, @player_no, @player_name, @priority)`,
);
for (const player of playerList) {
    insertStmt.run(player);
}

console.log('DB初期化・データ投入完了:', dbPath);
db.close();
