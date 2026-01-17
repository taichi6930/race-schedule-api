import type { HeldDayTimes } from '../types/heldDayTimes';
import type { HeldTimes } from '../types/heldTimes';
import type { LocationCode } from '../types/locationCode';
import type { PlaceId } from '../types/placeId';
import type { RaceType } from './../types/raceType';

/**
 * 開催場情報を表すエンティティ
 *
 * 競馬・競輪などの開催場ごとの基本情報や開催日、場所コードなどを保持します。
 */
export interface PlaceEntity {
    /** 開催場ID（ユニーク） */
    placeId: PlaceId;
    /** レース種別（JRA/NAR/KEIRINなど） */
    raceType: RaceType;
    /** 開催日付 */
    datetime: Date;
    /** 開催場所コード */
    locationCode?: LocationCode;
    /** 開催場名（place_master等から取得） */
    placeName: string;
    /** 開催場グレード（省略可） */
    placeGrade: string | undefined;
    /** 開催回数・日数情報（省略可） */
    placeHeldDays: PlaceHeldDays | undefined;
}

/**
 * 開催回数・日数情報
 *
 * 1つの開催場での開催回数や日数をまとめて管理します。
 */
export interface PlaceHeldDays {
    /** 開催回数 */
    heldTimes: HeldTimes;
    /** 開催日数 */
    heldDayTimes: HeldDayTimes;
}
