import 'reflect-metadata';

import { container } from 'tsyringe';

import type { ICalendarGateway } from '../../../../lib/src/gateway/interface/iCalendarGateway';
import { SearchCalendarFilterEntity } from '../../../../lib/src/repository/entity/searchCalendarFilterEntity';
import { WorldGoogleCalendarRepositoryImpl } from '../../../../lib/src/repository/implement/worldGoogleCalendarRepositoryImpl';
import {
    baseWorldCalendarData,
    baseWorldCalendarDataFromGoogleCalendar,
    baseWorldRaceEntity,
} from '../../mock/common/baseWorldData';
import { mockGoogleCalendarGateway } from '../../mock/gateway/mockGoogleCalendarGateway';

describe('WorldGoogleCalendarRepositoryImpl', () => {
    let repository: WorldGoogleCalendarRepositoryImpl;
    let googleCalendarGateway: jest.Mocked<ICalendarGateway>;

    beforeEach(() => {
        googleCalendarGateway = mockGoogleCalendarGateway();
        container.registerInstance(
            'WorldGoogleCalendarGateway',
            googleCalendarGateway,
        );
        repository = container.resolve(WorldGoogleCalendarRepositoryImpl);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should fetch events successfully', async () => {
        googleCalendarGateway.fetchCalendarDataList.mockResolvedValue([
            baseWorldCalendarDataFromGoogleCalendar,
        ]);

        const searchFilter = new SearchCalendarFilterEntity(
            new Date('2023-01-01'),
            new Date('2023-12-31'),
        );
        const calendarDataList = await repository.getEvents(searchFilter);

        expect(calendarDataList).toHaveLength(1);
        expect(calendarDataList[0]).toEqual(baseWorldCalendarData);
        expect(googleCalendarGateway.fetchCalendarDataList).toHaveBeenCalled();
    });

    it('should handle error when fetching events', async () => {
        googleCalendarGateway.fetchCalendarDataList.mockRejectedValue(
            new Error('API Error'),
        );

        const searchFilter = new SearchCalendarFilterEntity(
            new Date('2023-01-01'),
            new Date('2023-12-31'),
        );
        const calendarDataList = await repository.getEvents(searchFilter);

        expect(calendarDataList).toHaveLength(0);
        expect(googleCalendarGateway.fetchCalendarDataList).toHaveBeenCalled();
    });

    it('should delete events successfully', async () => {
        googleCalendarGateway.deleteCalendarData.mockResolvedValue();

        const calendarDataList = [baseWorldCalendarData];
        await repository.deleteEvents(calendarDataList);

        expect(googleCalendarGateway.deleteCalendarData).toHaveBeenCalled();
    });

    it('should handle error when deleting events', async () => {
        googleCalendarGateway.deleteCalendarData.mockRejectedValue(
            new Error('API Error'),
        );

        const calendarDataList = [baseWorldCalendarData];

        await repository.deleteEvents(calendarDataList);
        expect(googleCalendarGateway.deleteCalendarData).toHaveBeenCalled();
    });

    it('should insert events successfully', async () => {
        googleCalendarGateway.fetchCalendarData.mockRejectedValue(
            new Error('API Error'),
        );
        await repository.upsertEvents([baseWorldRaceEntity]);

        expect(googleCalendarGateway.insertCalendarData).toHaveBeenCalled();
    });

    it('should update events successfully', async () => {
        googleCalendarGateway.fetchCalendarData.mockResolvedValue(
            baseWorldCalendarDataFromGoogleCalendar,
        );

        await repository.upsertEvents([baseWorldRaceEntity]);

        expect(googleCalendarGateway.updateCalendarData).toHaveBeenCalled();
    });

    it('should handle error when upserting events', async () => {
        googleCalendarGateway.fetchCalendarData.mockRejectedValue(
            new Error('API Error'),
        );
        googleCalendarGateway.insertCalendarData.mockRejectedValue(
            new Error('API Error'),
        );

        await repository.upsertEvents([baseWorldRaceEntity]);
        expect(googleCalendarGateway.insertCalendarData).toHaveBeenCalled();
    });
});
