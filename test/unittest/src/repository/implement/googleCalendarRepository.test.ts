import 'reflect-metadata';

import { container } from 'tsyringe';

import type { ICalendarGateway } from '../../../../../lib/src/gateway/interface/iCalendarGateway';
import { SearchCalendarFilterEntity } from '../../../../../lib/src/repository/entity/searchCalendarFilterEntity';
import { GoogleCalendarRepository } from '../../../../../lib/src/repository/implement/googleCalendarRepository';
import type { ICalendarRepository } from '../../../../../lib/src/repository/interface/ICalendarRepository';
import type { RaceType } from '../../../../../lib/src/utility/raceType';
import type { TestGatewaySetup } from '../../../../utility/testSetupHelper';
import { setupTestGatewayMock } from '../../../../utility/testSetupHelper';
import {
    baseCalendarData,
    baseCalendarDataFromGoogleCalendar,
    baseRaceEntity,
    baseRaceEntityList,
    mockCalendarDataList,
    testRaceTypeListAll,
} from '../../mock/common/baseCommonData';

describe('GoogleCalendarRepository', () => {
    let repository: ICalendarRepository;
    let googleCalendarGateway: jest.Mocked<ICalendarGateway>;

    beforeEach(() => {
        const setup: TestGatewaySetup = setupTestGatewayMock();
        ({ googleCalendarGateway } = setup);

        repository = container.resolve(GoogleCalendarRepository);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('カレンダー情報が正常に取得できること', async () => {
        googleCalendarGateway.fetchCalendarDataList.mockImplementation(
            async (raceType: RaceType) => {
                return [baseCalendarDataFromGoogleCalendar(raceType)];
            },
        );
        const searchFilter = new SearchCalendarFilterEntity(
            new Date('2023-01-01'),
            new Date('2023-12-31'),
        );
        const calendarDataList = await repository.getEvents(
            testRaceTypeListAll,
            searchFilter,
        );

        expect(calendarDataList).toHaveLength(testRaceTypeListAll.length);
        // calendarDataListの中に、baseAutoraceCalendarDataが含まれていることを確認
        for (const data of mockCalendarDataList) {
            expect(calendarDataList).toContainEqual(data);
        }

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
        const calendarDataList = await repository.getEvents(
            testRaceTypeListAll,
            searchFilter,
        );

        expect(calendarDataList).toHaveLength(0);
        expect(googleCalendarGateway.fetchCalendarDataList).toHaveBeenCalled();
    });

    test.each(testRaceTypeListAll)(
        'カレンダー情報が正常に削除できること(%s)',
        async (raceType) => {
            googleCalendarGateway.deleteCalendarData.mockResolvedValue();

            await repository.deleteEvents([baseCalendarData(raceType)]);
            expect(googleCalendarGateway.deleteCalendarData).toHaveBeenCalled();
        },
    );

    test.each(testRaceTypeListAll)(
        'カレンダー情報が正常に削除できないこと(%s)',
        async (raceType) => {
            googleCalendarGateway.deleteCalendarData.mockRejectedValue(
                new Error('API Error'),
            );

            await repository.deleteEvents([baseCalendarData(raceType)]);
            expect(googleCalendarGateway.deleteCalendarData).toHaveBeenCalled();
        },
    );

    test.each(testRaceTypeListAll)(
        'カレンダー情報が正常に登録できること(%s)',
        async (raceType) => {
            googleCalendarGateway.fetchCalendarData.mockRejectedValue(
                new Error('API Error'),
            );

            await repository.upsertEvents([baseRaceEntity(raceType)]);

            expect(googleCalendarGateway.insertCalendarData).toHaveBeenCalled();
        },
    );

    test.each(testRaceTypeListAll)(
        'カレンダー情報が正常に更新できること(%s)',
        async (raceType) => {
            googleCalendarGateway.fetchCalendarData.mockResolvedValue(
                baseCalendarDataFromGoogleCalendar(raceType),
            );

            await repository.upsertEvents(baseRaceEntityList(raceType));

            expect(googleCalendarGateway.updateCalendarData).toHaveBeenCalled();
        },
    );

    test.each(testRaceTypeListAll)(
        'カレンダー情報が正常に更新できないこと(%s)',
        async (raceType) => {
            googleCalendarGateway.insertCalendarData.mockRejectedValue(
                new Error('API Error'),
            );
            await repository.upsertEvents(baseRaceEntityList(raceType));

            expect(googleCalendarGateway.insertCalendarData).toHaveBeenCalled();
        },
    );
});
