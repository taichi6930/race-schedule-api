import { z } from 'zod';
/**
 * WorldPlaceIdのzod型定義
 * world + 8桁の数字（開催日） + 2桁の数字（開催場所）
 */
const WorldPlaceIdSchema = z
    .string()
    .refine((value) => {
        return value.startsWith('world');
    }, 'worldから始まる必要があります')
    .refine((value) => {
        return /^world\d{10}$/.test(value);
    }, 'WorldPlaceIdの形式ではありません');

/**
 * WorldPlaceIdの型定義
 */
export type WorldPlaceId = z.infer<typeof WorldPlaceIdSchema>;

/**
 * WorldPlaceIdのバリデーション
 * @param value - バリデーション対象
 * @returns バリデーション済みのWorldPlaceId
 */
export const validateWorldPlaceId = (value: string): WorldPlaceId =>
    WorldPlaceIdSchema.parse(value);
