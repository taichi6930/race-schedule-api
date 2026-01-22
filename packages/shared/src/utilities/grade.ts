import { RaceType } from '../types/raceType';

/**
 * グレードのマスターリスト
 */
export const GradeMasterList: {
    gradeName: string;
    detail: { raceType: RaceType; isSpecified: boolean }[];
}[] = [
    {
        gradeName: 'SG',
        detail: [
            { raceType: RaceType.BOATRACE, isSpecified: true },
            { raceType: RaceType.AUTORACE, isSpecified: true },
        ],
    },
    {
        gradeName: 'GP',
        detail: [{ raceType: RaceType.KEIRIN, isSpecified: true }],
    },
    {
        gradeName: '特GⅠ',
        detail: [{ raceType: RaceType.AUTORACE, isSpecified: true }],
    },
    {
        gradeName: 'GⅠ',
        detail: [
            { raceType: RaceType.JRA, isSpecified: true },
            { raceType: RaceType.NAR, isSpecified: true },
            { raceType: RaceType.BOATRACE, isSpecified: false },
            { raceType: RaceType.OVERSEAS, isSpecified: true },
            { raceType: RaceType.KEIRIN, isSpecified: true },
            { raceType: RaceType.AUTORACE, isSpecified: false },
        ],
    },
    {
        gradeName: 'GⅡ',
        detail: [
            { raceType: RaceType.JRA, isSpecified: true },
            { raceType: RaceType.NAR, isSpecified: true },
            { raceType: RaceType.BOATRACE, isSpecified: false },
            { raceType: RaceType.OVERSEAS, isSpecified: true },
            { raceType: RaceType.KEIRIN, isSpecified: true },
            { raceType: RaceType.AUTORACE, isSpecified: false },
        ],
    },
    {
        gradeName: 'GⅢ',
        detail: [
            { raceType: RaceType.JRA, isSpecified: true },
            { raceType: RaceType.NAR, isSpecified: true },
            { raceType: RaceType.BOATRACE, isSpecified: false },
            { raceType: RaceType.OVERSEAS, isSpecified: true },
            { raceType: RaceType.KEIRIN, isSpecified: true },
        ],
    },
    {
        gradeName: 'JpnⅠ',
        detail: [
            { raceType: RaceType.JRA, isSpecified: true },
            { raceType: RaceType.NAR, isSpecified: true },
        ],
    },
    {
        gradeName: 'JpnⅡ',
        detail: [
            { raceType: RaceType.JRA, isSpecified: true },
            { raceType: RaceType.NAR, isSpecified: true },
        ],
    },
    {
        gradeName: 'JpnⅢ',
        detail: [
            { raceType: RaceType.JRA, isSpecified: true },
            { raceType: RaceType.NAR, isSpecified: true },
        ],
    },
    {
        gradeName: 'J.GⅠ',
        detail: [{ raceType: RaceType.JRA, isSpecified: true }],
    },
    {
        gradeName: 'J.GⅡ',
        detail: [{ raceType: RaceType.JRA, isSpecified: true }],
    },
    {
        gradeName: 'J.GⅢ',
        detail: [{ raceType: RaceType.JRA, isSpecified: true }],
    },
    {
        gradeName: 'FⅠ',
        detail: [{ raceType: RaceType.KEIRIN, isSpecified: true }],
    },
    {
        gradeName: 'FⅡ',
        detail: [{ raceType: RaceType.KEIRIN, isSpecified: true }],
    },
    {
        gradeName: 'Listed',
        detail: [
            { raceType: RaceType.JRA, isSpecified: true },
            { raceType: RaceType.NAR, isSpecified: true },
            { raceType: RaceType.OVERSEAS, isSpecified: true },
        ],
    },
    {
        gradeName: '重賞',
        detail: [
            { raceType: RaceType.JRA, isSpecified: true },
            { raceType: RaceType.NAR, isSpecified: true },
        ],
    },
    {
        gradeName: '地方重賞',
        detail: [{ raceType: RaceType.NAR, isSpecified: true }],
    },
    {
        gradeName: '地方準重賞',
        detail: [{ raceType: RaceType.NAR, isSpecified: true }],
    },
    {
        gradeName: 'オープン特別',
        detail: [
            { raceType: RaceType.JRA, isSpecified: true },
            { raceType: RaceType.NAR, isSpecified: true },
        ],
    },
    {
        gradeName: '一般',
        detail: [
            { raceType: RaceType.NAR, isSpecified: false },
            { raceType: RaceType.BOATRACE, isSpecified: false },
        ],
    },
    {
        gradeName: '開催',
        detail: [{ raceType: RaceType.AUTORACE, isSpecified: false }],
    },
    {
        gradeName: '格付けなし',
        detail: [
            { raceType: RaceType.JRA, isSpecified: false },
            { raceType: RaceType.NAR, isSpecified: false },
            { raceType: RaceType.OVERSEAS, isSpecified: true },
        ],
    },
    {
        gradeName: 'オープン',
        detail: [
            { raceType: RaceType.JRA, isSpecified: true },
            { raceType: RaceType.NAR, isSpecified: true },
        ],
    },
    {
        gradeName: '未格付',
        detail: [{ raceType: RaceType.NAR, isSpecified: false }],
    },
    {
        gradeName: '3勝クラス',
        detail: [{ raceType: RaceType.JRA, isSpecified: false }],
    },
    {
        gradeName: '2勝クラス',
        detail: [{ raceType: RaceType.JRA, isSpecified: false }],
    },
    {
        gradeName: '1勝クラス',
        detail: [{ raceType: RaceType.JRA, isSpecified: false }],
    },
    {
        gradeName: '1600万下',
        detail: [{ raceType: RaceType.JRA, isSpecified: false }],
    },
    {
        gradeName: '1000万下',
        detail: [{ raceType: RaceType.JRA, isSpecified: false }],
    },
    {
        gradeName: '900万下',
        detail: [{ raceType: RaceType.JRA, isSpecified: false }],
    },
    {
        gradeName: '500万下',
        detail: [{ raceType: RaceType.JRA, isSpecified: false }],
    },
    {
        gradeName: '未勝利',
        detail: [{ raceType: RaceType.JRA, isSpecified: false }],
    },
    {
        gradeName: '未出走',
        detail: [{ raceType: RaceType.JRA, isSpecified: false }],
    },
    {
        gradeName: '新馬',
        detail: [{ raceType: RaceType.JRA, isSpecified: false }],
    },
];
