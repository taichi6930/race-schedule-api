import { z } from 'zod';

/**
 * ボートレースの選手リスト
 */
export const BoatracePlayerList = [
    {
        playerNumber: 4320,
        name: '峰竜太',
        priority: 6,
    },
    {
        playerNumber: '999999',
        name: 'test',
        priority: 3,
    },
];

/**
 * BoatracePlayerNumberのzod型定義
 */
const BoatracePlayerNumberSchema = z
    .number()
    .int()
    .min(1, '選手番号は1以上である必要があります');

/**
 * BoatracePlayerNumberの型定義
 */
export type BoatracePlayerNumber = z.infer<typeof BoatracePlayerNumberSchema>;

/**
 * ボートレースの選手番号のバリデーション
 * @param playerNumber
 */
export const validateBoatracePlayerNumber = (
    playerNumber: number,
): BoatracePlayerNumber => BoatracePlayerNumberSchema.parse(playerNumber);
