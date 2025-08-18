import { z } from 'zod';


const heldDayTimesSchema = z
    .number()
    .int()
    .min(1, '開催日数は1以上である必要があります');


export type heldDayTimes = z.infer<typeof heldDayTimesSchema>;


export const validateHeldDayTimes = (number: number): heldDayTimes =>
    heldDayTimesSchema.parse(number);
