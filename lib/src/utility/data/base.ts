import { z } from 'zod';

import { AutoraceGradeTypeSchema } from './autorace/autoraceGradeType';
import { AutoraceRaceCourseSchema } from './autorace/autoraceRaceCourse';
import { AutoraceRaceStageSchema } from './autorace/autoraceRaceStage';
import { BoatraceGradeTypeSchema } from './boatrace/boatraceGradeType';
import { BoatraceRaceCourseSchema } from './boatrace/boatraceRaceCourse';
import { BoatraceRaceStageSchema } from './boatrace/boatraceRaceStage';
import { JraRaceCourseSchema } from './common/raceCourse';
import { KeirinRaceCourseSchema } from './common/raceCourse';
import { JraGradeTypeSchema } from './jra/jraGradeType';
import { KeirinGradeTypeSchema } from './keirin/keirinGradeType';
import { KeirinRaceStageSchema } from './keirin/keirinRaceStage';
import { NarGradeTypeSchema } from './nar/narGradeType';
import { NarRaceCourseSchema } from './nar/narRaceCourse';
import { WorldGradeTypeSchema } from './world/worldGradeType';
import { WorldRaceCourseSchema } from './world/worldRaceCourse';

/**
 * GradeTypeのzod型定義
 */
export const GradeTypeSchema = z.union([
    JraGradeTypeSchema,
    NarGradeTypeSchema,
    WorldGradeTypeSchema,
    KeirinGradeTypeSchema,
    AutoraceGradeTypeSchema,
    BoatraceGradeTypeSchema,
]);

/**
 * GradeTypeの型定義
 */
export type GradeType = z.infer<typeof GradeTypeSchema>;

/**
 * RaceCourseのzod型定義
 */
export const RaceCourseSchema = z.union([
    JraRaceCourseSchema,
    NarRaceCourseSchema,
    WorldRaceCourseSchema,
    KeirinRaceCourseSchema,
    AutoraceRaceCourseSchema,
    BoatraceRaceCourseSchema,
]);

/**
 * RaceCourseの型定義
 */
export type RaceCourse = z.infer<typeof RaceCourseSchema>;

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
