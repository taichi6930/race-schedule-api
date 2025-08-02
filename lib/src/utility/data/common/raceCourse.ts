import { z } from 'zod';

import { RaceType } from '../../raceType';

/**
 * RaceCourseのマスターデータ
 */
const RaceCourseMasterList: {
    raceType: RaceType;
    placeName: string;
    placeCode: string;
}[] = [
    // Autorace
    {
        raceType: RaceType.AUTORACE,
        placeName: '船橋',
        placeCode: '01',
    },
    {
        raceType: RaceType.AUTORACE,
        placeName: '川口',
        placeCode: '02',
    },
    {
        raceType: RaceType.AUTORACE,
        placeName: '伊勢崎',
        placeCode: '03',
    },
    {
        raceType: RaceType.AUTORACE,
        placeName: '浜松',
        placeCode: '04',
    },
    {
        raceType: RaceType.AUTORACE,
        placeName: '飯塚',
        placeCode: '05',
    },
    {
        raceType: RaceType.AUTORACE,
        placeName: '山陽',
        placeCode: '06',
    },
    {
        raceType: RaceType.WORLD,
        placeName: 'ロンシャン',
        placeCode: 'longchamp',
    },
    {
        raceType: RaceType.WORLD,
        placeName: 'パリロンシャン',
        placeCode: 'longchamp',
    },
    {
        raceType: RaceType.WORLD,
        placeName: 'シャンティイ',
        placeCode: 'chantilly',
    },
    {
        raceType: RaceType.WORLD,
        placeName: 'サンクルー',
        placeCode: 'saintcloud',
    },
    {
        raceType: RaceType.WORLD,
        placeName: 'ドーヴィル',
        placeCode: 'deauville',
    },
    {
        raceType: RaceType.WORLD,
        placeName: 'アスコット',
        placeCode: 'ascot',
    },
    {
        raceType: RaceType.WORLD,
        placeName: 'ニューマーケット',
        placeCode: 'newmarket',
    },
    {
        raceType: RaceType.WORLD,
        placeName: 'ニューベリー',
        placeCode: 'newbury',
    },
    {
        raceType: RaceType.WORLD,
        placeName: 'エプソム',
        placeCode: 'epsom',
    },
    {
        raceType: RaceType.WORLD,
        placeName: 'グッドウッド',
        placeCode: 'goodwood',
    },
    {
        raceType: RaceType.WORLD,
        placeName: 'サンダウン',
        placeCode: 'sandown',
    },
    {
        raceType: RaceType.WORLD,
        placeName: 'ヨーク',
        placeCode: 'york',
    },
    {
        raceType: RaceType.WORLD,
        placeName: 'ヘイドック',
        placeCode: 'haydock',
    },
    {
        raceType: RaceType.WORLD,
        placeName: 'ドンカスター',
        placeCode: 'doncaster',
    },
    {
        raceType: RaceType.WORLD,
        placeName: 'レパーズタウン',
        placeCode: 'leopardstown',
    },
    {
        raceType: RaceType.WORLD,
        placeName: 'カラ',
        placeCode: 'curragh',
    },
    {
        raceType: RaceType.WORLD,
        placeName: 'ガルフストリームパーク',
        placeCode: 'gulfstreampark',
    },
    {
        raceType: RaceType.WORLD,
        placeName: 'サンタアニタパーク',
        placeCode: 'santaanitapark',
    },
    {
        raceType: RaceType.WORLD,
        placeName: 'チャーチルダウンズ',
        placeCode: 'churchill-downs',
    },
    {
        raceType: RaceType.WORLD,
        placeName: 'ピムリコ',
        placeCode: 'pimlico',
    },
    {
        raceType: RaceType.WORLD,
        placeName: 'サラトガ',
        placeCode: 'saratoga',
    },
    {
        raceType: RaceType.WORLD,
        placeName: 'アケダクト',
        placeCode: 'aqueduct',
    },
    {
        raceType: RaceType.WORLD,
        placeName: 'モンマスパーク',
        placeCode: 'monmouthpark',
    },
    {
        raceType: RaceType.WORLD,
        placeName: 'ベルモントパーク',
        placeCode: 'belmontpark',
    },
    {
        raceType: RaceType.WORLD,
        placeName: 'コロニアルダウンズ',
        placeCode: 'colonial-downs',
    },
    {
        raceType: RaceType.WORLD,
        placeName: 'デルマー',
        placeCode: 'delmar',
    },
    {
        raceType: RaceType.WORLD,
        placeName: 'パークスレーシング',
        placeCode: 'parxracing',
    },
    {
        raceType: RaceType.WORLD,
        placeName: 'キーンランド',
        placeCode: 'keeneland',
    },
    {
        raceType: RaceType.WORLD,
        placeName: 'オークローンパーク',
        placeCode: 'oaklawnpark',
    },
    {
        raceType: RaceType.WORLD,
        placeName: 'ミュンヘン',
        placeCode: 'munich',
    },
    {
        raceType: RaceType.WORLD,
        placeName: 'ホッペガルテン',
        placeCode: 'hoppegarten',
    },
    {
        raceType: RaceType.WORLD,
        placeName: 'バーデンバーデン',
        placeCode: 'badenbaden',
    },
    {
        raceType: RaceType.WORLD,
        placeName: 'シャティン',
        placeCode: 'shatin',
    },
    {
        raceType: RaceType.WORLD,
        placeName: 'キングアブドゥルアジーズ',
        placeCode: 'king-abdulaziz',
    },
    {
        raceType: RaceType.WORLD,
        placeName: 'メイダン',
        placeCode: 'meydan',
    },
    {
        raceType: RaceType.WORLD,
        placeName: 'ランドウィック',
        placeCode: 'randwick',
    },
    {
        raceType: RaceType.WORLD,
        placeName: 'コーフィールド',
        placeCode: 'caulfield',
    },
    {
        raceType: RaceType.WORLD,
        placeName: 'フレミントン',
        placeCode: 'flemington',
    },
    {
        raceType: RaceType.WORLD,
        placeName: 'メルボルン',
        placeCode: 'melbourne',
    },
    {
        raceType: RaceType.WORLD,
        placeName: 'ムーニーバレー',
        placeCode: 'mooneevalley',
    },
    {
        raceType: RaceType.WORLD,
        placeName: 'ローズヒルガーデンズ',
        placeCode: 'rosehill-gardens',
    },
];

