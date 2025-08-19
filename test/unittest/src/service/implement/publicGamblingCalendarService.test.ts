import 'reflect-metadata';

import { container } from 'tsyringe';

import { SearchCalendarFilterEntity } from '../../../../../lib/src/repository/entity/searchCalendarFilterEntity';
import type { ICalendarRepository } from '../../../../../lib/src/repository/interface/ICalendarRepository';
import { PublicGamblingCalendarService } from '../../../../../lib/src/service/implement/publicGamblingCalendarService';
import type { ICalendarService } from '../../../../../lib/src/service/interface/ICalendarService';
import {
    ALL_RACE_TYPE_LIST,
    RaceType,
} from '../../../../../lib/src/utility/raceType';
import type { TestSetup } from '../../../../utility/testSetupHelper';
import { setupTestMock } from '../../../../utility/testSetupHelper';
import {
    baseAutoraceCalendarData,
    baseAutoraceRaceEntityList,
} from '../../mock/common/baseAutoraceData';
import {
    baseBoatraceCalendarData,
    baseBoatraceRaceEntityList,
} from '../../mock/common/baseBoatraceData';
import {
    baseJraCalendarData,
    baseJraRaceEntityList,
} from '../../mock/common/baseJraData';
import {
    baseKeirinCalendarData,
    baseKeirinRaceEntityList,
} from '../../mock/common/baseKeirinData';
import {
    baseNarCalendarData,
    baseNarRaceEntityList,
} from '../../mock/common/baseNarData';
import {
    baseOverseasCalendarData,
    baseOverseasRaceEntityList,
} from '../../mock/common/baseOverseasData';

describe('PublicGamblingCalendarService', () => {
    let service: ICalendarService;
    let calendarRepository: jest.Mocked<ICalendarRepository>;

    const mockCalendarDataListMap = {
        [RaceType.JRA]: baseJraCalendarData,
        [RaceType.NAR]: baseNarCalendarData,
        [RaceType.OVERSEAS]: baseOverseasCalendarData,
        [RaceType.KEIRIN]: baseKeirinCalendarData,
        [RaceType.BOATRACE]: baseBoatraceCalendarData,
        [RaceType.AUTORACE]: baseAutoraceCalendarData,
    };

    const mockCalendarDataList = Object.values(mockCalendarDataListMap).flat();

    const mockRaceEntityListMap = {
        [RaceType.JRA]: baseJraRaceEntityList,
        [RaceType.NAR]: baseNarRaceEntityList,
        [RaceType.OVERSEAS]: baseOverseasRaceEntityList,
        [RaceType.KEIRIN]: baseKeirinRaceEntityList,
        [RaceType.AUTORACE]: baseAutoraceRaceEntityList,
        [RaceType.BOATRACE]: baseBoatraceRaceEntityList,
    };

    const mockRaceEntityList = Object.values(mockRaceEntityListMap).flat();

    beforeEach(() => {
        const setup: TestSetup = setupTestMock();
        ({ calendarRepository } = setup);
        service = container.resolve(PublicGamblingCalendarService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('getEvents', () => {
        it('カレンダーのイベントの取得が正常に行われること', async () => {
            const startDate = new Date('2023-01-01');
            const finishDate = new Date('2023-01-31');
            const result = await service.fetchEvents(
                startDate,
                finishDate,
                ALL_RACE_TYPE_LIST,
            );

            expect(calendarRepository.getEvents).toHaveBeenCalledWith(
                ALL_RACE_TYPE_LIST,
                new SearchCalendarFilterEntity(startDate, finishDate),
            );
            expect(result).toEqual(mockCalendarDataList);
        });
    });

    describe('deleteEvents', () => {
        it('カレンダーのイベントの削除が正常に行われること', async () => {
            await service.deleteEvents(mockCalendarDataList);

            expect(calendarRepository.deleteEvents).toHaveBeenCalledWith(
                mockCalendarDataList,
            );
        });
    });

    describe('upsertEvents', () => {
        it('カレンダーのイベントの更新が正常に行われること', async () => {
            await service.upsertEvents(mockRaceEntityList);

            expect(calendarRepository.upsertEvents).toHaveBeenCalledWith(
                mockRaceEntityList,
            );
        });
    });
});
