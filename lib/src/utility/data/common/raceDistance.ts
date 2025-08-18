import { z } from 'zod';


const RaceDistanceSchema = z
    .number()
    .positive('距離は0よりも大きい必要があります');


export type RaceDistance = z.infer<typeof RaceDistanceSchema>;


export const validateRaceDistance = (distance: number): RaceDistance =>
    RaceDistanceSchema.parse(distance);
