import { format } from 'date-fns';

import type { AutoracePlaceId } from './data/autorace/autoracePlaceId';
import type { AutoraceRaceId } from './data/autorace/autoraceRaceId';
import type { AutoraceRaceNumber } from './data/autorace/autoraceRaceNumber';
import type { AutoraceRacePlayerId } from './data/autorace/autoraceRacePlayerId';
import type { BoatracePlaceId } from './data/boatrace/boatracePlaceId';
import type { BoatraceRaceId } from './data/boatrace/boatraceRaceId';
import type { BoatraceRacePlayerId } from './data/boatrace/boatraceRacePlayerId';
import type { AutoracePositionNumber } from './data/common/positionNumber';
import type { BoatracePositionNumber } from './data/common/positionNumber';
import type { KeirinPositionNumber } from './data/common/positionNumber';
import type { AutoraceRaceCourse } from './data/common/raceCourse';
import type { BoatraceRaceCourse } from './data/common/raceCourse';
import type { JraRaceCourse } from './data/common/raceCourse';
import type { KeirinRaceCourse } from './data/common/raceCourse';
import type { NarRaceCourse } from './data/common/raceCourse';
import type { WorldRaceCourse } from './data/common/raceCourse';
import { AutoracePlaceCodeMap } from './data/common/raceCourse';
import { BoatracePlaceCodeMap } from './data/common/raceCourse';
import { KeirinPlaceCodeMap } from './data/common/raceCourse';
import { WorldPlaceCodeMap } from './data/common/raceCourse';
import type { RaceDateTime } from './data/common/raceDateTime';
import type { RaceNumber } from './data/common/raceNumber';
import type { JraRaceId } from './data/jra/jraRaceId';
import type { JraRaceNumber } from './data/jra/jraRaceNumber';
import type { KeirinPlaceId } from './data/keirin/keirinPlaceId';
import type { KeirinRaceId } from './data/keirin/keirinRaceId';
import type { KeirinRaceNumber } from './data/keirin/keirinRaceNumber';
import type { KeirinRacePlayerId } from './data/keirin/keirinRacePlayerId';
import type { NarPlaceId } from './data/nar/narPlaceId';
import type { NarRaceId } from './data/nar/narRaceId';
import type { NarRaceNumber } from './data/nar/narRaceNumber';
import { NetkeibaBabacodeMap } from './data/netkeiba';
import type { WorldRaceId } from './data/world/worldRaceId';
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
    number: JraRaceNumber,
): JraRaceId => {
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
): JraRaceId => {
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
    number: NarRaceNumber,
): NarRaceId => {
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
): NarPlaceId => {
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
): WorldRaceId => {
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
): WorldRaceId => {
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
    number: KeirinRaceNumber,
    positionNumber: KeirinPositionNumber,
): KeirinRacePlayerId => {
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
    number: KeirinRaceNumber,
): KeirinRaceId => {
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
): KeirinPlaceId => {
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
): BoatraceRacePlayerId => {
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
): BoatraceRaceId => {
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
): BoatracePlaceId => {
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
    number: AutoraceRaceNumber,
    positionNumber: AutoracePositionNumber,
): AutoraceRacePlayerId => {
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
    number: AutoraceRaceNumber,
): AutoraceRaceId => {
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
): AutoracePlaceId => {
    const dateCode = format(dateTime, 'yyyyMMdd');
    const locationCode = AutoracePlaceCodeMap[location];
    return `autorace${dateCode}${locationCode}`;
};
