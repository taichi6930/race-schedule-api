import type { IGoogleCalendarGateway } from '../../../../../packages/api/src/gateway/interface/iGoogleCalendarGateway';
import type { RaceType } from '../../../../../packages/shared/src/types/raceType';
import { baseCalendarDataFromGoogleCalendar } from '../common/baseCommonData';

export const mockGoogleCalendarGateway =
    (): jest.Mocked<IGoogleCalendarGateway> => {
        return {
            fetchCalendarDataList: jest
                .fn()
                .mockImplementation(async (raceType: RaceType) => {
                    return [baseCalendarDataFromGoogleCalendar(raceType)];
                }),
            fetchCalendarData: jest.fn(),
            insertCalendarData: jest.fn(),
            updateCalendarData: jest.fn(),
            deleteCalendarData: jest.fn(),
        };
    };
