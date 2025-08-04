import { format } from 'date-fns';

import type { PlaceId } from './data/common/placeId';
import type {
    AutoracePositionNumber,
    BoatracePositionNumber,
    KeirinPositionNumber,
} from './data/common/positionNumber';
import type {
    AutoraceRaceCourse,
    BoatraceRaceCourse,
    JraRaceCourse,
    KeirinRaceCourse,
    NarRaceCourse,
    WorldRaceCourse,
} from './data/common/raceCourse';
import {
    AutoracePlaceCodeMap,
    BoatracePlaceCodeMap,
    KeirinPlaceCodeMap,
    WorldPlaceCodeMap,
} from './data/common/raceCourse';
import type { RaceDateTime } from './data/common/raceDateTime';
import type { RaceId } from './data/common/raceId';
import type { RaceNumber } from './data/common/raceNumber';
import type { RacePlayerId } from './data/common/racePlayerId';
import { NetkeibaBabacodeMap } from './data/netkeiba';
import type { WorldRaceNumber } from './data/world/worldRaceNumber';

/**
 * 中央競馬のraceIdを作成する
 * @param dateTime - 開催日時
 * @param location - 開催場所
 * @param number - レース番号
 */
export const generateJraRaceId = (
    dateTime: Date,
    location: JraRaceCourse,
    number: RaceNumber,
): RaceId => {
    const numberCode = number.toXDigits(2);
    return `${generateJraPlaceId(dateTime, location)}${numberCode}`;
};

/**
 * 中央競馬のplaceIdを作成する
 * @param dateTime - 開催日時
 * @param location - 開催場所
 */
export const generateJraPlaceId = (
    dateTime: Date,
    location: JraRaceCourse,
): RaceId => {
    const dateCode = format(dateTime, 'yyyyMMdd');
    const locationCode = NetkeibaBabacodeMap[location];
    return `jra${dateCode}${locationCode}`;
};

/**
 * 地方競馬のraceIdを作成する
 * @param dateTime - 開催日時
 * @param location - 開催場所
 * @param number - レース番号
 * @returns 生成されたID
 * @private
 */
export const generateNarRaceId = (
    dateTime: Date,
    location: NarRaceCourse,
    number: RaceNumber,
): RaceId => {
    const numberCode = number.toXDigits(2);
    return `${generateNarPlaceId(dateTime, location)}${numberCode}`;
};

/**
 * 地方競馬のplaceIdを作成する
 * @param dateTime - 開催日時
 * @param location - 開催場所
 * @returns 生成されたID
 * @private
 */
export const generateNarPlaceId = (
    dateTime: Date,
    location: NarRaceCourse,
): PlaceId => {
    const dateCode = format(dateTime, 'yyyyMMdd');
    const locationCode = NetkeibaBabacodeMap[location];
    return `nar${dateCode}${locationCode}`;
};

/**
 * 海外競馬のraceIdを作成する
 * @param dateTime - 開催日時
 * @param location - 開催場所
 * @param number - レース番号
 */
export const generateWorldRaceId = (
    dateTime: RaceDateTime,
    location: WorldRaceCourse,
    number: WorldRaceNumber,
): RaceId => {
    const numberCode = number.toXDigits(2);
    return `${generateWorldPlaceId(dateTime, location)}${numberCode}`;
};

/**
 * 海外競馬のplaceIdを作成する
 * @param dateTime - 開催日時
 * @param location - 開催場所
 */
export const generateWorldPlaceId = (
    dateTime: Date,
    location: WorldRaceCourse,
): RaceId => {
    const dateCode = format(dateTime, 'yyyyMMdd');
    const locationCode = WorldPlaceCodeMap[location];
    return `world${dateCode}${locationCode}`;
};

/**
 * 競輪のracePlayerIdを作成する
 * @param dateTime - 開催日時
 * @param location - 開催場所
 * @param number - レース番号
 * @param positionNumber - 枠番
 */
