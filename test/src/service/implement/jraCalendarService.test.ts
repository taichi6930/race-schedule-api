import 'reflect-metadata';

import { container } from 'tsyringe';

import type { JraRaceEntity } from '../../../../lib/src/repository/entity/jraRaceEntity';
import type { ICalendarRepository } from '../../../../lib/src/repository/interface/ICalendarRepository';
import { JraCalendarService } from '../../../../lib/src/service/implement/jraCalendarService';
import { baseJraRaceEntity } from '../../mock/common/baseJraData';
import { mockCalendarRepository } from '../../mock/repository/mockCalendarRepository';

describe('JraCalendarService', () => {
    let service: JraCalendarService;
    let calendarRepository: jest.Mocked<ICalendarRepository<JraRaceEntity>>;

    beforeEach(() => {
        calendarRepository = mockCalendarRepository<JraRaceEntity>();
        container.registerInstance('JraCalendarRepository', calendarRepository);
        service = container.resolve(JraCalendarService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('upsertEvents', () => {
        it('カレンダーのイベントの更新が正常に行われること', async () => {
            const raceEntityList: JraRaceEntity[] = [baseJraRaceEntity];

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
