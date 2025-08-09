import 'reflect-metadata';

import { container } from 'tsyringe';

import type { IOldCalendarGateway } from '../../../../../lib/src/gateway/interface/iCalendarGateway';
import { SearchCalendarFilterEntity } from '../../../../../lib/src/repository/entity/searchCalendarFilterEntity';
import { AutoraceGoogleCalendarRepositoryImpl } from '../../../../../lib/src/repository/implement/autoraceGoogleCalendarRepositoryImpl';
import {
    baseAutoraceCalendarData,
    baseAutoraceCalendarDataFromGoogleCalendar,
    baseAutoraceRaceEntity,
} from '../../mock/common/baseAutoraceData';
import { mockOldGoogleCalendarGateway } from '../../mock/gateway/mockGoogleCalendarGateway';

let repository: AutoraceGoogleCalendarRepositoryImpl;
let googleCalendarGateway: jest.Mocked<IOldCalendarGateway>;

beforeEach(() => {
    googleCalendarGateway = mockOldGoogleCalendarGateway();
    container.registerInstance(
        'AutoraceGoogleCalendarGateway',
        googleCalendarGateway,
    );
    repository = container.resolve(AutoraceGoogleCalendarRepositoryImpl);
});

afterEach(() => {
    jest.clearAllMocks();
});

it('カレンダー情報が正常に取得できること', async () => {
    googleCalendarGateway.fetchCalendarDataList.mockResolvedValue([
        baseAutoraceCalendarDataFromGoogleCalendar,
    ]);

    const searchFilter = new SearchCalendarFilterEntity(
        new Date('2023-01-01'),
        new Date('2023-12-31'),
    );
    const calendarDataList = await repository.getEvents(searchFilter);

    expect(calendarDataList).toHaveLength(1);
    expect(calendarDataList[0]).toEqual(baseAutoraceCalendarData);
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

    await repository.deleteEvents([baseAutoraceCalendarData]);

    expect(googleCalendarGateway.deleteCalendarData).toHaveBeenCalled();
});

it('カレンダー情報が正常に削除できないこと', async () => {
    googleCalendarGateway.deleteCalendarData.mockRejectedValue(
        new Error('API Error'),
    );

    await repository.deleteEvents([baseAutoraceCalendarData]);
    expect(googleCalendarGateway.deleteCalendarData).toHaveBeenCalled();
});

it('カレンダー情報が正常に登録できること', async () => {
    googleCalendarGateway.fetchCalendarData.mockRejectedValue(
        new Error('API Error'),
    );

    await repository.upsertEvents([baseAutoraceRaceEntity]);

    expect(googleCalendarGateway.insertCalendarData).toHaveBeenCalled();
});

it('カレンダー情報が正常に更新できること', async () => {
    googleCalendarGateway.fetchCalendarData.mockResolvedValue(
        baseAutoraceCalendarDataFromGoogleCalendar,
    );

    await repository.upsertEvents([baseAutoraceRaceEntity]);

    expect(googleCalendarGateway.updateCalendarData).toHaveBeenCalled();
});

it('カレンダー情報が正常に更新できないこと', async () => {
    googleCalendarGateway.insertCalendarData.mockRejectedValue(
        new Error('API Error'),
    );

    await repository.upsertEvents([baseAutoraceRaceEntity]);
    expect(googleCalendarGateway.insertCalendarData).toHaveBeenCalled();
});
