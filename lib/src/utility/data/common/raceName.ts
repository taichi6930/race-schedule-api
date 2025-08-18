import { z } from 'zod';


const RaceNameSchema = z.string().min(1, '空文字は許可されていません');


export type RaceName = z.infer<typeof RaceNameSchema>;


export const validateRaceName = (name: string): RaceName =>
    RaceNameSchema.parse(name);
