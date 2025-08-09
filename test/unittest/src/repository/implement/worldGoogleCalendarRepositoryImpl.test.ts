import 'reflect-metadata';

import { container } from 'tsyringe';

import type { IOldCalendarGateway } from '../../../../../lib/src/gateway/interface/iCalendarGateway';
import { SearchCalendarFilterEntity } from '../../../../../lib/src/repository/entity/searchCalendarFilterEntity';
import { WorldGoogleCalendarRepositoryImpl } from '../../../../../lib/src/repository/implement/worldGoogleCalendarRepositoryImpl';
import {
    baseWorldCalendarData,
    baseWorldCalendarDataFromGoogleCalendar,
    baseWorldRaceEntity,
} from '../../mock/common/baseWorldData';
import { mockGoogleCalendarGateway } from '../../mock/gateway/mockGoogleCalendarGateway';

describe('WorldGoogleCalendarRepositoryImpl', () => {
    let repository: WorldGoogleCalendarRepositoryImpl;
    let googleCalendarGateway: jest.Mocked<IOldCalendarGateway>;

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

    it('カレンダー情報が正常に取得できること', async () => {
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

    it('カレンダー情報が正常に取得できないこと', async () => {
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

    it('カレンダー情報が正常に削除できること', async () => {
        googleCalendarGateway.deleteCalendarData.mockResolvedValue();

        const calendarDataList = [baseWorldCalendarData];
        await repository.deleteEvents(calendarDataList);

        expect(googleCalendarGateway.deleteCalendarData).toHaveBeenCalled();
    });

    it('カレンダー情報が正常に削除できないこと', async () => {
        googleCalendarGateway.deleteCalendarData.mockRejectedValue(
            new Error('API Error'),
        );

        const calendarDataList = [baseWorldCalendarData];

        await repository.deleteEvents(calendarDataList);
        expect(googleCalendarGateway.deleteCalendarData).toHaveBeenCalled();
    });

    it('カレンダー情報が正常に登録できること', async () => {
        googleCalendarGateway.fetchCalendarData.mockRejectedValue(
            new Error('API Error'),
        );
        await repository.upsertEvents([baseWorldRaceEntity]);

        expect(googleCalendarGateway.insertCalendarData).toHaveBeenCalled();
    });

    it('カレンダー情報が正常に更新できること', async () => {
        googleCalendarGateway.fetchCalendarData.mockResolvedValue(
            baseWorldCalendarDataFromGoogleCalendar,
        );

        await repository.upsertEvents([baseWorldRaceEntity]);

        expect(googleCalendarGateway.updateCalendarData).toHaveBeenCalled();
    });

    it('カレンダー情報が正常に更新できないこと', async () => {
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
