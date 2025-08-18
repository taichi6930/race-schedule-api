import { format } from 'date-fns';
import { z } from 'zod';

import { RaceType } from '../../raceType';
import { NetkeibaBabacodeMap } from '../netkeiba';
import { createPlaceCodeMap, type RaceCourse } from './raceCourse';


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


const PlaceIdSchema = (raceType: RaceType): z.ZodString => {
    const lowerCaseRaceType = raceType.toLowerCase();
    return z
        .string()
        .refine((value) => {
            return value.startsWith(lowerCaseRaceType);
        }, `${lowerCaseRaceType}から始まる必要があります`)
        .refine((value) => {
            return new RegExp(`^${lowerCaseRaceType}\\d{10}$`).test(value);
        }, `${lowerCaseRaceType}PlaceIdの形式ではありません`);
};


export type PlaceId = z.infer<typeof UnionPlaceIdSchema>;


export const validatePlaceId = (raceType: RaceType, value: string): PlaceId =>
    PlaceIdSchema(raceType).parse(value);


export const UnionPlaceIdSchema = z.union([
    PlaceIdSchema(RaceType.JRA),
    PlaceIdSchema(RaceType.NAR),
    PlaceIdSchema(RaceType.OVERSEAS),
    PlaceIdSchema(RaceType.KEIRIN),
    PlaceIdSchema(RaceType.AUTORACE),
    PlaceIdSchema(RaceType.BOATRACE),
]);
