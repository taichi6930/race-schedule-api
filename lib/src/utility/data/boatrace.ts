export const BOATRACE_PLACE_CODE: Record<string, string> = {
    桐生: '01',
    戸田: '02',
    江戸川: '03',
    平和島: '04',
    多摩川: '05',
    浜名湖: '06',
    蒲郡: '07',
    常滑: '08',
    津: '09',
    三国: '10',
    びわこ: '11',
    住之江: '12',
    尼崎: '13',
    鳴門: '14',
    丸亀: '15',
    児島: '16',
    宮島: '17',
    徳山: '18',
    下関: '19',
    若松: '20',
    芦屋: '21',
    福岡: '22',
    唐津: '23',
    大村: '24',
};

/**
 * ボートレース場
 */
export type BoatraceRaceCourse =
    | '桐生'
    | '戸田'
    | '江戸川'
    | '平和島'
    | '多摩川'
    | '浜名湖'
    | '蒲郡'
    | '常滑'
    | '津'
    | '三国'
    | 'びわこ'
    | '住之江'
    | '尼崎'
    | '鳴門'
    | '丸亀'
    | '児島'
    | '宮島'
    | '徳山'
    | '下関'
    | '若松'
    | '芦屋'
    | '福岡'
    | '唐津'
    | '大村';

/**
 * ボートレースのグレード
 */
export type BoatraceGradeType = 'SG' | 'GⅠ' | 'GⅡ' | 'GⅢ' | '一般';

/**
 * ボートレースのグレード
 */
export const BOATRACE_SPECIFIED_GRADE_LIST: BoatraceGradeType[] = [
    'SG',
    'GⅠ',
    'GⅡ',
    'GⅢ',
    '一般',
];

/**
 * ボートレースのレースステージ
 */
export type BoatraceRaceStage = '優勝戦' | '準優勝戦' | '一般戦' | '';

/**
 * HTMLのステージ名を正式名称に変換するためのマップ
 */
export const BOATRACE_STAGE_MAP: Record<string, BoatraceRaceStage> = {
    優勝戦: '優勝戦',
    準優勝戦: '準優勝戦',
};

/**
 * ボートレースの指定グレード・ステージリスト
 */
export const BOATRACE_SPECIFIED_GRADE_AND_STAGE_LIST: {
    grade: BoatraceGradeType;
    stage: BoatraceRaceStage;
    priority: number;
}[] = [{ grade: 'SG', stage: '優勝戦', priority: 10 }];

/**
 * ボートレースの選手リスト
 */
export const BoatracePlayerList = [
    {
        playerNumber: 4320,
        name: '峰竜太',
        priority: 6,
    },
];
