import type { ICalendarGateway } from '../../../../../../src/gateway/interface/iCalendarGateway';
import type { RaceType } from '../../../../../../src/utility/raceType';
import { baseCalendarDataFromGoogleCalendar } from '../../../../../unittest/src/mock/common/baseCommonData';

export const mockGoogleCalendarGateway = (): jest.Mocked<ICalendarGateway> => {
    return {
        fetchCalendarDataList: jest
            .fn()
            .mockImplementation(
                async (_commonParameter, raceType: RaceType) => {
                    return [baseCalendarDataFromGoogleCalendar(raceType)];
                },
            ),
        fetchCalendarData: jest.fn(),
        insertCalendarData: jest.fn(),
        updateCalendarData: jest.fn(),
        deleteCalendarData: jest.fn(),
    };
};
