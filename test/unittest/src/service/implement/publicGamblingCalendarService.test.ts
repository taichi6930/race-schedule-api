import 'reflect-metadata';

import { container } from 'tsyringe';

import { SearchCalendarFilterEntity } from '../../../../../lib/src/repository/entity/searchCalendarFilterEntity';
import type { ICalendarRepository } from '../../../../../lib/src/repository/interface/ICalendarRepository';
import { PublicGamblingCalendarService } from '../../../../../lib/src/service/implement/publicGamblingCalendarService';
import type { ICalendarService } from '../../../../../lib/src/service/interface/ICalendarService';
import type { TestRepositorySetup } from '../../../../utility/testSetupHelper';
import {
    clearMocks,
    setupTestRepositoryMock,
} from '../../../../utility/testSetupHelper';
import {
    mockCalendarDataList,
    mockRaceEntityList,
    testRaceTypeListAll,
} from '../../mock/common/baseCommonData';

describe('PublicGamblingCalendarService', () => {
    let service: ICalendarService;
    let calendarRepository: jest.Mocked<ICalendarRepository>;

    beforeEach(() => {
        const setup: TestRepositorySetup = setupTestRepositoryMock();
        ({ calendarRepository } = setup);
        service = container.resolve(PublicGamblingCalendarService);
    });

    afterEach(() => {
        clearMocks();
    });

    describe('getEvents', () => {
        it('カレンダーのイベントの取得が正常に行われること', async () => {
            const startDate = new Date('2023-01-01');
            const finishDate = new Date('2023-01-31');
            const result = await service.fetchEvents(
                startDate,
                finishDate,
                testRaceTypeListAll,
            );

            expect(calendarRepository.getEvents).toHaveBeenCalledWith(
                testRaceTypeListAll,
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
