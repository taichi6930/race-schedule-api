import { z } from 'zod';

/**
 * KeirinPlaceIdのzod型定義
 * keirin + 8桁の数字（開催日） + 2桁の数字（開催場所）
 */
const KeirinPlaceIdSchema = z
    .string()
    .refine((value) => value.startsWith('keirin'), {
        message: `keirinから始まる必要があります`,
    })
    .refine((value) => /^keirin\d{10}$/.test(value), {
        message: `KeirinPlaceIdの形式ではありません`,
    });

/**
 * KeirinPlaceIdの型定義
 */
export type KeirinPlaceId = z.infer<typeof KeirinPlaceIdSchema>;

/**
 * KeirinPlaceIdのバリデーション
 * @param value - バリデーション対象
 * @returns バリデーション済みのKeirinPlaceId
 */
export const validateKeirinPlaceId = (value: string): KeirinPlaceId =>
    KeirinPlaceIdSchema.parse(value);
