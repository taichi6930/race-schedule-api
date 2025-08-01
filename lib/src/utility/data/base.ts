import { z } from 'zod';

import { AutoraceRaceStageSchema } from './autorace/autoraceRaceStage';
import { BoatraceRaceStageSchema } from './boatrace/boatraceRaceStage';
import { BoatraceGradeTypeSchema } from './common/gradeType';
import { AutoraceGradeTypeSchema } from './common/gradeType';
import { KeirinGradeTypeSchema } from './common/gradeType';
import { JraGradeTypeSchema } from './common/gradeType';
import { NarGradeTypeSchema } from './common/gradeType';
import { WorldGradeTypeSchema } from './common/gradeType';
import {
    AutoraceRaceCourseSchema,
    BoatraceRaceCourseSchema,
    JraRaceCourseSchema,
    KeirinRaceCourseSchema,
    NarRaceCourseSchema,
    WorldRaceCourseSchema,
} from './common/raceCourse';
import { KeirinRaceStageSchema } from './keirin/keirinRaceStage';

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
