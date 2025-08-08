import 'reflect-metadata';

import { container } from 'tsyringe';

import type { CalendarData } from '../../../../../lib/src/domain/calendarData';
import type { AutoraceRaceEntity } from '../../../../../lib/src/repository/entity/autoraceRaceEntity';
import type { BoatraceRaceEntity } from '../../../../../lib/src/repository/entity/boatraceRaceEntity';
import type { JraRaceEntity } from '../../../../../lib/src/repository/entity/jraRaceEntity';
import type { KeirinRaceEntity } from '../../../../../lib/src/repository/entity/keirinRaceEntity';
import type { NarRaceEntity } from '../../../../../lib/src/repository/entity/narRaceEntity';
import { SearchCalendarFilterEntity } from '../../../../../lib/src/repository/entity/searchCalendarFilterEntity';
import type { WorldRaceEntity } from '../../../../../lib/src/repository/entity/worldRaceEntity';
import type { ICalendarRepository } from '../../../../../lib/src/repository/interface/ICalendarRepository';
import { PublicGamblingCalendarService } from '../../../../../lib/src/service/implement/publicGamblingCalendarService';
import type { ICalendarService } from '../../../../../lib/src/service/interface/ICalendarService';
import { RaceType } from '../../../../../lib/src/utility/raceType';
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
    baseWorldCalendarData,
    baseWorldRaceEntityList,
} from '../../mock/common/baseWorldData';

