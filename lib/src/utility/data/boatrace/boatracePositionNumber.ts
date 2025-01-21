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
 */
export const validateBoatracePositionNumber = (
    positionNumber: number,
): BoatracePositionNumber => {
    const result = BoatracePositionNumberSchema.safeParse(positionNumber);
    if (!result.success) {
        throw new Error(
            `${result.error.message}: ${positionNumber.toString()}`,
        );
    }
    return result.data;
};
