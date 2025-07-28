import 'reflect-metadata';

import { container } from 'tsyringe';

import type { BoatraceRaceEntity } from '../../../../lib/src/repository/entity/boatraceRaceEntity';
import type { ICalendarRepository } from '../../../../lib/src/repository/interface/ICalendarRepository';
import { BoatraceCalendarService } from '../../../../lib/src/service/implement/boatraceCalendarService';
import { baseBoatraceRaceEntity } from '../../mock/common/baseBoatraceData';
import { mockCalendarRepository } from '../../mock/repository/mockCalendarRepository';

describe('BoatraceCalendarService', () => {
    let service: BoatraceCalendarService;
    let calendarRepository: jest.Mocked<
        ICalendarRepository<BoatraceRaceEntity>
    >;

    beforeEach(() => {
        calendarRepository = mockCalendarRepository<BoatraceRaceEntity>();
        container.registerInstance(
            'BoatraceCalendarRepository',
            calendarRepository,
        );
        service = container.resolve(BoatraceCalendarService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('upsertEvents', () => {
        it('カレンダーのイベントの更新が正常に行われること', async () => {
            const raceEntityList: BoatraceRaceEntity[] = [
                baseBoatraceRaceEntity,
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
