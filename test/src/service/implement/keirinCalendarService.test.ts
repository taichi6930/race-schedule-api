import 'reflect-metadata';

import { container } from 'tsyringe';

import type { KeirinRaceEntity } from '../../../../lib/src/repository/entity/keirinRaceEntity';
import type { ICalendarRepository } from '../../../../lib/src/repository/interface/ICalendarRepository';
import { KeirinCalendarService } from '../../../../lib/src/service/implement/keirinCalendarService';
import { baseKeirinRaceEntity } from '../../mock/common/baseKeirinData';
import { mockCalendarRepository } from '../../mock/repository/mockCalendarRepository';

describe('KeirinCalendarService', () => {
    let service: KeirinCalendarService;
    let calendarRepository: jest.Mocked<ICalendarRepository<KeirinRaceEntity>>;

    beforeEach(() => {
        calendarRepository = mockCalendarRepository<KeirinRaceEntity>();
        container.registerInstance(
            'KeirinCalendarRepository',
            calendarRepository,
        );
        service = container.resolve(KeirinCalendarService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('upsertEvents', () => {
        it('カレンダーのイベントの更新が正常に行われること', async () => {
            const raceEntityList: KeirinRaceEntity[] = [baseKeirinRaceEntity];

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
