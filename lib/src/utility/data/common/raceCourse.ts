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
    { raceType: RaceType.AUTORACE, placeName: '船橋', placeCode: '01' },
    { raceType: RaceType.AUTORACE, placeName: '川口', placeCode: '02' },
    { raceType: RaceType.AUTORACE, placeName: '伊勢崎', placeCode: '03' },
    { raceType: RaceType.AUTORACE, placeName: '浜松', placeCode: '04' },
    { raceType: RaceType.AUTORACE, placeName: '飯塚', placeCode: '05' },
    { raceType: RaceType.AUTORACE, placeName: '山陽', placeCode: '06' },
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
    { raceType: RaceType.KEIRIN, placeName: '函館', placeCode: '11' },
    { raceType: RaceType.KEIRIN, placeName: '青森', placeCode: '12' },
    { raceType: RaceType.KEIRIN, placeName: 'いわき平', placeCode: '13' },
    { raceType: RaceType.KEIRIN, placeName: '弥彦', placeCode: '21' },
    { raceType: RaceType.KEIRIN, placeName: '前橋', placeCode: '22' },
    { raceType: RaceType.KEIRIN, placeName: '取手', placeCode: '23' },
    { raceType: RaceType.KEIRIN, placeName: '宇都宮', placeCode: '24' },
    { raceType: RaceType.KEIRIN, placeName: '大宮', placeCode: '25' },
    { raceType: RaceType.KEIRIN, placeName: '西武園', placeCode: '26' },
    { raceType: RaceType.KEIRIN, placeName: '京王閣', placeCode: '27' },
    { raceType: RaceType.KEIRIN, placeName: '立川', placeCode: '28' },
    { raceType: RaceType.KEIRIN, placeName: '松戸', placeCode: '31' },
    { raceType: RaceType.KEIRIN, placeName: '千葉', placeCode: '32' },
    { raceType: RaceType.KEIRIN, placeName: '川崎', placeCode: '34' },
    { raceType: RaceType.KEIRIN, placeName: '平塚', placeCode: '35' },
    { raceType: RaceType.KEIRIN, placeName: '小田原', placeCode: '36' },
    { raceType: RaceType.KEIRIN, placeName: '伊東', placeCode: '37' },
    { raceType: RaceType.KEIRIN, placeName: '静岡', placeCode: '38' },
    { raceType: RaceType.KEIRIN, placeName: '名古屋', placeCode: '42' },
    { raceType: RaceType.KEIRIN, placeName: '岐阜', placeCode: '43' },
    { raceType: RaceType.KEIRIN, placeName: '大垣', placeCode: '44' },
    { raceType: RaceType.KEIRIN, placeName: '豊橋', placeCode: '45' },
    { raceType: RaceType.KEIRIN, placeName: '富山', placeCode: '46' },
    { raceType: RaceType.KEIRIN, placeName: '松阪', placeCode: '47' },
    { raceType: RaceType.KEIRIN, placeName: '四日市', placeCode: '48' },
    { raceType: RaceType.KEIRIN, placeName: '福井', placeCode: '51' },
    { raceType: RaceType.KEIRIN, placeName: '奈良', placeCode: '53' },
    { raceType: RaceType.KEIRIN, placeName: '向日町', placeCode: '54' },
    { raceType: RaceType.KEIRIN, placeName: '和歌山', placeCode: '55' },
    { raceType: RaceType.KEIRIN, placeName: '岸和田', placeCode: '56' },
    { raceType: RaceType.KEIRIN, placeName: '玉野', placeCode: '61' },
    { raceType: RaceType.KEIRIN, placeName: '広島', placeCode: '62' },
    { raceType: RaceType.KEIRIN, placeName: '防府', placeCode: '63' },
    { raceType: RaceType.KEIRIN, placeName: '高松', placeCode: '71' },
    { raceType: RaceType.KEIRIN, placeName: '小松島', placeCode: '73' },
    { raceType: RaceType.KEIRIN, placeName: '高知', placeCode: '74' },
    { raceType: RaceType.KEIRIN, placeName: '松山', placeCode: '75' },
    { raceType: RaceType.KEIRIN, placeName: '小倉', placeCode: '81' },
    { raceType: RaceType.KEIRIN, placeName: '久留米', placeCode: '83' },
    { raceType: RaceType.KEIRIN, placeName: '武雄', placeCode: '84' },
    { raceType: RaceType.KEIRIN, placeName: '佐世保', placeCode: '85' },
    { raceType: RaceType.KEIRIN, placeName: '別府', placeCode: '86' },
    { raceType: RaceType.KEIRIN, placeName: '熊本', placeCode: '87' },
    { raceType: RaceType.NAR, placeName: '北見ば', placeCode: '1' },
    { raceType: RaceType.NAR, placeName: '岩見ば', placeCode: '2' },
    { raceType: RaceType.NAR, placeName: '帯広ば', placeCode: '3' },
    { raceType: RaceType.NAR, placeName: '旭川ば', placeCode: '4' },
    { raceType: RaceType.NAR, placeName: '旭川', placeCode: '7' },
    { raceType: RaceType.NAR, placeName: '門別', placeCode: '36' },
    { raceType: RaceType.NAR, placeName: '札幌', placeCode: '8' },
    { raceType: RaceType.NAR, placeName: '盛岡', placeCode: '10' },
    { raceType: RaceType.NAR, placeName: '水沢', placeCode: '11' },
    { raceType: RaceType.NAR, placeName: '上山', placeCode: '12' },
    { raceType: RaceType.NAR, placeName: '新潟', placeCode: '13' },
    { raceType: RaceType.NAR, placeName: '三条', placeCode: '14' },
    { raceType: RaceType.NAR, placeName: '足利', placeCode: '15' },
    { raceType: RaceType.NAR, placeName: '宇都宮', placeCode: '16' },
    { raceType: RaceType.NAR, placeName: '高崎', placeCode: '17' },
    { raceType: RaceType.NAR, placeName: '浦和', placeCode: '18' },
    { raceType: RaceType.NAR, placeName: '船橋', placeCode: '19' },
    { raceType: RaceType.NAR, placeName: '大井', placeCode: '20' },
    { raceType: RaceType.NAR, placeName: '川崎', placeCode: '21' },
    { raceType: RaceType.NAR, placeName: '金沢', placeCode: '22' },
    { raceType: RaceType.NAR, placeName: '笠松', placeCode: '23' },
    { raceType: RaceType.NAR, placeName: '名古屋', placeCode: '24' },
    { raceType: RaceType.NAR, placeName: '中京', placeCode: '25' },
    { raceType: RaceType.NAR, placeName: '園田', placeCode: '27' },
    { raceType: RaceType.NAR, placeName: '姫路', placeCode: '28' },
    { raceType: RaceType.NAR, placeName: '益田', placeCode: '29' },
    { raceType: RaceType.NAR, placeName: '福山', placeCode: '30' },
    { raceType: RaceType.NAR, placeName: '高知', placeCode: '31' },
    { raceType: RaceType.NAR, placeName: '佐賀', placeCode: '32' },
    { raceType: RaceType.NAR, placeName: '荒尾', placeCode: '33' },
    { raceType: RaceType.NAR, placeName: '中津', placeCode: '34' },
    // 競艇
    { raceType: RaceType.BOATRACE, placeName: '桐生', placeCode: '01' },
    { raceType: RaceType.BOATRACE, placeName: '戸田', placeCode: '02' },
    { raceType: RaceType.BOATRACE, placeName: '江戸川', placeCode: '03' },
    { raceType: RaceType.BOATRACE, placeName: '平和島', placeCode: '04' },
    { raceType: RaceType.BOATRACE, placeName: '多摩川', placeCode: '05' },
    { raceType: RaceType.BOATRACE, placeName: '浜名湖', placeCode: '06' },
    { raceType: RaceType.BOATRACE, placeName: '蒲郡', placeCode: '07' },
    { raceType: RaceType.BOATRACE, placeName: '常滑', placeCode: '08' },
    { raceType: RaceType.BOATRACE, placeName: '津', placeCode: '09' },
    { raceType: RaceType.BOATRACE, placeName: '三国', placeCode: '10' },
    { raceType: RaceType.BOATRACE, placeName: 'びわこ', placeCode: '11' },
    { raceType: RaceType.BOATRACE, placeName: '住之江', placeCode: '12' },
    { raceType: RaceType.BOATRACE, placeName: '尼崎', placeCode: '13' },
    { raceType: RaceType.BOATRACE, placeName: '鳴門', placeCode: '14' },
    { raceType: RaceType.BOATRACE, placeName: '丸亀', placeCode: '15' },
    { raceType: RaceType.BOATRACE, placeName: '児島', placeCode: '16' },
    { raceType: RaceType.BOATRACE, placeName: '宮島', placeCode: '17' },
    { raceType: RaceType.BOATRACE, placeName: '徳山', placeCode: '18' },
    { raceType: RaceType.BOATRACE, placeName: '下関', placeCode: '19' },
    { raceType: RaceType.BOATRACE, placeName: '若松', placeCode: '20' },
    { raceType: RaceType.BOATRACE, placeName: '芦屋', placeCode: '21' },
    { raceType: RaceType.BOATRACE, placeName: '福岡', placeCode: '22' },
    { raceType: RaceType.BOATRACE, placeName: '唐津', placeCode: '23' },
    { raceType: RaceType.BOATRACE, placeName: '大村', placeCode: '24' },
    { raceType: RaceType.JRA, placeName: '札幌', placeCode: '' },
    { raceType: RaceType.JRA, placeName: '函館', placeCode: '' },
    { raceType: RaceType.JRA, placeName: '福島', placeCode: '' },
    { raceType: RaceType.JRA, placeName: '新潟', placeCode: '' },
    { raceType: RaceType.JRA, placeName: '東京', placeCode: '' },
    { raceType: RaceType.JRA, placeName: '中山', placeCode: '' },
    { raceType: RaceType.JRA, placeName: '中京', placeCode: '' },
    { raceType: RaceType.JRA, placeName: '京都', placeCode: '' },
    { raceType: RaceType.JRA, placeName: '阪神', placeCode: '' },
    { raceType: RaceType.JRA, placeName: '小倉', placeCode: '' },
];

