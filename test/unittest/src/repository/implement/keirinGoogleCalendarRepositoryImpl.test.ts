import 'reflect-metadata';

import { container } from 'tsyringe';

import type { ICalendarGateway } from '../../../../../lib/src/gateway/interface/iCalendarGateway';
import { SearchCalendarFilterEntity } from '../../../../../lib/src/repository/entity/searchCalendarFilterEntity';
import { KeirinGoogleCalendarRepositoryImpl } from '../../../../../lib/src/repository/implement/keirinGoogleCalendarRepositoryImpl';
import {
    baseKeirinCalendarData,
    baseKeirinCalendarDataFromGoogleCalendar,
    baseKeirinRaceEntity,
} from '../../mock/common/baseKeirinData';
import { mockGoogleCalendarGateway } from '../../mock/gateway/mockGoogleCalendarGateway';

describe('KeirinGoogleCalendarRepositoryImpl', () => {
    let repository: KeirinGoogleCalendarRepositoryImpl;
    let googleCalendarGateway: jest.Mocked<ICalendarGateway>;

    beforeEach(() => {
        googleCalendarGateway = mockGoogleCalendarGateway();
        container.registerInstance(
            'KeirinGoogleCalendarGateway',
            googleCalendarGateway,
        );
        repository = container.resolve(KeirinGoogleCalendarRepositoryImpl);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('カレンダー情報が正常に取得できること', async () => {
        googleCalendarGateway.fetchCalendarDataList.mockResolvedValue([
            baseKeirinCalendarDataFromGoogleCalendar,
        ]);

        const searchFilter = new SearchCalendarFilterEntity(
            new Date('2023-01-01'),
            new Date('2023-12-31'),
        );
        const calendarDataList = await repository.getEvents(searchFilter);

        expect(calendarDataList).toHaveLength(1);
        expect(calendarDataList[0]).toEqual(baseKeirinCalendarData);
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

        await repository.deleteEvents([baseKeirinCalendarData]);

        expect(googleCalendarGateway.deleteCalendarData).toHaveBeenCalled();
    });

    it('カレンダー情報が正常に削除できないこと', async () => {
        googleCalendarGateway.deleteCalendarData.mockRejectedValue(
            new Error('API Error'),
        );

        await repository.deleteEvents([baseKeirinCalendarData]);
        expect(googleCalendarGateway.deleteCalendarData).toHaveBeenCalled();
    });

    it('カレンダー情報が正常に登録できること', async () => {
        googleCalendarGateway.fetchCalendarData.mockRejectedValue(
            new Error('API Error'),
        );

        await repository.upsertEvents([baseKeirinRaceEntity]);

        expect(googleCalendarGateway.insertCalendarData).toHaveBeenCalled();
    });

    it('カレンダー情報が正常に更新できること', async () => {
        googleCalendarGateway.fetchCalendarData.mockResolvedValue(
            baseKeirinCalendarDataFromGoogleCalendar,
        );

        await repository.upsertEvents([baseKeirinRaceEntity]);

        expect(googleCalendarGateway.updateCalendarData).toHaveBeenCalled();
    });

    it('カレンダー情報が正常に更新できないこと', async () => {
        googleCalendarGateway.insertCalendarData.mockRejectedValue(
            new Error('API Error'),
        );

        await repository.upsertEvents([baseKeirinRaceEntity]);
        expect(googleCalendarGateway.insertCalendarData).toHaveBeenCalled();
    });
});
