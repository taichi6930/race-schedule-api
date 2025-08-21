import 'reflect-metadata';

import { container } from 'tsyringe';

import type { ICalendarGateway } from '../../../../../lib/src/gateway/interface/iCalendarGateway';
import { SearchCalendarFilterEntity } from '../../../../../lib/src/repository/entity/searchCalendarFilterEntity';
import { GoogleCalendarRepository } from '../../../../../lib/src/repository/implement/googleCalendarRepository';
import type { ICalendarRepository } from '../../../../../lib/src/repository/interface/ICalendarRepository';
import type { RaceType } from '../../../../../lib/src/utility/raceType';
import { RACE_TYPE_LIST_ALL } from '../../../../../lib/src/utility/raceType';
import {
    baseCalendarData,
    baseCalendarDataFromGoogleCalendar,
    baseRaceEntity,
    baseRaceEntityList,
} from '../../mock/common/baseCommonData';
import { mockGoogleCalendarGateway } from '../../mock/gateway/mockGoogleCalendarGateway';

describe('GoogleCalendarRepository', () => {
    let repository: ICalendarRepository;
    let googleCalendarGateway: jest.Mocked<ICalendarGateway>;

    beforeEach(() => {
        googleCalendarGateway = mockGoogleCalendarGateway();
        container.registerInstance(
            'GoogleCalendarGateway',
            googleCalendarGateway,
        );
        repository = container.resolve(GoogleCalendarRepository);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    const mockCalendarDataList = RACE_TYPE_LIST_ALL.map((raceType) =>
        baseCalendarData(raceType),
    );

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
            RACE_TYPE_LIST_ALL,
            searchFilter,
        );

        expect(calendarDataList).toHaveLength(6);
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
            RACE_TYPE_LIST_ALL,
            searchFilter,
        );

        expect(calendarDataList).toHaveLength(0);
        expect(googleCalendarGateway.fetchCalendarDataList).toHaveBeenCalled();
    });

    it('カレンダー情報が正常に削除できること', async () => {
        for (const raceType of RACE_TYPE_LIST_ALL) {
            googleCalendarGateway.deleteCalendarData.mockResolvedValue();

            await repository.deleteEvents([baseCalendarData(raceType)]);
            expect(googleCalendarGateway.deleteCalendarData).toHaveBeenCalled();
        }
    });

    it('カレンダー情報が正常に削除できないこと', async () => {
        for (const raceType of RACE_TYPE_LIST_ALL) {
            googleCalendarGateway.deleteCalendarData.mockRejectedValue(
                new Error('API Error'),
            );

            await repository.deleteEvents([baseCalendarData(raceType)]);
            expect(googleCalendarGateway.deleteCalendarData).toHaveBeenCalled();
        }
    });

    it('カレンダー情報が正常に登録できること', async () => {
        for (const raceType of RACE_TYPE_LIST_ALL) {
            googleCalendarGateway.fetchCalendarData.mockRejectedValue(
                new Error('API Error'),
            );

            await repository.upsertEvents([baseRaceEntity(raceType)]);

            expect(googleCalendarGateway.insertCalendarData).toHaveBeenCalled();
        }
    });

    it('カレンダー情報が正常に更新できること', async () => {
        for (const raceType of RACE_TYPE_LIST_ALL) {
            googleCalendarGateway.fetchCalendarData.mockResolvedValue(
                baseCalendarDataFromGoogleCalendar(raceType),
            );

            await repository.upsertEvents(baseRaceEntityList(raceType));

            expect(googleCalendarGateway.updateCalendarData).toHaveBeenCalled();
        }
    });

    it('カレンダー情報が正常に更新できないこと', async () => {
        for (const raceType of RACE_TYPE_LIST_ALL) {
            googleCalendarGateway.insertCalendarData.mockRejectedValue(
                new Error('API Error'),
            );
            await repository.upsertEvents(baseRaceEntityList(raceType));

            expect(googleCalendarGateway.insertCalendarData).toHaveBeenCalled();
        }
    });
});