export const generateKeirinRacePlayerId = (
    dateTime: Date,
    location: KeirinRaceCourse,
    number: RaceNumber,
    positionNumber: KeirinPositionNumber,
): RacePlayerId => {
    const positionNumberCode = positionNumber.toXDigits(2);
    return `${generateKeirinRaceId(dateTime, location, number)}${positionNumberCode}`;
};

/**
 * 競輪のraceIdを作成する
 * @param dateTime - 開催日時
 * @param location - 開催場所
 * @param number - レース番号
 */
export const generateKeirinRaceId = (
    dateTime: Date,
    location: KeirinRaceCourse,
    number: RaceNumber,
): RaceId => {
    const numberCode = number.toXDigits(2);
    return `${generateKeirinPlaceId(dateTime, location)}${numberCode}`;
};

/**
 * 競輪のplaceIdを作成する
 * @param dateTime - 開催日時
 * @param location - 開催場所
 */
export const generateKeirinPlaceId = (
    dateTime: Date,
    location: KeirinRaceCourse,
): PlaceId => {
    const dateCode = format(dateTime, 'yyyyMMdd');
    const locationCode = KeirinPlaceCodeMap[location];
    return `keirin${dateCode}${locationCode}`;
};

/**
 * ボートレースのracePlayerIdを作成する
 * @param dateTime - 開催日時
 * @param location - 開催場所
 * @param number - レース番号
 * @param positionNumber - 枠番
 */
export const generateBoatraceRacePlayerId = (
    dateTime: Date,
    location: BoatraceRaceCourse,
    number: RaceNumber,
    positionNumber: BoatracePositionNumber,
): RacePlayerId => {
    const positionNumberCode = positionNumber.toXDigits(2);
    return `${generateBoatraceRaceId(dateTime, location, number)}${positionNumberCode}`;
};

/**
 * ボートレースのraceIdを作成する
 * @param dateTime - 開催日時
 * @param location - 開催場所
 * @param number - レース番号
 */
export const generateBoatraceRaceId = (
    dateTime: Date,
    location: BoatraceRaceCourse,
    number: RaceNumber,
): RaceId => {
    const numberCode = number.toXDigits(2);
    return `${generateBoatracePlaceId(dateTime, location)}${numberCode}`;
};

/**
 * ボートレースのplaceIdを作成する
 * @param dateTime - 開催日時
 * @param location - 開催場所
 */
export const generateBoatracePlaceId = (
    dateTime: Date,
    location: BoatraceRaceCourse,
): PlaceId => {
    const dateCode = format(dateTime, 'yyyyMMdd');
    const locationCode = BoatracePlaceCodeMap[location];
    return `boatrace${dateCode}${locationCode}`;
};

/**
 * オートレースのracePlayerIdを作成する
 * @param dateTime - 開催日時
 * @param location - 開催場所
 * @param number - レース番号
 * @param positionNumber - 枠番
 */
export const generateAutoraceRacePlayerId = (
    dateTime: Date,
    location: AutoraceRaceCourse,
    number: RaceNumber,
    positionNumber: AutoracePositionNumber,
): RacePlayerId => {
    const positionNumberCode = positionNumber.toXDigits(2);
    return `${generateAutoraceRaceId(dateTime, location, number)}${positionNumberCode}`;
};

/**
 * オートレースのraceIdを作成する
 * @param dateTime - 開催日時
 * @param location - 開催場所
 * @param number - レース番号
 */
export const generateAutoraceRaceId = (
    dateTime: Date,
    location: AutoraceRaceCourse,
    number: RaceNumber,
): RaceId => {
    const numberCode = number.toXDigits(2);
    return `${generateAutoracePlaceId(dateTime, location)}${numberCode}`;
};

/**
 * オートレースのplaceIdを作成する
 * @param dateTime - 開催日時
 * @param location - 開催場所
 */
export const generateAutoracePlaceId = (
    dateTime: Date,
    location: AutoraceRaceCourse,
): PlaceId => {
    const dateCode = format(dateTime, 'yyyyMMdd');
    const locationCode = AutoracePlaceCodeMap[location];
    return `autorace${dateCode}${locationCode}`;
};
