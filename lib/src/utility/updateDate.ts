import { z } from 'zod';

/**
 * UpdateDateのzod型定義
 */
const UpdateDateSchema = z.date();

/**
 * UpdateDateの型定義
 */
export type UpdateDate = z.infer<typeof UpdateDateSchema>;

/**
 * 更新日時のバリデーション
 * @param dateTime - 更新日時
 */
export const validateUpdateDate = (
    dateTime: Date | string | undefined,
): UpdateDate => {
    if (dateTime === undefined) {
        throw new Error('dateTime is undefined');
    }
    if (typeof dateTime === 'string') {
        dateTime = new Date(dateTime);
    }
    const result = UpdateDateSchema.safeParse(dateTime);
    if (!result.success) {
        throw new Error(result.error.message);
    }
    return result.data;
};