/**
 * 場リスト
 * @param raceType - レース種別
 */
const RaceCourseList = (raceType: RaceType): Set<string> =>
    new Set(
        RaceCourseMasterList.filter(
            (course) => course.raceType === raceType,
        ).map((course) => course.placeName),
    );

/**
 * RaceCourseMasterListからraceTypeごとのPlaceCodeMapを生成するユーティリティ
 * @param raceType - レース種別
 * @returns placeName をキー、placeCode を値とするマップ
 */
export const createPlaceCodeMap = (
    raceType: RaceType,
): Record<string, string> => {
    if (raceType === RaceType.JRA) {
        throw new Error(
            'JRAのレース場コード作成されていないため、使用できません',
        );
    }
    const map: Record<string, string> = {};
    for (const course of RaceCourseMasterList) {
        if (course.raceType === raceType) {
            map[course.placeName] = course.placeCode;
        }
    }
    return map;
};

/**
 * JraRaceCourseのzod型定義
 * @param raceType - レース種別
 */
const createRaceCourseSchema = (raceType: RaceType): z.ZodString =>
    z.string().refine((value) => {
        return RaceCourseList(raceType).has(value);
    }, `${raceType}の開催場ではありません`);

/**
 * 開催場のバリデーション
 * @param raceType - レース種別
 * @param location - 開催場所
 */
