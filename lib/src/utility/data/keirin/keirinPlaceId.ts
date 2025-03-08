import { z } from 'zod';

/**
 * KeirinPlaceIdのzod型定義
 * keirin + 8桁の数字（開催日） + 2桁の数字（開催場所）
 */
const KeirinPlaceIdSchema = z
    .string()
    .refine((value) => {
        return value.startsWith('keirin');
    }, 'keirinから始まる必要があります')
    .refine((value) => {
        return /^keirin\d{8}\d{2}$/.test(value);
    }, 'KeirinPlaceIdの形式ではありません');

/**
 * KeirinPlaceIdの型定義
 */
export type KeirinPlaceId = z.infer<typeof KeirinPlaceIdSchema>;

/**
 * KeirinPlaceIdのバリデーション
 * @param value - バリデーション対象
 */
export const validateKeirinPlaceId = (value: string): KeirinPlaceId =>
    KeirinPlaceIdSchema.parse(value);
