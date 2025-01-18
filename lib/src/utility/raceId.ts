import { format } from 'date-fns';

import type { AutoracePlaceId } from './data/autorace/autoracePlaceId';
import type { AutoracePositionNumber } from './data/autorace/autoracePositionNumber';
import type { AutoraceRaceCourse } from './data/autorace/autoraceRaceCourse';
import { AUTORACE_PLACE_CODE } from './data/autorace/autoraceRaceCourse';
import type { AutoraceRaceId } from './data/autorace/autoraceRaceId';
import type { AutoraceRaceNumber } from './data/autorace/autoraceRaceNumber';
import type { AutoraceRacePlayerId } from './data/autorace/autoraceRacePlayerId';
import type { BoatracePlaceId } from './data/boatrace/boatracePlaceId';
import type { BoatracePositionNumber } from './data/boatrace/boatracePositionNumber';
import type { BoatraceRaceCourse } from './data/boatrace/boatraceRaceCourse';
import { BOATRACE_PLACE_CODE } from './data/boatrace/boatraceRaceCourse';
import type { BoatraceRaceId } from './data/boatrace/boatraceRaceId';
import type { BoatraceRaceNumber } from './data/boatrace/boatraceRaceNumber';
import type { BoatraceRacePlayerId } from './data/boatrace/boatraceRacePlayerId';
import type { JraRaceCourse } from './data/jra/jraRaceCourse';
import type { JraRaceId } from './data/jra/jraRaceId';
import type { JraRaceNumber } from './data/jra/jraRaceNumber';
import type { KeirinPlaceId } from './data/keirin/keirinPlaceId';
import type { KeirinPositionNumber } from './data/keirin/keirinPositionNumber';
import type { KeirinRaceCourse } from './data/keirin/keirinRaceCourse';
import { KEIRIN_PLACE_CODE } from './data/keirin/keirinRaceCourse';
import type { KeirinRaceId } from './data/keirin/keirinRaceId';
import type { KeirinRaceNumber } from './data/keirin/keirinRaceNumber';
import type { KeirinRacePlayerId } from './data/keirin/keirinRacePlayerId';
import type { NarPlaceId } from './data/nar/narPlaceId';
import type { NarRaceCourse } from './data/nar/narRaceCourse';
import type { NarRaceId } from './data/nar/narRaceId';
import type { NarRaceNumber } from './data/nar/narRaceNumber';
import { NETKEIBA_BABACODE } from './data/netkeiba';
import type { WorldRaceCourse } from './data/world/worldRaceCourse';
import { WorldPlaceCodeMap } from './data/world/worldRaceCourse';
import type { WorldRaceDateTime } from './data/world/worldRaceDateTime';
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
    const locationCode = NETKEIBA_BABACODE[location];
    return `jra${dateCode}${locationCode}`;
};

/**
 * 地方競馬のraceIdを作成する
 *
 * @private
 * @param dateTime - 開催日時
 * @param location - 開催場所
 * @param number - レース番号
 * @returns 生成されたID
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
 *
 * @private
 * @param dateTime - 開催日時
 * @param location - 開催場所
 * @returns 生成されたID
 */
export const generateNarPlaceId = (
    dateTime: Date,
    location: NarRaceCourse,
): NarPlaceId => {
    const dateCode = format(dateTime, 'yyyyMMdd');
    const locationCode = NETKEIBA_BABACODE[location];
    return `nar${dateCode}${locationCode}`;
};

/**
 * 海外競馬のraceIdを作成する
 * @param dateTime - 開催日時
 * @param location - 開催場所
 * @param number - レース番号
 */
export const generateWorldRaceId = (
    dateTime: WorldRaceDateTime,
    location: WorldRaceCourse,
    number: WorldRaceNumber,
): WorldRaceId => {
    const numberCode = number.toXDigits(2);
    return `${generateWorldPlaceId(dateTime, location)}${numberCode.toString()}`;
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
    const locationCode = KEIRIN_PLACE_CODE[location];
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
    number: BoatraceRaceNumber,
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
    number: BoatraceRaceNumber,
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
    const locationCode = BOATRACE_PLACE_CODE[location];
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
    const locationCode = AUTORACE_PLACE_CODE[location];
    return `autorace${dateCode}${locationCode}`;
};
