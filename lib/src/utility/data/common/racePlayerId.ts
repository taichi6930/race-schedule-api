import { z } from 'zod';

import { RaceType } from '../../raceType';
import { type PositionNumber, validatePositionNumber } from './positionNumber';
import type { RaceCourse } from './raceCourse';
import { generateRaceId } from './raceId';
import { type RaceNumber, validateRaceNumber } from './raceNumber';



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


const RacePlayerIdSchema = (raceType: RaceType): z.ZodString => {
    const lowerCaseRaceType = raceType.toLowerCase();
    return (
        z
            .string()
            .refine((value) => {
                return value.startsWith(lowerCaseRaceType);
            }, `${lowerCaseRaceType}から始まる必要があります`)
            
            .refine((value) => {
                return new RegExp(`^${lowerCaseRaceType}\\d{14}$`).test(value);
            }, `${lowerCaseRaceType}RacePlayerIdの形式ではありません`)
            
            .refine((value) => {
                const raceNumber = Number.parseInt(value.slice(-4, -2));
                try {
                    validateRaceNumber(raceNumber);
                    return true;
                } catch {
                    return false;
                }
            }, 'レース番号は1~12の範囲である必要があります')
            
            .refine((value) => {
                const positionNumber = Number.parseInt(value.slice(-2));
                try {
                    validatePositionNumber(raceType, positionNumber);
                    return true;
                } catch {
                    return false;
                }
            }, '枠番が不正です')
    );
};


export type RacePlayerId = z.infer<typeof UnionRacePlayerIdSchema>;


export const validateRacePlayerId = (
    raceType: RaceType,
    value: string,
): RacePlayerId => RacePlayerIdSchema(raceType).parse(value);


export const UnionRacePlayerIdSchema = z.union([
    RacePlayerIdSchema(RaceType.KEIRIN),
    RacePlayerIdSchema(RaceType.AUTORACE),
    RacePlayerIdSchema(RaceType.BOATRACE),
]);