export const validateRaceCourse = (
    raceType: RaceType,
    location: string,
): RaceCourse => createRaceCourseSchema(raceType).parse(location);

/**
 * オートレースのレース場名とコードの対応表（RaceCourseMasterListから自動生成）
 */
export const AutoracePlaceCodeMap: Record<string, string> = createPlaceCodeMap(
    RaceType.AUTORACE,
);

/**
 * 競輪のレース場名とコードの対応表
 */
export const KeirinPlaceCodeMap: Record<string, string> = createPlaceCodeMap(
    RaceType.KEIRIN,
);

/**
 * 地方競馬のレース場名とコードの対応表
 */
export const NarBabacodeMap: Record<string, string> = createPlaceCodeMap(
    RaceType.NAR,
);

/**
 * ボートレースのレース場名とコードの対応表
 */
export const BoatracePlaceCodeMap: Record<string, string> = createPlaceCodeMap(
    RaceType.BOATRACE,
);

/**
 * RaceCourseのzod型定義
 */
export const UnionRaceCourseSchema = z.union([
    createRaceCourseSchema(RaceType.JRA),
    createRaceCourseSchema(RaceType.NAR),
    createRaceCourseSchema(RaceType.WORLD),
    createRaceCourseSchema(RaceType.KEIRIN),
    createRaceCourseSchema(RaceType.AUTORACE),
    createRaceCourseSchema(RaceType.BOATRACE),
]);

/**
 * RaceCourseの型定義
 */
export type RaceCourse = z.infer<typeof UnionRaceCourseSchema>;
