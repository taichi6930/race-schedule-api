import { z } from 'zod';

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
 * 開催競輪場のバリデーション
 * @param course
 */
export const validateKeirinRaceCourse = (course: string): KeirinRaceCourse =>
    KeirinRaceCourseSchema.parse(course);
