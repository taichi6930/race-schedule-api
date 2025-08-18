import { z } from 'zod';


const RaceNumberSchema = z
    .number()
    .int()
    .min(1, 'レース番号は1以上である必要があります')
    .max(12, 'レース番号は12以下である必要があります');


export type RaceNumber = z.infer<typeof RaceNumberSchema>;


export const validateRaceNumber = (number: number): RaceNumber =>
    RaceNumberSchema.parse(number);
