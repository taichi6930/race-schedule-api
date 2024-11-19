/**
 * NARのレース場名とコードの対応表
 */
export const NAR_BABACODE: Record<string, string> = {
    北見ば: '1',
    岩見ば: '2',
    帯広ば: '3',
    旭川ば: '4',
    旭川: '7',
    門別: '36',
    札幌: '8',
    盛岡: '10',
    水沢: '11',
    上山: '12',
    新潟: '13',
    三条: '14',
    足利: '15',
    宇都宮: '16',
    高崎: '17',
    浦和: '18',
    船橋: '19',
    大井: '20',
    川崎: '21',
    金沢: '22',
    笠松: '23',
    名古屋: '24',
    中京: '25',
    園田: '27',
    姫路: '28',
    益田: '29',
    福山: '30',
    高知: '31',
    佐賀: '32',
    荒尾: '33',
    中津: '34',
};

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
