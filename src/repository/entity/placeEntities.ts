import type { HeldDayData } from '../../domain/heldDayData';
import type { PlaceData } from '../../domain/placeData';
import { RaceType } from '../../utility/raceType';
import type { GradeType } from '../../utility/validateAndType/gradeType';
import type { PlaceEntity as LegacyPlaceEntity } from './placeEntity';

export interface BasePlaceEntity {
    id: string;
    placeData: PlaceData;
}

export interface JraPlaceEntity extends BasePlaceEntity {
    heldDayData: HeldDayData;
}

export interface NarPlaceEntity {
    id: string;
    placeData: PlaceData;
}

export interface OverseasPlaceEntity {
    id: string;
    placeData: PlaceData;
}

export interface KeirinPlaceEntity extends BasePlaceEntity {
    grade: GradeType;
}

export interface AutoracePlaceEntity extends BasePlaceEntity {
    grade: GradeType;
}

export interface BoatracePlaceEntity extends BasePlaceEntity {
    grade: GradeType;
}

export type PlaceEntityTagged =
    | JraPlaceEntity
    | NarPlaceEntity
    | OverseasPlaceEntity
    | KeirinPlaceEntity
    | AutoracePlaceEntity
    | BoatracePlaceEntity;

export const isJraPlace = (p: PlaceEntityTagged): p is JraPlaceEntity =>
    p.placeData.raceType === RaceType.JRA;
export const isNarPlace = (p: PlaceEntityTagged): p is NarPlaceEntity =>
    p.placeData.raceType === RaceType.NAR;
export const isOverseasPlace = (
    p: PlaceEntityTagged,
): p is OverseasPlaceEntity => p.placeData.raceType === RaceType.OVERSEAS;
export const isKeirinPlace = (p: PlaceEntityTagged): p is KeirinPlaceEntity =>
    p.placeData.raceType === RaceType.KEIRIN;
export const isAutoracePlace = (
    p: PlaceEntityTagged,
): p is AutoracePlaceEntity => p.placeData.raceType === RaceType.AUTORACE;
export const isBoatracePlace = (
    p: PlaceEntityTagged,
): p is BoatracePlaceEntity => p.placeData.raceType === RaceType.BOATRACE;

export const fromLegacyPlaceEntity = (
    legacy: LegacyPlaceEntity,
): PlaceEntityTagged => {
    const kind = legacy.placeData.raceType;
    switch (kind) {
        case RaceType.JRA: {
            return {
                id: legacy.id,
                placeData: legacy.placeData,
                heldDayData: legacy.heldDayData,
            };
        }
        case RaceType.NAR: {
            return {
                id: legacy.id,
                placeData: legacy.placeData,
            };
        }
        case RaceType.OVERSEAS: {
            return {
                id: legacy.id,
                placeData: legacy.placeData,
            };
        }
        case RaceType.KEIRIN: {
            return {
                id: legacy.id,
                placeData: legacy.placeData,
                grade: legacy.grade,
            };
        }
        case RaceType.AUTORACE: {
            return {
                id: legacy.id,
                placeData: legacy.placeData,
                grade: legacy.grade,
            };
        }
        case RaceType.BOATRACE: {
            return {
                id: legacy.id,
                placeData: legacy.placeData,
                grade: legacy.grade,
            };
        }
    }
};

export default PlaceEntityTagged;
