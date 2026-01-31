import { generatePlaceId } from '@race-schedule/db/src/models/place.model';
import type { PlaceEntity } from '@race-schedule/shared/src/entity/placeEntity';
import type { RaceType } from '@race-schedule/shared/src/types/raceType';

import type { ScrapingPlaceDto } from '../types/apiResponse';
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
 * スクレイピングの PlaceDto を API の PlaceEntity に変換
 */
export const convertToPlaceEntity = (dto: ScrapingPlaceDto): PlaceEntity => {
    const raceType = dto.raceType as RaceType;
    const datetime =
        typeof dto.datetime === 'string'
            ? new Date(dto.datetime)
            : dto.datetime;
    const locationCode = getLocationCode(raceType, dto.placeName);
    const formattedDatetime = formatDatetime(datetime);

    const placeId = generatePlaceId(raceType, formattedDatetime, locationCode);

    return {
        placeId,
        raceType,
        datetime,
        locationCode,
        placeName: dto.placeName,
        placeGrade: dto.placeGrade,
        placeHeldDays: dto.placeHeldDays,
    };
};

/**
 * 複数の PlaceDto を PlaceEntity に変換
 */
export const convertToPlaceEntities = (
    dtos: ScrapingPlaceDto[],
): PlaceEntity[] => {
    return dtos.map((d) => convertToPlaceEntity(d));
};
