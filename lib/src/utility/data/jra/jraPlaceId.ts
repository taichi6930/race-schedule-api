import { z } from 'zod';

/**
 * JraPlaceIdのzod型定義
 * jra + 8桁の数字（開催日） + 2桁の数字（開催場所）
 */
const JraPlaceIdSchema = z
    .string()
    .refine((value) => {
        return value.startsWith('jra');
    }, 'jraから始まる必要があります')
    .refine((value) => {
        return /^jra\d{10}$/.test(value);
    }, 'JraPlaceIdの形式ではありません');

/**
 * JraPlaceIdの型定義
 */
export type JraPlaceId = z.infer<typeof JraPlaceIdSchema>;

/**
 * JraPlaceIdのバリデーション
 * @param value - バリデーション対象
 * @returns バリデーション済みのJraPlaceId
 */
export const validateJraPlaceId = (value: string): JraPlaceId =>
    JraPlaceIdSchema.parse(value);
