import 'reflect-metadata';

import { container } from 'tsyringe';

import type { IOldCalendarGateway } from '../../../../../lib/src/gateway/interface/iCalendarGateway';
import { SearchCalendarFilterEntity } from '../../../../../lib/src/repository/entity/searchCalendarFilterEntity';
import { BoatraceGoogleCalendarRepositoryImpl } from '../../../../../lib/src/repository/implement/boatraceGoogleCalendarRepositoryImpl';
import {
    baseBoatraceCalendarData,
    baseBoatraceCalendarDataFromGoogleCalendar,
    baseBoatraceRaceEntity,
} from '../../mock/common/baseBoatraceData';
import { mockGoogleCalendarGateway } from '../../mock/gateway/mockGoogleCalendarGateway';

describe('BoatraceGoogleCalendarRepositoryImpl', () => {
    let repository: BoatraceGoogleCalendarRepositoryImpl;
    let googleCalendarGateway: jest.Mocked<IOldCalendarGateway>;

    beforeEach(() => {
        googleCalendarGateway = mockGoogleCalendarGateway();
        container.registerInstance(
            'BoatraceGoogleCalendarGateway',
            googleCalendarGateway,
        );
        repository = container.resolve(BoatraceGoogleCalendarRepositoryImpl);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('カレンダー情報が正常に取得できること', async () => {
        googleCalendarGateway.fetchCalendarDataList.mockResolvedValue([
            baseBoatraceCalendarDataFromGoogleCalendar,
        ]);

        const searchFilter = new SearchCalendarFilterEntity(
            new Date('2023-01-01'),
            new Date('2023-12-31'),
        );
        const calendarDataList = await repository.getEvents(searchFilter);

        expect(calendarDataList).toHaveLength(1);
        expect(calendarDataList[0]).toEqual(baseBoatraceCalendarData);
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

        await repository.deleteEvents([baseBoatraceCalendarData]);

        expect(googleCalendarGateway.deleteCalendarData).toHaveBeenCalled();
    });

    it('カレンダー情報が正常に削除できないこと', async () => {
        googleCalendarGateway.deleteCalendarData.mockRejectedValue(
            new Error('API Error'),
        );

        await repository.deleteEvents([baseBoatraceCalendarData]);
        expect(googleCalendarGateway.deleteCalendarData).toHaveBeenCalled();
    });

    it('カレンダー情報が正常に登録できること', async () => {
        googleCalendarGateway.fetchCalendarData.mockRejectedValue(
            new Error('API Error'),
        );

        await repository.upsertEvents([baseBoatraceRaceEntity]);

        expect(googleCalendarGateway.insertCalendarData).toHaveBeenCalled();
    });

    it('カレンダー情報が正常に更新できること', async () => {
        googleCalendarGateway.fetchCalendarData.mockResolvedValue(
            baseBoatraceCalendarDataFromGoogleCalendar,
        );

        await repository.upsertEvents([baseBoatraceRaceEntity]);

        expect(googleCalendarGateway.updateCalendarData).toHaveBeenCalled();
    });

    it('カレンダー情報が正常に更新できないこと', async () => {
        googleCalendarGateway.insertCalendarData.mockRejectedValue(
            new Error('API Error'),
        );

        await repository.upsertEvents([baseBoatraceRaceEntity]);
        expect(googleCalendarGateway.insertCalendarData).toHaveBeenCalled();
    });
});
