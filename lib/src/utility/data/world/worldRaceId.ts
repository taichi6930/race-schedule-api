import { z } from 'zod';

/**
 * WorldRaceIdのzod型定義
 * world + 8桁の数字（開催日） + 2桁の数字（開催場所）+ 2桁の数字（レース番号）
 */
const WorldRaceIdSchema = z
    .string()
    .refine((value) => {
        return value.startsWith('world');
    }, 'worldから始まる必要があります')
    // worldの後に8桁の数字（開催日） + 2桁の数字（開催場所）+ 2桁の数字（レース番号）
    .refine((value) => {
        return /^world\d{12}$/.test(value);
    }, 'WorldRaceIdの形式ではありません');

/**
 * WorldRaceIdの型定義
 */
export type WorldRaceId = z.infer<typeof WorldRaceIdSchema>;

/**
 * WorldRaceIdのバリデーション
 * @param value - バリデーション対象
 * @returns バリデーション済みのWorldRaceId
 */
export const validateWorldRaceId = (value: string): WorldRaceId =>
    WorldRaceIdSchema.parse(value);
