import 'reflect-metadata';

import { container } from 'tsyringe';

import { SearchCalendarFilterEntityForAWS } from '../../../../../../lib/src/repository/entity/searchCalendarFilterEntity';
import { GoogleCalendarRepositoryForAWS } from '../../../../../../lib/src/repository/implement/googleCalendarRepository';
import type { ICalendarRepositoryForAWS } from '../../../../../../lib/src/repository/interface/ICalendarRepositoryForAWS';
import {
    baseCalendarData,
    baseCalendarDataFromGoogleCalendar,
    baseRaceEntityList,
    mockCalendarDataList,
    mockRaceEntityList,
    testRaceTypeListAll,
} from '../../../../../unittest/src/mock/common/baseCommonData';
import type { TestGatewaySetup } from '../../../../../utility/testSetupHelper';
import {
    clearMocks,
    setupTestGatewayMock,
} from '../../../../../utility/testSetupHelper';

describe('GoogleCalendarRepository', () => {
    let repository: ICalendarRepositoryForAWS;
    let gatewaySetup: TestGatewaySetup;

    beforeEach(() => {
        gatewaySetup = setupTestGatewayMock();
        repository = container.resolve(GoogleCalendarRepositoryForAWS);
    });

    afterEach(() => {
        clearMocks();
    });

    it('カレンダー情報が正常に取得できること', async () => {
        const searchFilter = new SearchCalendarFilterEntityForAWS(
            new Date('2023-01-01'),
            new Date('2023-12-31'),
            testRaceTypeListAll,
        );
        const calendarDataList = await repository.getEvents(searchFilter);

        expect(calendarDataList).toHaveLength(testRaceTypeListAll.length);
        // calendarDataListの中に、baseAutoraceCalendarDataが含まれていることを確認
        for (const data of mockCalendarDataList) {
            expect(calendarDataList).toContainEqual(data);
        }

        expect(
            gatewaySetup.googleCalendarGateway.fetchCalendarDataList,
        ).toHaveBeenCalled();
    });

    it('カレンダー情報が正常に取得できないこと', async () => {
        gatewaySetup.googleCalendarGateway.fetchCalendarDataList.mockRejectedValue(
            new Error('API Error'),
        );

        const searchFilter = new SearchCalendarFilterEntityForAWS(
            new Date('2023-01-01'),
            new Date('2023-12-31'),
            testRaceTypeListAll,
        );
        const calendarDataList = await repository.getEvents(searchFilter);

        expect(calendarDataList).toHaveLength(0);
        expect(
            gatewaySetup.googleCalendarGateway.fetchCalendarDataList,
        ).toHaveBeenCalled();
    });

    it('カレンダー情報が正常に削除できること', async () => {
        gatewaySetup.googleCalendarGateway.deleteCalendarData.mockResolvedValue();

        await repository.deleteEvents(mockCalendarDataList);
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

        await repository.deleteEvents(calendarDataList);
        expect(
            gatewaySetup.googleCalendarGateway.deleteCalendarData,
        ).toHaveBeenCalled();
    });

    it('カレンダー情報が正常に登録できること', async () => {
        gatewaySetup.googleCalendarGateway.fetchCalendarData.mockRejectedValue(
            new Error('API Error'),
        );
        await repository.upsertEvents(mockRaceEntityList);

        expect(
            gatewaySetup.googleCalendarGateway.insertCalendarData,
        ).toHaveBeenCalled();
    });

    test.each(testRaceTypeListAll)(
        'カレンダー情報が正常に更新できること(%s)',
        async (raceType) => {
            gatewaySetup.googleCalendarGateway.fetchCalendarData.mockResolvedValue(
                baseCalendarDataFromGoogleCalendar(raceType),
            );

            await repository.upsertEvents(baseRaceEntityList(raceType));

            expect(
                gatewaySetup.googleCalendarGateway.updateCalendarData,
            ).toHaveBeenCalled();
        },
    );

    it('カレンダー情報が正常に更新できないこと', async () => {
        gatewaySetup.googleCalendarGateway.insertCalendarData.mockRejectedValue(
            new Error('API Error'),
        );
        await repository.upsertEvents(mockRaceEntityList);

        expect(
            gatewaySetup.googleCalendarGateway.insertCalendarData,
        ).toHaveBeenCalled();
    });
});
