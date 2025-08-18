import { z } from 'zod';


const PlayerNumberSchema = z
    .number()
    .int()
    .min(1, '選手番号は1以上である必要があります');


export type PlayerNumber = z.infer<typeof PlayerNumberSchema>;


export const validatePlayerNumber = (playerNumber: number): PlayerNumber =>
    PlayerNumberSchema.parse(playerNumber);
