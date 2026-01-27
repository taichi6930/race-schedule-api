import type { PlaceHeldDays } from '@race-schedule/shared/src/entity/placeEntity';
import type { RaceType } from '@race-schedule/shared/src/types/raceType';

export interface PlaceHtmlEntity {
    /** レース種別（JRA/NAR/KEIRINなど） */
    raceType: RaceType;
    /** 開催日付 */
    datetime: Date;
    /** 開催場名（place_master等から取得） */
    placeName: string;
    /** 開催グレード（KEIRIN/AUTORACEなどで使用、省略可） */
    placeGrade?: string;
    /** 開催回数・日数情報（省略可） */
    placeHeldDays: PlaceHeldDays | undefined;
}
