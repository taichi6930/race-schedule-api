import { z } from 'zod';

/**
 * PlayerNumberのzod型定義
 */
const PlayerNumberSchema = z
    .number()
    .int()
    .min(1, '選手番号は1以上である必要があります');

/**
 * PlayerNumberの型定義
 */
export type PlayerNumber = z.infer<typeof PlayerNumberSchema>;

/**
 * 選手番号のバリデーション
 * @param playerNumber
 */
export const validatePlayerNumber = (playerNumber: number): PlayerNumber =>
    PlayerNumberSchema.parse(playerNumber);