/**
 * 場リスト
 * @param raceType
 */
const RaceCourseList = (raceType: RaceType): Set<string> =>
    new Set(
        RaceCourseMasterList.filter(
            (course) => course.raceType === raceType,
        ).map((course) => course.placeName),
    );

/**
 * RaceCourseMasterListからraceTypeごとのPlaceCodeMapを生成するユーティリティ
 * @param raceType - 生成対象のレース種別
 * @returns placeName をキー、placeCode を値とするマップ
 */
export function createPlaceCodeMap(raceType: RaceType): Record<string, string> {
    const map: Record<string, string> = {};
    for (const course of RaceCourseMasterList) {
        if (course.raceType === raceType) {
            map[course.placeName] = course.placeCode;
        }
    }
    return map;
}

/**
 * オートレース場リスト
 */
const AutoraceRaceCourseList = RaceCourseList(RaceType.AUTORACE);

/**
 * オートレースのレース場名とコードの対応表（RaceCourseMasterListから自動生成）
 */
export const AutoracePlaceCodeMap: Record<string, string> = createPlaceCodeMap(
    RaceType.AUTORACE,
);

/**
 * JraRaceCourseのzod型定義
 */
export const JraRaceCourseSchema = z.string().refine((value) => {
    return JraRaceCourseList.has(value);
}, '中央の競馬場ではありません');

/**
 * JraRaceCourseの型定義
 */
export type JraRaceCourse = z.infer<typeof JraRaceCourseSchema>;

/**
 * JRAの競馬場 リスト
 */
const JraRaceCourseList = new Set([
    '札幌',
    '函館',
    '福島',
    '新潟',
    '東京',
    '中山',
    '中京',
    '京都',
    '阪神',
    '小倉',
]);

/**
 * 開催場のバリデーション
 * @param raceType
 * @param course
 */
export const validateRaceCourse = (
    raceType: RaceType,
    course: string,
): RaceCourse => {
    switch (raceType) {
        case RaceType.JRA: {
            return JraRaceCourseSchema.parse(course);
        }
        case RaceType.NAR: {
            return NarRaceCourseSchema.parse(course);
        }
        case RaceType.WORLD: {
            return WorldRaceCourseSchema.parse(course);
        }
        case RaceType.KEIRIN: {
            return KeirinRaceCourseSchema.parse(course);
        }
        case RaceType.AUTORACE: {
            return AutoraceRaceCourseSchema.parse(course);
        }
        case RaceType.BOATRACE: {
            return BoatraceRaceCourseSchema.parse(course);
        }
        default: {
            throw new Error('未対応のraceTypeです');
        }
    }
};

/**
 * 競輪のレース場名とコードの対応表
 */
export const KeirinPlaceCodeMap: Record<string, string> = {
    函館: '11',
    青森: '12',
    いわき平: '13',
    弥彦: '21',
    前橋: '22',
    取手: '23',
    宇都宮: '24',
    大宮: '25',
    西武園: '26',
    京王閣: '27',
    立川: '28',
    松戸: '31',
    千葉: '32',
    川崎: '34',
    平塚: '35',
    小田原: '36',
    伊東: '37',
    静岡: '38',
    名古屋: '42',
    岐阜: '43',
    大垣: '44',
    豊橋: '45',
    富山: '46',
    松阪: '47',
    四日市: '48',
    福井: '51',
    奈良: '53',
    向日町: '54',
    和歌山: '55',
    岸和田: '56',
    玉野: '61',
    広島: '62',
    防府: '63',
    高松: '71',
    小松島: '73',
    高知: '74',
    松山: '75',
    小倉: '81',
    久留米: '83',
    武雄: '84',
    佐世保: '85',
    別府: '86',
    熊本: '87',
};

