import { z } from 'zod';


const UpdateDateSchema = z.date();


export type UpdateDate = z.infer<typeof UpdateDateSchema>;


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
