import { z } from 'zod';

import { RaceType } from '../../raceType';
import { AutoraceRaceCourseSchema } from '../autorace/autoraceRaceCourse';
import type { RaceCourse } from '../base';
import { BoatraceRaceCourseSchema } from '../boatrace/boatraceRaceCourse';
import { NarRaceCourseSchema } from '../nar/narRaceCourse';
import { WorldRaceCourseSchema } from '../world/worldRaceCourse';

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
