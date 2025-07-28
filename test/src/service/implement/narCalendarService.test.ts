import 'reflect-metadata';

import { container } from 'tsyringe';

import type { NarRaceEntity } from '../../../../lib/src/repository/entity/narRaceEntity';
import type { ICalendarRepository } from '../../../../lib/src/repository/interface/ICalendarRepository';
import { NarCalendarService } from '../../../../lib/src/service/implement/narCalendarService';
import { baseNarRaceEntity } from '../../mock/common/baseNarData';
import { mockCalendarRepository } from '../../mock/repository/mockCalendarRepository';

describe('NarCalendarService', () => {
    let service: NarCalendarService;
    let calendarRepository: jest.Mocked<ICalendarRepository<NarRaceEntity>>;

    beforeEach(() => {
        calendarRepository = mockCalendarRepository<NarRaceEntity>();
        container.registerInstance('NarCalendarRepository', calendarRepository);
        service = container.resolve(NarCalendarService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('upsertEvents', () => {
        it('カレンダーのイベントの更新が正常に行われること', async () => {
            const raceEntityList: NarRaceEntity[] = [baseNarRaceEntity];

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
