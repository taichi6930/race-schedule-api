import { z } from 'zod';

import type { BoatraceGradeType } from './boatraceGradeType';

/**
 * BoatraceRaceStageのzod型定義
 */
export const BoatraceRaceStageSchema = z.string().refine((value) => {
    return BoatraceRaceStageList.has(value);
}, 'ボートレースのステージではありません');

/**
 * BoatraceRaceStageの型定義
 */
export type BoatraceRaceStage = z.infer<typeof BoatraceRaceStageSchema>;

/**
 * ボートレースのステージ リスト
 */
const BoatraceRaceStageList = new Set(['優勝戦', '準優勝戦', '一般戦', '']);

/**
 * HTMLのステージ名を正式名称に変換するためのマップ
 */
export const BoatraceStageMap: Record<string, BoatraceRaceStage> = {
    準優勝戦: '準優勝戦',
    優勝戦: '優勝戦',
};

/**
 * ボートレースの指定グレード・ステージリスト
 */
export const BoatraceSpecifiedGradeAndStageList: {
    grade: BoatraceGradeType;
    stage: BoatraceRaceStage;
    priority: number;
}[] = [{ grade: 'SG', stage: '優勝戦', priority: 10 }];

/**
 * ボートレースのステージ リスト
 * @param stage - ステージ
 * @returns - バリデーション済みのステージ
 */
export const validateBoatraceRaceStage = (stage: string): BoatraceRaceStage =>
    BoatraceRaceStageSchema.parse(stage);
