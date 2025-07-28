import 'reflect-metadata';

import { container } from 'tsyringe';

import type { WorldRaceEntity } from '../../../../lib/src/repository/entity/worldRaceEntity';
import type { ICalendarRepository } from '../../../../lib/src/repository/interface/ICalendarRepository';
import { WorldCalendarService } from '../../../../lib/src/service/implement/worldCalendarService';
import { baseWorldRaceEntity } from '../../mock/common/baseWorldData';
import { mockCalendarRepository } from '../../mock/repository/mockCalendarRepository';

describe('WorldCalendarService', () => {
    let service: WorldCalendarService;
    let calendarRepository: jest.Mocked<ICalendarRepository<WorldRaceEntity>>;

    beforeEach(() => {
        calendarRepository = mockCalendarRepository<WorldRaceEntity>();
        container.registerInstance(
            'WorldCalendarRepository',
            calendarRepository,
        );
        service = container.resolve(WorldCalendarService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('upsertEvents', () => {
        it('カレンダーのイベントの更新が正常に行われること', async () => {
            const raceEntityList: WorldRaceEntity[] = [baseWorldRaceEntity];

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
