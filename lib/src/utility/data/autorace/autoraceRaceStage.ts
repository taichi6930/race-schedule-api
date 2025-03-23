import { z } from 'zod';

import type { AutoraceGradeType } from './autoraceGradeType';

/**
 * AutoraceRaceStageのzod型定義
 */
export const AutoraceRaceStageSchema = z.string().refine((value) => {
    return AutoraceRaceStageList.has(value);
}, 'オートレースのステージではありません');

/**
 * AutoraceRaceStageの型定義
 */
export type AutoraceRaceStage = z.infer<typeof AutoraceRaceStageSchema>;

/**
 * オートレースのステージ リスト
 * @param stage - ステージ
 * @returns - バリデーション済みのステージ
 */
export const validateAutoraceRaceStage = (stage: string): AutoraceRaceStage =>
    AutoraceRaceStageSchema.parse(stage);

/**
 * ボートレースのステージ リスト
 */
const AutoraceRaceStageList = new Set([
    '優勝戦',
    '準決勝戦',
    '特別選抜戦',
    '特別一般戦',
    '一般戦',
    '予選',
    '選抜予選',
    '最終予選',
    'オーバル特別',
    '選抜戦',
]);

/**
 * オートレースの指定グレード・ステージリスト
 */
export const AutoraceSpecifiedGradeAndStageList: {
    grade: AutoraceGradeType;
    stage: AutoraceRaceStage;
    priority: number;
}[] = [{ grade: 'SG', stage: '優勝戦', priority: 9 }];

/**
 * HTMLのステージ名を正式名称に変換するためのマップ
 */
export const AutoraceStageMap: Record<string, AutoraceRaceStage> = {
    優勝戦: '優勝戦',
    特別選抜戦: '特別選抜戦',
    選抜戦: '選抜戦',
    特別一般戦: '特別一般戦',
    Ｇレース７一般戦: '一般戦',
    一般戦: '一般戦',
    予選: '予選',
    選抜予選: '選抜予選',
    準決勝戦Ｂ: '準決勝戦',
    準決勝戦Ａ: '準決勝戦',
    準決勝戦: '準決勝戦',
    最終予選: '最終予選',
    特別一般戦Ａ: '特別一般戦',
    特別一般戦Ｂ: '特別一般戦',
};
