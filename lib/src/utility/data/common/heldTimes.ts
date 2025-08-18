import { z } from 'zod';


const HeldTimesSchema = z
    .number()
    .int()
    .min(1, '開催回数は1以上である必要があります');


export type HeldTimes = z.infer<typeof HeldTimesSchema>;


export const validateHeldTimes = (number: number): HeldTimes =>
    HeldTimesSchema.parse(number);
