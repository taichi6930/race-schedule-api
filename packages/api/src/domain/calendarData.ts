import { z } from 'zod';

import type { RaceType } from '../../../shared/src/types/raceType';
import { RaceType as RaceTypeConst } from '../../../shared/src/types/raceType';

/**
 * API 向け CalendarData DTO
 */
export interface CalendarDataDto {
    id: string;
    raceType: RaceType;
    title: string;
    // ISO 8601 文字列を想定
    startTime: string;
    endTime: string;
    location: string;
    description: string;
}

const RaceTypeSchema = z.union([
    z.literal(RaceTypeConst.JRA),
    z.literal(RaceTypeConst.NAR),
    z.literal(RaceTypeConst.KEIRIN),
    z.literal(RaceTypeConst.OVERSEAS),
    z.literal(RaceTypeConst.AUTORACE),
    z.literal(RaceTypeConst.BOATRACE),
]);

export const CalendarDataSchema = z.object({
    id: z.string(),
    raceType: RaceTypeSchema,
    title: z.string(),
    startTime: z.string(),
    endTime: z.string(),
    location: z.string(),
    description: z.string(),
});

export const validateCalendarData = (input: unknown): CalendarDataDto =>
    CalendarDataSchema.parse(input) as CalendarDataDto;

export default CalendarDataSchema;
