import { z } from 'zod';

/**
 * BoatracePositionNumberのzod型定義
 */
const BoatracePositionNumberSchema = z
    .number()
    .int()
    .min(1, '枠番は1以上である必要があります')
    .max(6, '枠番は6以下である必要があります');

/**
 * BoatracePositionNumberの型定義
 * 1~8の整数
 */
export type BoatracePositionNumber = z.infer<
    typeof BoatracePositionNumberSchema
>;

/**
 * ボートレースの枠番のバリデーション
 * @param positionNumber
 */
export const validateBoatracePositionNumber = (
    positionNumber: number,
): BoatracePositionNumber => BoatracePositionNumberSchema.parse(positionNumber);
