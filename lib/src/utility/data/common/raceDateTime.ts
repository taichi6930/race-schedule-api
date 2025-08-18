import { z } from 'zod';


const RaceDateTimeSchema = z.date();


export type RaceDateTime = z.infer<typeof RaceDateTimeSchema>;


export const validateRaceDateTime = (dateTime: Date): RaceDateTime =>
    RaceDateTimeSchema.parse(dateTime);