describe('PublicGamblingCalendarService', () => {
    let service: ICalendarService;
    let jraCalendarRepository: jest.Mocked<ICalendarRepository<JraRaceEntity>>;
    let narCalendarRepository: jest.Mocked<ICalendarRepository<NarRaceEntity>>;
    let worldCalendarRepository: jest.Mocked<
        ICalendarRepository<WorldRaceEntity>
    >;
    let keirinCalendarRepository: jest.Mocked<
        ICalendarRepository<KeirinRaceEntity>
    >;
    let boatraceCalendarRepository: jest.Mocked<
        ICalendarRepository<BoatraceRaceEntity>
    >;
    let autoraceCalendarRepository: jest.Mocked<
        ICalendarRepository<AutoraceRaceEntity>
    >;

    beforeEach(() => {
        const setup: TestSetup = setupTestMock();
        ({
            jraCalendarRepository,
            narCalendarRepository,
            worldCalendarRepository,
            keirinCalendarRepository,
            boatraceCalendarRepository,
            autoraceCalendarRepository,
        } = setup);
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
                baseWorldCalendarData,
                baseKeirinCalendarData,
                baseBoatraceCalendarData,
                baseAutoraceCalendarData,
            ];

            jraCalendarRepository.getEvents.mockResolvedValue([
                baseJraCalendarData,
            ]);
            narCalendarRepository.getEvents.mockResolvedValue([
                baseNarCalendarData,
            ]);
            worldCalendarRepository.getEvents.mockResolvedValue([
                baseWorldCalendarData,
            ]);
            keirinCalendarRepository.getEvents.mockResolvedValue([
                baseKeirinCalendarData,
            ]);
            boatraceCalendarRepository.getEvents.mockResolvedValue([
                baseBoatraceCalendarData,
            ]);
            autoraceCalendarRepository.getEvents.mockResolvedValue([
                baseAutoraceCalendarData,
            ]);
            const result = await service.fetchEvents(startDate, finishDate, [
                RaceType.JRA,
                RaceType.NAR,
                RaceType.WORLD,
                RaceType.KEIRIN,
                RaceType.AUTORACE,
                RaceType.BOATRACE,
            ]);

            expect(jraCalendarRepository.getEvents).toHaveBeenCalledWith(
                new SearchCalendarFilterEntity(startDate, finishDate),
            );
            expect(narCalendarRepository.getEvents).toHaveBeenCalledWith(
                new SearchCalendarFilterEntity(startDate, finishDate),
            );
            expect(worldCalendarRepository.getEvents).toHaveBeenCalledWith(
                new SearchCalendarFilterEntity(startDate, finishDate),
            );
            expect(keirinCalendarRepository.getEvents).toHaveBeenCalledWith(
                new SearchCalendarFilterEntity(startDate, finishDate),
            );
            expect(boatraceCalendarRepository.getEvents).toHaveBeenCalledWith(
                new SearchCalendarFilterEntity(startDate, finishDate),
            );
            expect(autoraceCalendarRepository.getEvents).toHaveBeenCalledWith(
                new SearchCalendarFilterEntity(startDate, finishDate),
            );
            expect(result).toEqual(calendarDataList);
        });
    });

    describe('deleteEvents', () => {
        it('カレンダーのイベントの削除が正常に行われること', async () => {
            await service.deleteEvents({
                jra: [baseJraCalendarData],
                nar: [baseNarCalendarData],
                world: [baseWorldCalendarData],
                keirin: [baseKeirinCalendarData],
                boatrace: [baseBoatraceCalendarData],
                autorace: [baseAutoraceCalendarData],
            });

            expect(jraCalendarRepository.deleteEvents).toHaveBeenCalledWith([
                baseJraCalendarData,
            ]);
            expect(narCalendarRepository.deleteEvents).toHaveBeenCalledWith([
                baseNarCalendarData,
            ]);
            expect(worldCalendarRepository.deleteEvents).toHaveBeenCalledWith([
                baseWorldCalendarData,
            ]);
            expect(keirinCalendarRepository.deleteEvents).toHaveBeenCalledWith([
                baseKeirinCalendarData,
            ]);
            expect(
                boatraceCalendarRepository.deleteEvents,
            ).toHaveBeenCalledWith([baseBoatraceCalendarData]);
            expect(
                autoraceCalendarRepository.deleteEvents,
            ).toHaveBeenCalledWith([baseAutoraceCalendarData]);
        });

        it('削除対象のイベントが見つからない場合、削除処理が行われないこと', async () => {
            const consoleSpy = jest
                .spyOn(console, 'debug')
                .mockImplementation();

            await service.deleteEvents({
                jra: [],
                nar: [],
                world: [],
                keirin: [],
                boatrace: [],
                autorace: [],
            });

            expect(consoleSpy).toHaveBeenCalledWith(
                '削除対象のイベントが見つかりませんでした。',
            );
            expect(
                autoraceCalendarRepository.deleteEvents,
            ).not.toHaveBeenCalled();

            consoleSpy.mockRestore();
        });
    });

    describe('upsertEvents', () => {
        it('カレンダーのイベントの更新が正常に行われること', async () => {
            await service.upsertEvents({
                jra: baseJraRaceEntityList,
                nar: baseNarRaceEntityList,
                world: baseWorldRaceEntityList,
                keirin: baseKeirinRaceEntityList,
                boatrace: baseBoatraceRaceEntityList,
                autorace: baseAutoraceRaceEntityList,
            });

            expect(jraCalendarRepository.upsertEvents).toHaveBeenCalledWith(
                baseJraRaceEntityList,
            );
            expect(narCalendarRepository.upsertEvents).toHaveBeenCalledWith(
                baseNarRaceEntityList,
            );
            expect(worldCalendarRepository.upsertEvents).toHaveBeenCalledWith(
                baseWorldRaceEntityList,
            );
            expect(keirinCalendarRepository.upsertEvents).toHaveBeenCalledWith(
                baseKeirinRaceEntityList,
            );
            expect(
                boatraceCalendarRepository.upsertEvents,
            ).toHaveBeenCalledWith(baseBoatraceRaceEntityList);
            expect(
                autoraceCalendarRepository.upsertEvents,
            ).toHaveBeenCalledWith(baseAutoraceRaceEntityList);
        });

        it('更新対象のイベントが見つからない場合、更新処理が行われないこと', async () => {
            const consoleSpy = jest
                .spyOn(console, 'debug')
                .mockImplementation();

            await service.upsertEvents({
                jra: [],
                nar: [],
                world: [],
                keirin: [],
                boatrace: [],
                autorace: [],
            });

            expect(consoleSpy).toHaveBeenCalledWith(
                '更新対象のイベントが見つかりませんでした。',
            );
            expect(jraCalendarRepository.upsertEvents).not.toHaveBeenCalled();
            expect(narCalendarRepository.upsertEvents).not.toHaveBeenCalled();
            expect(worldCalendarRepository.upsertEvents).not.toHaveBeenCalled();
            expect(
                keirinCalendarRepository.upsertEvents,
            ).not.toHaveBeenCalled();
            expect(
                boatraceCalendarRepository.upsertEvents,
            ).not.toHaveBeenCalled();
            expect(
                autoraceCalendarRepository.upsertEvents,
            ).not.toHaveBeenCalled();

            consoleSpy.mockRestore();
        });
    });
});
