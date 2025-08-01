import { z } from 'zod';

import { RaceType } from '../../raceType';
import type { RaceCourse } from '../base';

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
}, '海外競馬場ではありません');

/**
 * WorldRaceCourseの型定義
 */
export type WorldRaceCourse = z.infer<typeof WorldRaceCourseSchema>;

/**
 * 海外競馬場 リスト
 */
const WorldRaceCourseList = new Set([
    'ロンシャン',
    'パリロンシャン',
    'シャンティイ',
    'サンクルー',
    'ドーヴィル',
    'アスコット',
    'ニューマーケット',
    'ニューベリー',
    'エプソム',
    'グッドウッド',
    'サンダウン',
    'ヨーク',
    'ヘイドック',
    'ドンカスター',
    'レパーズタウン',
    'カラ',
    'ガルフストリームパーク',
    'サンタアニタパーク',
    'チャーチルダウンズ',
    'ピムリコ',
    'サラトガ',
    'アケダクト',
    'モンマスパーク',
    'ベルモントパーク',
    'コロニアルダウンズ',
    'デルマー',
    'パークスレーシング',
    'キーンランド',
    'オークローンパーク',
    'ミュンヘン',
    'ホッペガルテン',
    'バーデンバーデン',
    'シャティン',
    'キングアブドゥルアジーズ',
    'メイダン',
    'ランドウィック',
    'コーフィールド',
    'フレミントン',
    'メルボルン',
    'ムーニーバレー',
    'ローズヒルガーデンズ',
]);

/**
 * 海外の競馬場のレース場名とコードの対応表
 */
export const WorldPlaceCodeMap: Record<string, string> = {
    ロンシャン: 'longchamp',
    パリロンシャン: 'longchamp',
    シャンティイ: 'chantilly',
    サンクルー: 'saintcloud',
    ドーヴィル: 'deauville',
    アスコット: 'ascot',
    ニューマーケット: 'newmarket',
    ニューベリー: 'newbury',
    エプソム: 'epsom',
    グッドウッド: 'goodwood',
    サンダウン: 'sandown',
    ヨーク: 'york',
    ヘイドック: 'haydock',
    ドンカスター: 'doncaster',
    レパーズタウン: 'leopardstown',
    カラ: 'curragh',
    ガルフストリームパーク: 'gulfstreampark',
    サンタアニタパーク: 'santaanitapark',
    チャーチルダウンズ: 'churchill-downs',
    ピムリコ: 'pimlico',
    サラトガ: 'saratoga',
    アケダクト: 'aqueduct',
    モンマスパーク: 'monmouthpark',
    ベルモントパーク: 'belmontpark',
    コロニアルダウンズ: 'colonial-downs',
    デルマー: 'delmar',
    パークスレーシング: 'parxracing',
    キーンランド: 'keeneland',
    オークローンパーク: 'oaklawnpark',
    ミュンヘン: 'munich',
    ホッペガルテン: 'hoppegarten',
    バーデンバーデン: 'badenbaden',
    シャティン: 'shatin',
    キングアブドゥルアジーズ: 'king-abdulaziz',
    メイダン: 'meydan',
    ランドウィック: 'randwick',
    コーフィールド: 'caulfield',
    フレミントン: 'flemington',
    メルボルン: 'melbourne',
    ムーニーバレー: 'mooneevalley',
    ローズヒルガーデンズ: 'rosehill-gardens',
};

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
 * オートレース場リスト
 */
const AutoraceRaceCourseList = new Set([
    '船橋',
    '川口',
    '伊勢崎',
    '浜松',
    '飯塚',
    '山陽',
]);

/**
 * オートレースのレース場名とコードの対応表
 */
export const AutoracePlaceCodeMap: Record<string, string> = {
    船橋: '01',
    川口: '02',
    伊勢崎: '03',
    浜松: '04',
    飯塚: '05',
    山陽: '06',
};

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
