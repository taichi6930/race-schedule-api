/**
 * JRAの競馬場
 */
export type JraRaceCourse =
    | '札幌'
    | '函館'
    | '福島'
    | '新潟'
    | '東京'
    | '中山'
    | '中京'
    | '京都'
    | '阪神'
    | '小倉';

/**
 * JRAの馬場種別
 */
export type JraRaceCourseType = '芝' | 'ダート' | '障害';

/**
 * NARの競馬場
 */
export type NarRaceCourse =
    | '北見ば'
    | '岩見ば'
    | '帯広ば'
    | '旭川ば'
    | '旭川'
    | '門別'
    | '札幌'
    | '盛岡'
    | '水沢'
    | '上山'
    | '新潟'
    | '三条'
    | '足利'
    | '宇都宮'
    | '高崎'
    | '浦和'
    | '船橋'
    | '大井'
    | '川崎'
    | '金沢'
    | '笠松'
    | '名古屋'
    | '中京'
    | '園田'
    | '姫路'
    | '益田'
    | '福山'
    | '高知'
    | '佐賀'
    | '荒尾'
    | '中津';

/**
 * NARの馬場種別
 */
export type NarRaceCourseType = '芝' | 'ダート';

/**
 * JRAのグレード
 */
export type JraGradeType =
    | 'GⅠ'
    | 'GⅡ'
    | 'GⅢ'
    | 'J.GⅠ'
    | 'J.GⅡ'
    | 'J.GⅢ'
    | 'JpnⅠ'
    | 'JpnⅡ'
    | 'JpnⅢ'
    | '重賞'
    | 'Listed'
    | 'オープン特別'
    | '格付けなし'
    | 'オープン'
    | '3勝クラス'
    | '2勝クラス'
    | '1勝クラス'
    | '1600万下'
    | '1000万下'
    | '900万下'
    | '500万下'
    | '未勝利'
    | '未出走'
    | '新馬';

/**
 * JRAの指定グレードリスト
 */
export const JRA_SPECIFIED_GRADE_LIST: JraGradeType[] = [
    'GⅠ',
    'GⅡ',
    'GⅢ',
    'J.GⅠ',
    'J.GⅡ',
    'J.GⅢ',
    'JpnⅠ',
    'JpnⅡ',
    'JpnⅢ',
    '重賞',
    'Listed',
    'オープン特別',
];

/**
 * NARのグレード
 */
export type NarGradeType =
    | 'GⅠ'
    | 'GⅡ'
    | 'GⅢ'
    | 'JpnⅠ'
    | 'JpnⅡ'
    | 'JpnⅢ'
    | '重賞'
    | '地方重賞'
    | 'Listed'
    | 'オープン特別'
    | '地方準重賞'
    | '格付けなし'
    | 'オープン'
    | '未格付'
    | '一般';

/**
 * NARの指定グレードリスト
 */
export const NAR_SPECIFIED_GRADE_LIST: NarGradeType[] = [
    'GⅠ',
    'GⅡ',
    'GⅢ',
    'JpnⅠ',
    'JpnⅡ',
    'JpnⅢ',
    '重賞',
    'Listed',
    'オープン特別',
    '地方重賞',
    '地方準重賞',
];

/**
 * 世界の競馬のグレード
 */
export type WorldGradeType = 'GⅠ' | 'GⅡ' | 'GⅢ' | 'Listed' | '格付けなし';

/**
 * 世界の競馬場
 */
export type WorldRaceCourse =
    // フランス
    | 'ロンシャン'
    | 'パリロンシャン'
    | 'シャンティイ'
    | 'サンクルー'
    | 'ドーヴィル'
    // イギリス
    | 'アスコット'
    | 'ニューマーケット'
    | 'ニューベリー'
    | 'エプソム'
    | 'グッドウッド'
    | 'サンダウン'
    | 'ヨーク'
    | 'ヘイドック'
    | 'ドンカスター'
    // アイルランド
    | 'レパーズタウン'
    | 'カラ'
    // アメリカ
    | 'ガルフストリームパーク'
    | 'サンタアニタパーク'
    | 'チャーチルダウンズ'
    | 'ピムリコ'
    | 'サラトガ'
    | 'アケダクト'
    | 'モンマスパーク'
    | 'ベルモントパーク'
    | 'コロニアルダウンズ'
    | 'デルマー'
    | 'パークスレーシング'
    | 'キーンランド'
    | 'オークローンパーク'
    // ドイツ
    | 'ミュンヘン'
    | 'ホッペガルテン'
    | 'バーデンバーデン'
    // 香港
    | 'シャティン'
    // サウジアラビア
    | 'キングアブドゥルアジーズ'
    // ドバイ
    | 'メイダン'
    // オーストラリア
    | 'ランドウィック'
    | 'コーフィールド'
    | 'フレミントン'
    | 'メルボルン'
    | 'ムーニーバレー'
    | 'ローズヒルガーデンズ';

/**
 * 世界の競馬の馬場種別
 */
export type WorldRaceCourseType = '芝' | 'ダート' | '障害' | 'AW';

/**
 * 世界の競馬の指定グレードリスト
 */
export const WORLD_SPECIFIED_GRADE_LIST: WorldGradeType[] = [
    'GⅠ',
    'GⅡ',
    'GⅢ',
    'Listed',
    '格付けなし',
];

/**
 * オートレースのグレードリスト
 */
export type AutoraceGradeType = 'SG' | '特GⅠ' | 'GⅠ' | 'GⅡ' | '開催';
/**
 * オートレースの指定グレードリスト
 */
export const AUTORACE_SPECIFIED_GRADE_LIST: AutoraceGradeType[] = ['SG'];

/**
 * オートレースのステージ
 */
export type AutoraceRaceStage =
    | '優勝戦'
    | '準決勝戦'
    | '特別選抜戦'
    | '特別一般戦'
    | '一般戦'
    | '予選'
    | '選抜予選'
    | '最終予選'
    | 'オーバル特別'
    | '選抜戦';

/**
 * オートレースの指定グレード・ステージリスト
 */
export const AUTORACE_SPECIFIED_GRADE_AND_STAGE_LIST: {
    grade: AutoraceGradeType;
    stage: AutoraceRaceStage;
    priority: number;
}[] = [{ grade: 'SG', stage: '優勝戦', priority: 9 }];

/**
 * オートレース場
 */
export type AutoraceRaceCourse =
    | '船橋'
    | '川口'
    | '伊勢崎'
    | '浜松'
    | '飯塚'
    | '山陽';
