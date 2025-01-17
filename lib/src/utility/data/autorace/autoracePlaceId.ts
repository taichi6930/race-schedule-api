import { z } from 'zod';

/**
 * AutoracePlaceIdのzod型定義
 * autorace + 8桁の数字（開催日） + 2桁の数字（開催場所）
 */
const AutoracePlaceIdSchema = z
    .string()
    .refine((value) => {
        return value.startsWith('autorace');
    }, 'autoraceから始まる必要があります')
    .refine((value) => {
        return /^autorace\d{8}\d{2}$/.test(value);
    }, 'AutoracePlaceIdの形式ではありません');

/**
 * AutoracePlaceIdの型定義
 */
export type AutoracePlaceId = z.infer<typeof AutoracePlaceIdSchema>;

/**
 * AutoracePlaceIdのバリデーション
 * @param value - バリデーション対象
 * @returns バリデーション済みのAutoracePlaceId
 */
export const validateAutoracePlaceId = (value: string): AutoracePlaceId => {
    const result = AutoracePlaceIdSchema.safeParse(value);
    if (!result.success) {
        throw new Error(result.error.message);
    }
    return result.data;
};
