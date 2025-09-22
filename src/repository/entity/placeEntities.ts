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
    kind: typeof RaceType.JRA;
    heldDayData: HeldDayData;
}

export interface NarPlaceEntity extends BasePlaceEntity {
    kind: typeof RaceType.NAR;
}

export interface OverseasPlaceEntity extends BasePlaceEntity {
    kind: typeof RaceType.OVERSEAS;
}

export interface KeirinPlaceEntity extends BasePlaceEntity {
    kind: typeof RaceType.KEIRIN;
    grade: GradeType;
}

export interface AutoracePlaceEntity extends BasePlaceEntity {
    kind: typeof RaceType.AUTORACE;
    grade: GradeType;
}

export interface BoatracePlaceEntity extends BasePlaceEntity {
    kind: typeof RaceType.BOATRACE;
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
    p.kind === RaceType.JRA;
export const isNarPlace = (p: PlaceEntityTagged): p is NarPlaceEntity =>
    p.kind === RaceType.NAR;
export const isOverseasPlace = (
    p: PlaceEntityTagged,
): p is OverseasPlaceEntity => p.kind === RaceType.OVERSEAS;
export const isKeirinPlace = (p: PlaceEntityTagged): p is KeirinPlaceEntity =>
    p.kind === RaceType.KEIRIN;
export const isAutoracePlace = (
    p: PlaceEntityTagged,
): p is AutoracePlaceEntity => p.kind === RaceType.AUTORACE;
export const isBoatracePlace = (
    p: PlaceEntityTagged,
): p is BoatracePlaceEntity => p.kind === RaceType.BOATRACE;

export const fromLegacyPlaceEntity = (
    legacy: LegacyPlaceEntity,
): PlaceEntityTagged => {
    const kind = legacy.placeData.raceType;
    switch (kind) {
        case RaceType.JRA: {
            return {
                id: legacy.id,
                placeData: legacy.placeData,
                kind: RaceType.JRA,
                heldDayData: legacy.heldDayData,
            };
        }
        case RaceType.NAR: {
            return {
                id: legacy.id,
                placeData: legacy.placeData,
                kind: RaceType.NAR,
            };
        }
        case RaceType.OVERSEAS: {
            return {
                id: legacy.id,
                placeData: legacy.placeData,
                kind: RaceType.OVERSEAS,
            };
        }
        case RaceType.KEIRIN: {
            return {
                id: legacy.id,
                placeData: legacy.placeData,
                kind: RaceType.KEIRIN,
                grade: legacy.grade as GradeType,
            };
        }
        case RaceType.AUTORACE: {
            return {
                id: legacy.id,
                placeData: legacy.placeData,
                kind: RaceType.AUTORACE,
                grade: legacy.grade as GradeType,
            };
        }
        case RaceType.BOATRACE: {
            return {
                id: legacy.id,
                placeData: legacy.placeData,
                kind: RaceType.BOATRACE,
                grade: legacy.grade as GradeType,
            };
        }
        default: {
            throw new Error(`Unsupported race type: ${String(kind)}`);
        }
    }
};

export default PlaceEntityTagged;
