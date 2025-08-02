import { z } from 'zod';

import { AutoraceRaceStageSchema } from './autorace/autoraceRaceStage';
import { BoatraceRaceStageSchema } from './boatrace/boatraceRaceStage';
import { KeirinRaceStageSchema } from './keirin/keirinRaceStage';

/**
 * RaceStageのzod型定義
 */
export const RaceStageSchema = z.union([
    KeirinRaceStageSchema,
    AutoraceRaceStageSchema,
    BoatraceRaceStageSchema,
]);

/**
 * RaceStageの型定義
 */
export type RaceStage = z.infer<typeof RaceStageSchema>;
