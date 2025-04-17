import { z } from 'zod';

/**
 * 競輪の選手リスト
 */
export const KeirinPlayerList = [
    {
        playerNumber: '014396',
        name: '脇本雄太',
        priority: 6,
    },
    {
        playerNumber: '014838',
        name: '古性優作',
        priority: 6,
    },
    {
        playerNumber: '014681',
        name: '松浦悠士',
        priority: 6,
    },
    {
        playerNumber: '013162',
        name: '佐藤慎太郎',
        priority: 6,
    },
    {
        playerNumber: '014534',
        name: '深谷知広',
        priority: 6,
    },
    {
        playerNumber: '015242',
        name: '眞杉匠',
        priority: 5,
    },
    {
        playerNumber: '015009',
        name: '清水裕友',
        priority: 6,
    },
    {
        playerNumber: '014741',
        name: '郡司浩平',
        priority: 6,
    },
    {
        playerNumber: '015413',
        name: '寺崎浩平',
        priority: 3,
    },
    {
        playerNumber: '014054',
        name: '新田祐大',
        priority: 4,
    },
    {
        playerNumber: '015034',
        name: '新山響平',
        priority: 5,
    },
    {
        playerNumber: '015451',
        name: '山口拳矢',
        priority: 2,
    },
    {
        playerNumber: '015527',
        name: '北井佑季',
        priority: 5,
    },
    {
        playerNumber: '015597',
        name: '太田海也',
        priority: 4,
    },
    {
        playerNumber: '015553',
        name: '犬伏湧也',
        priority: 3,
    },
    {
        playerNumber: '015298',
        name: '嘉永泰斗',
        priority: 3,
    },
    // ガールズ
    {
        playerNumber: '015400',
        name: '久米詩',
        priority: 4,
    },
    { playerNumber: '015306', name: '佐藤水菜', priority: 4 },
    {
        playerNumber: '015219',
        name: '梅川風子',
        priority: 3,
    },
    {
        playerNumber: '015080',
        name: '児玉碧衣',
        priority: 4,
    },
    {
        playerNumber: '015587',
        name: '吉川美穂',
        priority: 3,
    },
    {
        playerNumber: '015218',
        name: '太田りゆ',
        priority: 3,
    },
    {
        playerNumber: '015679',
        name: '又多風緑',
        priority: 3,
    },
    {
        playerNumber: '015669',
        name: '河内桜雪',
        priority: 3,
    },
    {
        playerNumber: '999999',
        name: 'test',
        priority: 3,
    },
];

/**
 * KeirinPlayerNumberのzod型定義
 */
const KeirinPlayerNumberSchema = z
    .number()
    .int()
    .min(1, '選手番号は1以上である必要があります');

/**
 * KeirinPlayerNumberの型定義
 */
export type KeirinPlayerNumber = z.infer<typeof KeirinPlayerNumberSchema>;

/**
 * 競輪の選手番号のバリデーション
 * @param playerNumber
 */
export const validateKeirinPlayerNumber = (
    playerNumber: number,
): KeirinPlayerNumber => KeirinPlayerNumberSchema.parse(playerNumber);
