import 'reflect-metadata';

import { container } from 'tsyringe';

import { SearchCalendarFilterEntity } from '../../../../../src/repository/entity/filter/searchCalendarFilterEntity';
import { GoogleCalendarRepository } from '../../../../../src/repository/implement/googleCalendarRepository';
import type { ICalendarRepository } from '../../../../../src/repository/interface/ICalendarRepository';
import type { TestGatewaySetup } from '../../../../utility/testSetupHelper';
import {
    clearMocks,
    setupTestGatewayMock,
} from '../../../../utility/testSetupHelper';
import {
    baseCalendarData,
    mockCalendarDataList,
    mockRaceEntityList,
    testRaceTypeListAll,
} from '../../mock/common/baseCommonData';
import { commonParameterMock } from './../../../../old/unittest/src/mock/common/commonParameterMock';

describe('GoogleCalendarRepository', () => {
    let repository: ICalendarRepository;
    let gatewaySetup: TestGatewaySetup;
    const commonParameter = commonParameterMock();

    beforeEach(() => {
        gatewaySetup = setupTestGatewayMock();
        repository = container.resolve(GoogleCalendarRepository);
    });

    afterEach(() => {
        clearMocks();
    });

    // it('カレンダー情報が正常に取得できること', async () => {
    //     const searchFilter = new SearchCalendarFilterEntity(
    //         new Date('2023-01-01'),
    //         new Date('2023-12-31'),
    //         testRaceTypeListAll,
    //     );
    //     const calendarDataList = await repository.getEvents(
    //         commonParameter,
    //         searchFilter,
    //     );

    //     expect(calendarDataList).toHaveLength(testRaceTypeListAll.length);
    //     expect(calendarDataList).toContainEqual(mockCalendarDataList);

    //     expect(
    //         gatewaySetup.googleCalendarGateway.fetchCalendarDataList,
    //     ).toHaveBeenCalled();
    // });

    it('カレンダー情報が正常に取得できないこと', async () => {
        gatewaySetup.googleCalendarGateway.fetchCalendarDataList.mockRejectedValue(
            new Error('API Error'),
        );

        const searchFilter = new SearchCalendarFilterEntity(
            new Date('2023-01-01'),
            new Date('2023-12-31'),
            testRaceTypeListAll,
        );
        const calendarDataList = await repository.getEvents(
            commonParameter,
            searchFilter,
        );

        expect(calendarDataList).toHaveLength(0);
        expect(
            gatewaySetup.googleCalendarGateway.fetchCalendarDataList,
        ).toHaveBeenCalled();
    });

    it('カレンダー情報が正常に削除できること', async () => {
        gatewaySetup.googleCalendarGateway.deleteCalendarData.mockResolvedValue();

        await repository.deleteEvents(commonParameter, mockCalendarDataList);
        expect(
            gatewaySetup.googleCalendarGateway.deleteCalendarData,
        ).toHaveBeenCalled();
    });

    it('カレンダー情報が正常に削除できないこと', async () => {
        gatewaySetup.googleCalendarGateway.deleteCalendarData.mockRejectedValue(
            new Error('API Error'),
        );

        const calendarDataList = testRaceTypeListAll.map((raceType) =>
            baseCalendarData(raceType),
        );

        await repository.deleteEvents(commonParameter, calendarDataList);
        expect(
            gatewaySetup.googleCalendarGateway.deleteCalendarData,
        ).toHaveBeenCalled();
    });

    it('カレンダー情報が正常に登録できること', async () => {
        gatewaySetup.googleCalendarGateway.fetchCalendarData.mockRejectedValue(
            new Error('API Error'),
        );
        await repository.upsertEvents(commonParameter, mockRaceEntityList);

        expect(
            gatewaySetup.googleCalendarGateway.insertCalendarData,
        ).toHaveBeenCalled();
    });

    // test.each(testRaceTypeListAll)(
    //     'カレンダー情報が正常に更新できること(%s)',
    //     async (raceType) => {
    //         gatewaySetup.googleCalendarGateway.fetchCalendarData.mockResolvedValue(
    //             baseCalendarDataFromGoogleCalendar(raceType),
    //         );

    //         await repository.upsertEvents(
    //             commonParameter,
    //             baseRaceEntityList(raceType),
    //         );

    //         expect(
    //             gatewaySetup.googleCalendarGateway.updateCalendarData,
    //         ).toHaveBeenCalled();
    //     },
    // );

    it('カレンダー情報が正常に更新できないこと', async () => {
        gatewaySetup.googleCalendarGateway.insertCalendarData.mockRejectedValue(
            new Error('API Error'),
        );
        await repository.upsertEvents(commonParameter, mockRaceEntityList);

        expect(
            gatewaySetup.googleCalendarGateway.insertCalendarData,
        ).toHaveBeenCalled();
    });
});
