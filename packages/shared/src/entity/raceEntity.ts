import type { LocationCode } from '../types/locationCode';
import type { PlaceId } from '../types/placeId';
import type { RaceId } from '../types/raceId';
import type { RaceNumber } from '../types/raceNumber';
import type { RaceType } from '../types/raceType';
import type { PlaceHeldDays } from './placeEntity';

/**
 * レース情報を表すエンティティ
 *
 * 競馬・競輪などの開催場ごとのレース情報を保持します。
 */
export interface RaceEntity {
    /** レースID（ユニーク）*/
    race_id: RaceId;
    /** 開催場ID */
    placeId: PlaceId;
    /** レース種別（JRA/NAR/KEIRINなど） */
    raceType: RaceType;
    /** 開催日付 */
    datetime: Date;
    /** 開催場所コード */
    locationCode: LocationCode;
    /** 開催場名（place_master等から取得） */
    placeName: string;
    /** レース番号 */
    raceNumber: RaceNumber;
    /** 開催回数・日数情報（省略可） */
    placeHeldDays: PlaceHeldDays | undefined;
}
