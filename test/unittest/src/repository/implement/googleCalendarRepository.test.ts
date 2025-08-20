import 'reflect-metadata';

import { container } from 'tsyringe';

import type { ICalendarGateway } from '../../../../../lib/src/gateway/interface/iCalendarGateway';
import { SearchCalendarFilterEntity } from '../../../../../lib/src/repository/entity/searchCalendarFilterEntity';
import { GoogleCalendarRepository } from '../../../../../lib/src/repository/implement/googleCalendarRepository';
import type { ICalendarRepository } from '../../../../../lib/src/repository/interface/ICalendarRepository';
import {
    ALL_RACE_TYPE_LIST,
    RaceType,
} from '../../../../../lib/src/utility/raceType';
import { baseCalendarData } from '../../mock/common/baseCommonData';
import {
    baseCalendarDataFromGoogleCalendarMap,
    baseCalendarDataMap,
    baseRaceEntityListMap,
    baseRaceEntityMap,
} from '../../mock/common/baseData';
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

    const mockCalendarDataList = [
        baseCalendarData(RaceType.JRA),
        baseCalendarData(RaceType.NAR),
        baseCalendarData(RaceType.OVERSEAS),
        baseCalendarData(RaceType.KEIRIN),
        baseCalendarData(RaceType.BOATRACE),
        baseCalendarData(RaceType.AUTORACE),
    ];

    it('カレンダー情報が正常に取得できること', async () => {
        googleCalendarGateway.fetchCalendarDataList.mockImplementation(
            async (raceType: RaceType) => {
                return [baseCalendarDataFromGoogleCalendarMap[raceType]];
            },
        );
        const searchFilter = new SearchCalendarFilterEntity(
            new Date('2023-01-01'),
            new Date('2023-12-31'),
        );
        const calendarDataList = await repository.getEvents(
            ALL_RACE_TYPE_LIST,
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
            ALL_RACE_TYPE_LIST,
            searchFilter,
        );

        expect(calendarDataList).toHaveLength(0);
        expect(googleCalendarGateway.fetchCalendarDataList).toHaveBeenCalled();
    });

    it('カレンダー情報が正常に削除できること', async () => {
        for (const raceType of ALL_RACE_TYPE_LIST) {
            googleCalendarGateway.deleteCalendarData.mockResolvedValue();

            await repository.deleteEvents([baseCalendarDataMap[raceType]]);
            expect(googleCalendarGateway.deleteCalendarData).toHaveBeenCalled();
        }
    });

    it('カレンダー情報が正常に削除できないこと', async () => {
        for (const raceType of ALL_RACE_TYPE_LIST) {
            googleCalendarGateway.deleteCalendarData.mockRejectedValue(
                new Error('API Error'),
            );

            await repository.deleteEvents([baseCalendarDataMap[raceType]]);
            expect(googleCalendarGateway.deleteCalendarData).toHaveBeenCalled();
        }
    });

    it('カレンダー情報が正常に登録できること', async () => {
        for (const raceType of ALL_RACE_TYPE_LIST) {
            googleCalendarGateway.fetchCalendarData.mockRejectedValue(
                new Error('API Error'),
            );

            await repository.upsertEvents([baseRaceEntityMap[raceType]]);

            expect(googleCalendarGateway.insertCalendarData).toHaveBeenCalled();
        }
    });

    it('カレンダー情報が正常に更新できること', async () => {
        for (const raceType of ALL_RACE_TYPE_LIST) {
            googleCalendarGateway.fetchCalendarData.mockResolvedValue(
                baseCalendarDataFromGoogleCalendarMap[raceType],
            );

            await repository.upsertEvents(baseRaceEntityListMap[raceType]);

            expect(googleCalendarGateway.updateCalendarData).toHaveBeenCalled();
        }
    });

    it('カレンダー情報が正常に更新できないこと', async () => {
        for (const raceType of ALL_RACE_TYPE_LIST) {
            googleCalendarGateway.insertCalendarData.mockRejectedValue(
                new Error('API Error'),
            );
            await repository.upsertEvents(baseRaceEntityListMap[raceType]);

            expect(googleCalendarGateway.insertCalendarData).toHaveBeenCalled();
        }
    });
});
