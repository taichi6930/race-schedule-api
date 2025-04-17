import { z } from 'zod';

/**
 * KeirinPositionNumberのzod型定義
 */

/**
 * KeirinPositionNumberのzod型定義
 */
const KeirinPositionNumberSchema = z
    .number()
    .int()
    .min(1, '枠番は1以上である必要があります')
    .max(9, '枠番は9以下である必要があります');

/**
 * KeirinPositionNumberの型定義
 * 1~8の整数
 */
export type KeirinPositionNumber = z.infer<typeof KeirinPositionNumberSchema>;

/**
 * 競輪の枠番のバリデーション
 * @param positionNumber
 */
export const validateKeirinPositionNumber = (
    positionNumber: number,
): KeirinPositionNumber => KeirinPositionNumberSchema.parse(positionNumber);
