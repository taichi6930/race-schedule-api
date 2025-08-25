import { z } from 'zod';

import { RaceGradeAndStageList } from '../data/stage';
import type { RaceType } from '../raceType';

/**
 * ステージ のバリデーション
 * @param raceType - レース種別
 * @param stage - 開催ステージ
 * @returns - バリデーション済みのステージ
 */
export const validateRaceStage = (
    raceType: RaceType,
    stage: string,
): RaceStage => RaceStageSchema(raceType).parse(stage);

/**
 * ステージ リスト
 * @param raceType - レース種別
 */
const RaceStageList: (raceType: RaceType) => Set<string> = (raceType) =>
    new Set(
        RaceGradeAndStageList.filter((item) => item.raceType === raceType).map(
            (item) => item.stage,
        ),
    );

/**
 * HTML表記・oddspark表記の両方をカバーするステージ名マップ
 * @param raceType - レース種別
 */
export const StageMap: (raceType: RaceType) => Record<string, RaceStage> = (
    raceType,
) =>
    Object.fromEntries(
        RaceGradeAndStageList.filter(
            (item) => item.raceType === raceType,
        ).flatMap((item) =>
            item.stageByWebSite.map((stageByOddspark) => [
                stageByOddspark,
                item.stage,
            ]),
        ),
    );

/**
 * RaceCourseのzod型定義
 * @param raceType - レース種別
 */
const RaceStageSchema = (raceType: RaceType): z.ZodString =>
    z.string().refine((value) => {
        return RaceStageList(raceType).has(value);
    }, `${raceType}の開催ステージではありません`);

/**
 * RaceStageの型定義
 */
export type RaceStage = z.infer<ReturnType<typeof RaceStageSchema>>;
