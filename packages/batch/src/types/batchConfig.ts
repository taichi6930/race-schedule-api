import type { RaceType } from '@race-schedule/shared/src/types/raceType';

/**
 * バッチ処理の設定パラメータ
 */
export interface BatchConfig {
    /** レース種別（JRA/NAR/KEIRINなど） */
    raceType: RaceType;
    /** 処理開始日（YYYY-MM-DD形式） */
    startDate: string;
    /** 処理終了日（YYYY-MM-DD形式） */
    finishDate: string;
}

/**
 * バッチ処理の対象種別
 */
export type BatchTarget = 'place' | 'race' | 'all';

/**
 * バッチ処理の結果
 */
export interface BatchResult {
    /** 対象種別 */
    target: BatchTarget;
    /** 成功件数 */
    successCount: number;
    /** 失敗件数 */
    failureCount: number;
    /** 失敗詳細 */
    failures: {
        id: string;
        reason: string;
    }[];
}
