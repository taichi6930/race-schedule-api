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
import { baseAutoraceRaceEntityList } from '../../mock/common/baseAutoraceData';
import { baseBoatraceRaceEntityList } from '../../mock/common/baseBoatraceData';
import { baseCalendarData } from '../../mock/common/baseCommonData';
import { baseJraRaceEntityList } from '../../mock/common/baseJraData';
import { baseKeirinRaceEntityList } from '../../mock/common/baseKeirinData';
import { baseNarRaceEntityList } from '../../mock/common/baseNarData';
import { baseOverseasRaceEntityList } from '../../mock/common/baseOverseasData';

describe('PublicGamblingCalendarService', () => {
    let service: ICalendarService;
    let calendarRepository: jest.Mocked<ICalendarRepository>;

    const mockCalendarDataListMap = {
        [RaceType.JRA]: baseCalendarData(RaceType.JRA),
        [RaceType.NAR]: baseCalendarData(RaceType.NAR),
        [RaceType.OVERSEAS]: baseCalendarData(RaceType.OVERSEAS),
        [RaceType.KEIRIN]: baseCalendarData(RaceType.KEIRIN),
        [RaceType.AUTORACE]: baseCalendarData(RaceType.AUTORACE),
        [RaceType.BOATRACE]: baseCalendarData(RaceType.BOATRACE),
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
