import { z } from 'zod';

/**
 * AutoracePositionNumberのzod型定義
 */
const AutoracePositionNumberSchema = z
    .number()
    .int()
    .min(1, '枠番は1以上である必要があります')
    .max(8, '枠番は8以下である必要があります');

/**
 * AutoracePositionNumberの型定義
 * 1~8の整数
 */
export type AutoracePositionNumber = z.infer<
    typeof AutoracePositionNumberSchema
>;

/**
 * オートレースの枠番のバリデーション
 */
export const validateAutoracePositionNumber = (
    positionNumber: number,
): AutoracePositionNumber => {
    const result = AutoracePositionNumberSchema.safeParse(positionNumber);
    if (!result.success) {
        throw new Error(result.error.message);
    }
    return result.data;
};
