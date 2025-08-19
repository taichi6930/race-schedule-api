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
import {
    baseAutoraceCalendarData,
    baseAutoraceCalendarDataFromGoogleCalendar,
    baseAutoraceRaceEntity,
    baseAutoraceRaceEntityList,
} from '../../mock/common/baseAutoraceData';
import {
    baseBoatraceCalendarData,
    baseBoatraceCalendarDataFromGoogleCalendar,
    baseBoatraceRaceEntity,
    baseBoatraceRaceEntityList,
} from '../../mock/common/baseBoatraceData';
import {
    baseJraCalendarData,
    baseJraCalendarDataFromGoogleCalendar,
    baseJraRaceEntity,
    baseJraRaceEntityList,
} from '../../mock/common/baseJraData';
import {
    baseKeirinCalendarData,
    baseKeirinCalendarDataFromGoogleCalendar,
    baseKeirinRaceEntity,
    baseKeirinRaceEntityList,
} from '../../mock/common/baseKeirinData';
import {
    baseNarCalendarData,
    baseNarCalendarDataFromGoogleCalendar,
    baseNarRaceEntity,
    baseNarRaceEntityList,
} from '../../mock/common/baseNarData';
import {
    baseOverseasCalendarData,
    baseOverseasCalendarDataFromGoogleCalendar,
    baseOverseasRaceEntity,
    baseOverseasRaceEntityList,
} from '../../mock/common/baseOverseasData';
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
        baseJraCalendarData,
        baseNarCalendarData,
        baseOverseasCalendarData,
        baseKeirinCalendarData,
        baseBoatraceCalendarData,
        baseAutoraceCalendarData,
    ];

    const baseCalendarDataFromGoogleCalendarMap = {
        [RaceType.JRA]: baseJraCalendarDataFromGoogleCalendar,
        [RaceType.NAR]: baseNarCalendarDataFromGoogleCalendar,
        [RaceType.OVERSEAS]: baseOverseasCalendarDataFromGoogleCalendar,
        [RaceType.KEIRIN]: baseKeirinCalendarDataFromGoogleCalendar,
        [RaceType.BOATRACE]: baseBoatraceCalendarDataFromGoogleCalendar,
        [RaceType.AUTORACE]: baseAutoraceCalendarDataFromGoogleCalendar,
    };

    const baseCalendarDataMap = {
        [RaceType.JRA]: baseJraCalendarData,
        [RaceType.NAR]: baseNarCalendarData,
        [RaceType.OVERSEAS]: baseOverseasCalendarData,
        [RaceType.KEIRIN]: baseKeirinCalendarData,
        [RaceType.BOATRACE]: baseBoatraceCalendarData,
        [RaceType.AUTORACE]: baseAutoraceCalendarData,
    };

    const baseRaceEntityMap = {
        [RaceType.JRA]: baseJraRaceEntity,
        [RaceType.NAR]: baseNarRaceEntity,
        [RaceType.OVERSEAS]: baseOverseasRaceEntity,
        [RaceType.KEIRIN]: baseKeirinRaceEntity,
        [RaceType.BOATRACE]: baseBoatraceRaceEntity,
        [RaceType.AUTORACE]: baseAutoraceRaceEntity,
    };

    const baseRaceEntityListMap = {
        [RaceType.JRA]: baseJraRaceEntityList,
        [RaceType.NAR]: baseNarRaceEntityList,
        [RaceType.OVERSEAS]: baseOverseasRaceEntityList,
        [RaceType.KEIRIN]: baseKeirinRaceEntityList,
        [RaceType.BOATRACE]: baseBoatraceRaceEntityList,
        [RaceType.AUTORACE]: baseAutoraceRaceEntityList,
    };
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
