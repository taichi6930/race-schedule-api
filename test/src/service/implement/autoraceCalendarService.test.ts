import 'reflect-metadata';

import { container } from 'tsyringe';

import type { AutoraceRaceEntity } from '../../../../lib/src/repository/entity/autoraceRaceEntity';
import type { ICalendarRepository } from '../../../../lib/src/repository/interface/ICalendarRepository';
import { AutoraceCalendarService } from '../../../../lib/src/service/implement/autoraceCalendarService';
import { baseAutoraceRaceEntity } from '../../mock/common/baseAutoraceData';
import { mockCalendarRepository } from '../../mock/repository/mockCalendarRepository';

describe('AutoraceCalendarService', () => {
    let service: AutoraceCalendarService;
    let calendarRepository: jest.Mocked<
        ICalendarRepository<AutoraceRaceEntity>
    >;

    beforeEach(() => {
        calendarRepository = mockCalendarRepository<AutoraceRaceEntity>();
        container.registerInstance(
            'AutoraceCalendarRepository',
            calendarRepository,
        );
        service = container.resolve(AutoraceCalendarService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('upsertEvents', () => {
        it('カレンダーのイベントの更新が正常に行われること', async () => {
            const raceEntityList: AutoraceRaceEntity[] = [
                baseAutoraceRaceEntity,
            ];

            await service.upsertEvents(raceEntityList);

            expect(calendarRepository.upsertEvents).toHaveBeenCalledWith(
                raceEntityList,
            );
        });

        it('更新対象のイベントが見つからない場合、更新処理が行われないこと', async () => {
            const consoleSpy = jest
                .spyOn(console, 'debug')
                .mockImplementation();

            await service.upsertEvents([]);

            expect(consoleSpy).toHaveBeenCalledWith(
                '更新対象のイベントが見つかりませんでした。',
            );
            expect(calendarRepository.upsertEvents).not.toHaveBeenCalled();

            consoleSpy.mockRestore();
        });
    });
});
