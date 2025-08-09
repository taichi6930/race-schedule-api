import 'reflect-metadata';

import { container } from 'tsyringe';

import type { IOldCalendarGateway } from '../../../../../lib/src/gateway/interface/iCalendarGateway';
import { SearchCalendarFilterEntity } from '../../../../../lib/src/repository/entity/searchCalendarFilterEntity';
import { JraGoogleCalendarRepositoryImpl } from '../../../../../lib/src/repository/implement/jraGoogleCalendarRepositoryImpl';
import {
    baseJraCalendarData,
    baseJraCalendarDataFromGoogleCalendar,
    baseJraRaceEntity,
} from '../../mock/common/baseJraData';
import { mockGoogleCalendarGateway } from '../../mock/gateway/mockGoogleCalendarGateway';

describe('JraGoogleCalendarRepositoryImpl', () => {
    let repository: JraGoogleCalendarRepositoryImpl;
    let googleCalendarGateway: jest.Mocked<IOldCalendarGateway>;

    beforeEach(() => {
        googleCalendarGateway = mockGoogleCalendarGateway();
        container.registerInstance(
            'JraGoogleCalendarGateway',
            googleCalendarGateway,
        );
        repository = container.resolve(JraGoogleCalendarRepositoryImpl);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('カレンダー情報が正常に取得できること', async () => {
        googleCalendarGateway.fetchCalendarDataList.mockResolvedValue([
            baseJraCalendarDataFromGoogleCalendar,
        ]);

        const searchFilter = new SearchCalendarFilterEntity(
            new Date('2023-01-01'),
            new Date('2023-12-31'),
        );
        const calendarDataList = await repository.getEvents(searchFilter);

        expect(calendarDataList).toHaveLength(1);
        expect(calendarDataList[0]).toEqual(baseJraCalendarData);
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

        await repository.deleteEvents([baseJraCalendarData]);

        expect(googleCalendarGateway.deleteCalendarData).toHaveBeenCalled();
    });

    it('カレンダー情報が正常に削除できないこと', async () => {
        googleCalendarGateway.deleteCalendarData.mockRejectedValue(
            new Error('API Error'),
        );

        await repository.deleteEvents([baseJraCalendarData]);
        expect(googleCalendarGateway.deleteCalendarData).toHaveBeenCalled();
    });

    it('カレンダー情報が正常に登録できること', async () => {
        googleCalendarGateway.fetchCalendarData.mockRejectedValue(
            new Error('API Error'),
        );

        await repository.upsertEvents([baseJraRaceEntity]);

        expect(googleCalendarGateway.insertCalendarData).toHaveBeenCalled();
    });

    it('カレンダー情報が正常に更新できること', async () => {
        googleCalendarGateway.fetchCalendarData.mockResolvedValue(
            baseJraCalendarDataFromGoogleCalendar,
        );

        await repository.upsertEvents([baseJraRaceEntity]);

        expect(googleCalendarGateway.updateCalendarData).toHaveBeenCalled();
    });

    it('カレンダー情報が正常に更新できないこと', async () => {
        googleCalendarGateway.insertCalendarData.mockRejectedValue(
            new Error('API Error'),
        );

        await repository.upsertEvents([baseJraRaceEntity]);
        expect(googleCalendarGateway.insertCalendarData).toHaveBeenCalled();
    });
});
