import 'reflect-metadata';

import { container } from 'tsyringe';

import type { CalendarData } from '../../../../lib/src/domain/calendarData';
import type { AutoraceRaceEntity } from '../../../../lib/src/repository/entity/autoraceRaceEntity';
import type { BoatraceRaceEntity } from '../../../../lib/src/repository/entity/boatraceRaceEntity';
import type { JraRaceEntity } from '../../../../lib/src/repository/entity/jraRaceEntity';
import type { KeirinRaceEntity } from '../../../../lib/src/repository/entity/keirinRaceEntity';
import type { NarRaceEntity } from '../../../../lib/src/repository/entity/narRaceEntity';
import { SearchCalendarFilterEntity } from '../../../../lib/src/repository/entity/searchCalendarFilterEntity';
import type { WorldRaceEntity } from '../../../../lib/src/repository/entity/worldRaceEntity';
import type { ICalendarRepository } from '../../../../lib/src/repository/interface/ICalendarRepository';
import { PublicGamblingCalendarService } from '../../../../lib/src/service/implement/publicGamblingCalendarService';
import { baseAutoraceCalendarData } from '../../mock/common/baseAutoraceData';
import { mockCalendarRepository } from '../../mock/repository/mockCalendarRepository';

describe('PublicGamblingCalendarService', () => {
    let service: PublicGamblingCalendarService;
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
        jraCalendarRepository = mockCalendarRepository<JraRaceEntity>();
        container.registerInstance(
            'JraCalendarRepository',
            jraCalendarRepository,
        );
        narCalendarRepository = mockCalendarRepository<NarRaceEntity>();
        container.registerInstance(
            'NarCalendarRepository',
            narCalendarRepository,
        );
        worldCalendarRepository = mockCalendarRepository<WorldRaceEntity>();
        container.registerInstance(
            'WorldCalendarRepository',
            worldCalendarRepository,
        );
        keirinCalendarRepository = mockCalendarRepository<KeirinRaceEntity>();
        container.registerInstance(
            'KeirinCalendarRepository',
            keirinCalendarRepository,
        );
        boatraceCalendarRepository =
            mockCalendarRepository<BoatraceRaceEntity>();
        container.registerInstance(
            'BoatraceCalendarRepository',
            boatraceCalendarRepository,
        );
        autoraceCalendarRepository =
            mockCalendarRepository<AutoraceRaceEntity>();
        container.registerInstance(
            'AutoraceCalendarRepository',
            autoraceCalendarRepository,
        );
        service = container.resolve(PublicGamblingCalendarService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('getEvents', () => {
        it('カレンダーのイベントの取得が正常に行われること', async () => {
            const startDate = new Date('2023-01-01');
            const finishDate = new Date('2023-01-31');
            const calendarDataList: CalendarData[] = [baseAutoraceCalendarData];

            autoraceCalendarRepository.getEvents.mockResolvedValue(
                calendarDataList,
            );
            const result = await service.fetchEvents(startDate, finishDate, [
                'autorace',
            ]);

            expect(autoraceCalendarRepository.getEvents).toHaveBeenCalledWith(
                new SearchCalendarFilterEntity(startDate, finishDate),
            );
            expect(result).toEqual(calendarDataList);
        });
    });

    describe('deleteEvents', () => {
        it('カレンダーのイベントの削除が正常に行われること', async () => {
            await service.deleteEvents({
                jra: [],
                nar: [],
                world: [],
                keirin: [],
                boatrace: [],
                autorace: [baseAutoraceCalendarData],
            });

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
});
