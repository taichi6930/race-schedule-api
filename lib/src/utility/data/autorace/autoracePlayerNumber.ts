import { z } from 'zod';

/**
 * オートレースの選手リスト
 */
export const AutoracePlayerList = [
    {
        playerNumber: 5954,
        name: '青山周平',
        priority: 6,
    },
    {
        playerNumber: '999999',
        name: 'test',
        priority: 3,
    },
];

/**
 * AutoracePlayerNumberのzod型定義
 */
const AutoracePlayerNumberSchema = z
    .number()
    .int()
    .min(1, '選手番号は1以上である必要があります');

/**
 * AutoracePlayerNumberの型定義
 */
export type AutoracePlayerNumber = z.infer<typeof AutoracePlayerNumberSchema>;

/**
 * オートレースの選手番号のバリデーション
 * @param playerNumber
 */
export const validateAutoracePlayerNumber = (
    playerNumber: number,
): AutoracePlayerNumber => AutoracePlayerNumberSchema.parse(playerNumber);
