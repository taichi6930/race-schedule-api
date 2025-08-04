import { format } from 'date-fns';

import type { PlaceId } from './data/common/placeId';
import type { PositionNumber } from './data/common/positionNumber';
import type { RaceCourse } from './data/common/raceCourse';
import { createPlaceCodeMap } from './data/common/raceCourse';
import type { RaceDateTime } from './data/common/raceDateTime';
import type { RaceId } from './data/common/raceId';
import type { RaceNumber } from './data/common/raceNumber';
import type { RacePlayerId } from './data/common/racePlayerId';
import { NetkeibaBabacodeMap } from './data/netkeiba';
import type { WorldRaceNumber } from './data/world/worldRaceNumber';
import { RaceType } from './raceType';

/**
 * 中央競馬のraceIdを作成する
 * @param dateTime - 開催日時
 * @param location - 開催場所
 * @param number - レース番号
 */
export const generateJraRaceId = (
    dateTime: Date,
    location: RaceCourse,
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
    location: RaceCourse,
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
    location: RaceCourse,
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
    location: RaceCourse,
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
    location: RaceCourse,
    number: WorldRaceNumber,
): RaceId => {
    const numberCode = number.toXDigits(2);
    return `${generatePlaceId(
        RaceType.WORLD,
        dateTime,
        location,
    )}${numberCode}`;
};

/**
 * racePlayerIdを作成する
 * @param raceType - レース種別
 * @param dateTime - 開催日時
 * @param location - 開催場所
 * @param number - レース番号
 * @param positionNumber - 枠番
 */
export const generateRacePlayerId = (
    raceType: RaceType,
    dateTime: Date,
    location: RaceCourse,
    number: RaceNumber,
    positionNumber: PositionNumber,
): RacePlayerId => {
    const positionNumberCode = positionNumber.toXDigits(2);
    return `${generateRaceId(raceType, dateTime, location, number)}${positionNumberCode}`;
};

/**
 * raceIdを作成する
 * @param raceType - レース種別
 * @param dateTime - 開催日時
 * @param location - 開催場所
 * @param number - レース番号
 */
export const generateRaceId = (
    raceType: RaceType,
    dateTime: Date,
    location: RaceCourse,
    number: RaceNumber,
): RaceId => {
    const numberCode = number.toXDigits(2);
    return `${generatePlaceId(raceType, dateTime, location)}${numberCode}`;
};

/**
 * placeIdを作成する
 * @param raceType - レース種別
 * @param dateTime - 開催日時
 * @param location - 開催場所
 */
export const generatePlaceId = (
    raceType: RaceType,
    dateTime: Date,
    location: RaceCourse,
): PlaceId => {
    const dateCode = format(dateTime, 'yyyyMMdd');
    const locationCode = createPlaceCodeMap(raceType)[location];
    const raceTypePrefix = raceType.toLowerCase();
    return `${raceTypePrefix}${dateCode}${locationCode}`;
};
