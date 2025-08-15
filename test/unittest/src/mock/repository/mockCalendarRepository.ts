import type { CalendarData } from '../../../../../lib/src/domain/calendarData';
import type { ICalendarRepository } from '../../../../../lib/src/repository/interface/ICalendarRepository';
import { RaceType } from '../../../../../lib/src/utility/raceType';
import { baseAutoraceCalendarData } from '../common/baseAutoraceData';
import { baseBoatraceCalendarData } from '../common/baseBoatraceData';
import { baseJraCalendarData } from '../common/baseJraData';
import { baseKeirinCalendarData } from '../common/baseKeirinData';
import { baseNarCalendarData } from '../common/baseNarData';
import { baseWorldCalendarData } from '../common/baseWorldData';

export const mockCalendarRepository = (): jest.Mocked<ICalendarRepository> => {
    return {
        getEvents: jest
            .fn()
            .mockImplementation(async (raceTypeList: RaceType[]) => {
                const CalendarDataList: CalendarData[] = [];
                if (raceTypeList.includes(RaceType.JRA)) {
                    CalendarDataList.push(baseJraCalendarData);
                }
                if (raceTypeList.includes(RaceType.NAR)) {
                    CalendarDataList.push(baseNarCalendarData);
                }
                if (raceTypeList.includes(RaceType.OVERSEAS)) {
                    CalendarDataList.push(baseWorldCalendarData);
                }
                if (raceTypeList.includes(RaceType.KEIRIN)) {
                    CalendarDataList.push(baseKeirinCalendarData);
                }
                if (raceTypeList.includes(RaceType.BOATRACE)) {
                    CalendarDataList.push(baseBoatraceCalendarData);
                }
                if (raceTypeList.includes(RaceType.AUTORACE)) {
                    CalendarDataList.push(baseAutoraceCalendarData);
                }
                return CalendarDataList;
            }),
        upsertEvents: jest.fn(),
        deleteEvents: jest.fn(),
    };
};
