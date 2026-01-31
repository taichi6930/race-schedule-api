import { generatePlaceId } from '@race-schedule/db/src/models/place.model';
import { generateRaceId } from '@race-schedule/db/src/models/race.model';
import type { RaceEntity } from '@race-schedule/shared/src/entity/raceEntity';
import type { RaceType } from '@race-schedule/shared/src/types/raceType';

import type { ScrapingRaceDto } from '../types/apiResponse';
import { getLocationCode } from './placeMasterMap';

/**
 * 日付をYYYY-MM-DD HH:MM:SS 形式に変換
 */
const formatDatetime = (datetime: Date | string): string => {
    const d = typeof datetime === 'string' ? new Date(datetime) : datetime;
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const hours = String(d.getHours()).padStart(2, '0');
    const mins = String(d.getMinutes()).padStart(2, '0');
    const secs = String(d.getSeconds()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${mins}:${secs}`;
};

/**
 * スクレイピングの RaceDto を API の RaceEntity に変換
 */
export const convertToRaceEntity = (dto: ScrapingRaceDto): RaceEntity => {
    const raceType = dto.raceType as RaceType;
    const datetime =
        typeof dto.datetime === 'string'
            ? new Date(dto.datetime)
            : dto.datetime;
    const locationCode = getLocationCode(raceType, dto.location);
    const formattedDatetime = formatDatetime(datetime);

    const placeId = generatePlaceId(raceType, formattedDatetime, locationCode);
    const raceId = generateRaceId(
        raceType,
        formattedDatetime,
        locationCode,
        dto.raceNumber,
    );

    return {
        raceId,
        placeId,
        raceType,
        datetime,
        locationCode,
        placeName: dto.location,
        raceNumber: dto.raceNumber,
        // Note: placeHeldDays はスクレイピングのRaceからは取得できない
        placeHeldDays: undefined,
    };
};

/**
 * 複数の RaceDto を RaceEntity に変換
 */
export const convertToRaceEntities = (
    dtos: ScrapingRaceDto[],
): RaceEntity[] => {
    return dtos.map((d) => convertToRaceEntity(d));
};
