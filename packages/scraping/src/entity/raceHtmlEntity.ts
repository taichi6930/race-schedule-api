import type { RaceType } from '@race-schedule/shared/src/types/raceType';

/**
 * HTML スクレイピングから取得したレース情報
 *
 * HTMLから直接パースした生データを保持します。
 * 複雑なバリデーションや型変換は行わず、シンプルな構造を維持します。
 */
export interface RaceHtmlEntity {
    /** レース種別（JRA/NAR/KEIRINなど） */
    raceType: RaceType;
    /** 開催日時 */
    datetime: Date;
    /** 開催場所（文字列） */
    location: string;
    /** レース番号 */
    raceNumber: number;
    /** レース名 */
    raceName: string;
    /** グレード（文字列） */
    grade?: string;
    /** 距離（メートル） */
    distance?: number;
    /** 馬場状態・トラック種別 */
    surfaceType?: string;
    /** レースステージ（KEIRIN/AUTORACE/BOATRACEのみ） */
    stage?: string;
    /** その他の追加情報 */
    additionalInfo?: Record<string, unknown>;
}
