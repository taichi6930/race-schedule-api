import { format } from 'date-fns';

import type { PlaceId } from './data/common/placeId';
import type { PositionNumber } from './data/common/positionNumber';
import type { RaceCourse } from './data/common/raceCourse';
import { createPlaceCodeMap } from './data/common/raceCourse';
import type { RaceId } from './data/common/raceId';
import type { RaceNumber } from './data/common/raceNumber';
import type { RacePlayerId } from './data/common/racePlayerId';
import { NetkeibaBabacodeMap } from './data/netkeiba';
import { RaceType } from './raceType';

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

    const locationCode =
        raceType === RaceType.JRA || raceType === RaceType.NAR
            ? NetkeibaBabacodeMap[location]
            : createPlaceCodeMap(raceType)[location];
    const raceTypePrefix = raceType.toLowerCase();
    return `${raceTypePrefix}${dateCode}${locationCode}`;
};
