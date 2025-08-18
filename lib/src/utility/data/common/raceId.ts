import { z } from 'zod';

import { RaceType } from '../../raceType';
import { generatePlaceId } from './placeId';
import type { RaceCourse } from './raceCourse';
import { type RaceNumber, validateRaceNumber } from './raceNumber';



export const generateRaceId = (
    raceType: RaceType,
    dateTime: Date,
    location: RaceCourse,
    number: RaceNumber,
): RaceId => {
    const numberCode = number.toXDigits(2);
    return `${generatePlaceId(raceType, dateTime, location)}${numberCode}`;
};


const RaceIdSchema = (raceType: RaceType): z.ZodString => {
    const lowerCaseRaceType = raceType.toLowerCase();
    return (
        z
            .string()
            .refine((value) => {
                return value.startsWith(lowerCaseRaceType);
            }, `${lowerCaseRaceType}から始まる必要があります`)
            
            .refine((value) => {
                return new RegExp(`^${lowerCaseRaceType}\\d{12}$`).test(value);
            }, `${lowerCaseRaceType}RaceIdの形式ではありません`)
            
            .refine((value) => {
                const raceNumber = Number.parseInt(value.slice(-2));
                try {
                    validateRaceNumber(raceNumber);
                    return true;
                } catch {
                    return false;
                }
            }, 'レース番号は1~12の範囲である必要があります')
    );
};


export type RaceId = z.infer<typeof UnionRaceIdSchema>;


export const validateRaceId = (raceType: RaceType, value: string): RaceId =>
    RaceIdSchema(raceType).parse(value);


export const UnionRaceIdSchema = z.union([
    RaceIdSchema(RaceType.JRA),
    RaceIdSchema(RaceType.NAR),
    RaceIdSchema(RaceType.OVERSEAS),
    RaceIdSchema(RaceType.KEIRIN),
    RaceIdSchema(RaceType.AUTORACE),
    RaceIdSchema(RaceType.BOATRACE),
]);