/**
 * KeirinRaceCourseのzod型定義
 */
export const KeirinRaceCourseSchema = z.string().refine((value) => {
    return KeirinRaceCourseList.has(value);
}, '競輪場ではありません');

/**
 * KeirinRaceCourseの型定義
 */
export type KeirinRaceCourse = z.infer<typeof KeirinRaceCourseSchema>;

const KeirinRaceCourseList = new Set([
    '函館',
    '青森',
    'いわき平',
    '弥彦',
    '前橋',
    '取手',
    '宇都宮',
    '大宮',
    '西武園',
    '京王閣',
    '立川',
    '松戸',
    '千葉',
    '川崎',
    '平塚',
    '小田原',
    '伊東',
    '静岡',
    '名古屋',
    '岐阜',
    '大垣',
    '豊橋',
    '富山',
    '松阪',
    '四日市',
    '福井',
    '奈良',
    '向日町',
    '和歌山',
    '岸和田',
    '玉野',
    '広島',
    '防府',
    '高松',
    '小松島',
    '高知',
    '松山',
    '小倉',
    '久留米',
    '武雄',
    '佐世保',
    '別府',
    '熊本',
]);

/**
 * NarRaceCourseのzod型定義
 */
export const NarRaceCourseSchema = z.string().refine((value) => {
    return NarRaceCourseList.has(value);
}, '地方の競馬場ではありません');

/**
 * NarRaceCourseの型定義
 */
export type NarRaceCourse = z.infer<typeof NarRaceCourseSchema>;

/**
 * 地方の競馬場 リスト
 */
const NarRaceCourseList = new Set([
    '北見ば',
    '岩見ば',
    '帯広ば',
    '旭川ば',
    '旭川',
    '門別',
    '札幌',
    '盛岡',
    '水沢',
    '上山',
    '新潟',
    '三条',
    '足利',
    '宇都宮',
    '高崎',
    '浦和',
    '船橋',
    '大井',
    '川崎',
    '金沢',
    '笠松',
    '名古屋',
    '中京',
    '園田',
    '姫路',
    '益田',
    '福山',
    '高知',
    '佐賀',
    '荒尾',
    '中津',
]);

/**
 * 地方競馬のレース場名とコードの対応表
 */
export const NarBabacodeMap: Record<string, string> = {
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
 * WorldRaceCourseのzod型定義
 */
export const WorldRaceCourseSchema = z.string().refine((value) => {
    return WorldRaceCourseList.has(value);
}, '海外の競馬場ではありません');

/**
 * WorldRaceCourseの型定義
 */
export type WorldRaceCourse = z.infer<typeof WorldRaceCourseSchema>;

/**
 * 海外競馬場 リスト
 */
const WorldRaceCourseList = RaceCourseList(RaceType.WORLD);

/**
 * 海外の競馬場のレース場名とコードの対応表
 */
export const WorldPlaceCodeMap: Record<string, string> = createPlaceCodeMap(
    RaceType.WORLD,
);

/**
 * AutoraceRaceCourseのzod型定義
 */
export const AutoraceRaceCourseSchema = z.string().refine((value) => {
    return AutoraceRaceCourseList.has(value);
}, 'オートレース場ではありません');

/**
 * AutoraceRaceCourseの型定義
 */
export type AutoraceRaceCourse = z.infer<typeof AutoraceRaceCourseSchema>;

/**
 * BoatraceRaceCourseのzod型定義
 */
export const BoatraceRaceCourseSchema = z.string().refine((value) => {
    return BoatraceRaceCourseList.has(value);
}, 'ボートレース場ではありません');

/**
 * BoatraceRaceCourseの型定義
 */
export type BoatraceRaceCourse = z.infer<typeof BoatraceRaceCourseSchema>;

/**
 * ボートレース場リスト
 */
const BoatraceRaceCourseList = new Set([
    '桐生',
    '戸田',
    '江戸川',
    '平和島',
    '多摩川',
    '浜名湖',
    '蒲郡',
    '常滑',
    '津',
    '三国',
    'びわこ',
    '住之江',
    '尼崎',
    '鳴門',
    '丸亀',
    '児島',
    '宮島',
    '徳山',
    '下関',
    '若松',
    '芦屋',
    '福岡',
    '唐津',
    '大村',
]);

/**
 * ボートレースのレース場名とコードの対応表
 */
export const BoatracePlaceCodeMap: Record<string, string> = {
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
 * RaceCourseのzod型定義
 */
export const RaceCourseSchema = z.union([
    JraRaceCourseSchema,
    NarRaceCourseSchema,
    WorldRaceCourseSchema,
    KeirinRaceCourseSchema,
    AutoraceRaceCourseSchema,
    BoatraceRaceCourseSchema,
]);

/**
 * RaceCourseの型定義
 */
export type RaceCourse = z.infer<typeof RaceCourseSchema>;
