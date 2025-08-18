import 'reflect-metadata';

import { container } from 'tsyringe';

import type { CalendarData } from '../../../../../lib/src/domain/calendarData';
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
            const calendarDataList: CalendarData[] = [
                baseJraCalendarData,
                baseNarCalendarData,
                baseOverseasCalendarData,
                baseKeirinCalendarData,
                baseBoatraceCalendarData,
                baseAutoraceCalendarData,
            ];

            const result = await service.fetchEvents(
                startDate,
                finishDate,
                ALL_RACE_TYPE_LIST,
            );

            expect(calendarRepository.getEvents).toHaveBeenCalledWith(
                ALL_RACE_TYPE_LIST,
                new SearchCalendarFilterEntity(startDate, finishDate),
            );
            expect(result).toEqual(calendarDataList);
        });
    });

    describe('deleteEvents', () => {
        it('カレンダーのイベントの削除が正常に行われること', async () => {
            await service.deleteEvents([
                baseJraCalendarData,
                baseNarCalendarData,
                baseOverseasCalendarData,
                baseKeirinCalendarData,
                baseBoatraceCalendarData,
                baseAutoraceCalendarData,
            ]);

            expect(calendarRepository.deleteEvents).toHaveBeenCalledWith([
                baseJraCalendarData,
                baseNarCalendarData,
                baseOverseasCalendarData,
                baseKeirinCalendarData,
                baseBoatraceCalendarData,
                baseAutoraceCalendarData,
            ]);
        });
    });

    describe('upsertEvents', () => {
        it('カレンダーのイベントの更新が正常に行われること', async () => {
            await service.upsertEvents({
                [RaceType.JRA]: baseJraRaceEntityList,
                [RaceType.NAR]: baseNarRaceEntityList,
                [RaceType.OVERSEAS]: baseOverseasRaceEntityList,
                [RaceType.KEIRIN]: baseKeirinRaceEntityList,
                [RaceType.AUTORACE]: baseAutoraceRaceEntityList,
                [RaceType.BOATRACE]: baseBoatraceRaceEntityList,
            });

            expect(calendarRepository.upsertEvents).toHaveBeenCalledWith(
                baseJraRaceEntityList,
            );
            expect(calendarRepository.upsertEvents).toHaveBeenCalledWith(
                baseNarRaceEntityList,
            );
            expect(calendarRepository.upsertEvents).toHaveBeenCalledWith(
                baseOverseasRaceEntityList,
            );
            expect(calendarRepository.upsertEvents).toHaveBeenCalledWith(
                baseKeirinRaceEntityList,
            );
            expect(calendarRepository.upsertEvents).toHaveBeenCalledWith(
                baseBoatraceRaceEntityList,
            );
            expect(calendarRepository.upsertEvents).toHaveBeenCalledWith(
                baseAutoraceRaceEntityList,
            );
        });
    });
});
