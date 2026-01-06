import type { RaceType } from '../../../../../packages/shared/src/types/raceType';
import type { IOldGoogleCalendarGateway } from '../../../../../src/gateway/interface/iGoogleCalendarGateway';
import { baseCalendarDataFromGoogleCalendar } from '../common/baseCommonData';

export const mockGoogleCalendarGateway =
    (): jest.Mocked<IOldGoogleCalendarGateway> => {
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
