import type { CalendarData } from '../../../../lib/src/domain/calendarData';
import type { JraRaceData } from '../../../../lib/src/domain/jraRaceData';
import type { NarRaceData } from '../../../../lib/src/domain/narRaceData';
import type { ICalendarService } from '../../../../lib/src/service/interface/ICalendarService';

/**
 * CalendarServiceのモックを作成する
 * @returns
 */
export const JraCalendarServiceMock = (): jest.Mocked<
    ICalendarService<JraRaceData>
> => {
    return {
        getEvents: jest.fn().mockResolvedValue([] as CalendarData[]),
        upsertEvents: jest.fn().mockResolvedValue(undefined),
        cleansingEvents: jest.fn().mockResolvedValue(undefined),
    };
};

/**
 * CalendarServiceのモックを作成する
 * @returns
 */
export const NarCalendarServiceMock = (): jest.Mocked<
    ICalendarService<NarRaceData>
> => {
    return {
        getEvents: jest.fn().mockResolvedValue([] as CalendarData[]),
        upsertEvents: jest.fn().mockResolvedValue(undefined),
        cleansingEvents: jest.fn().mockResolvedValue(undefined),
    };
};
