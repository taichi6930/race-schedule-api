import 'reflect-metadata';

import { container } from 'tsyringe';

import { SearchCalendarFilterEntity } from '../../../../src/repository/entity/filter/searchCalendarFilterEntity';
import { CalendarService } from '../../../../src/service/implement/calendarService';
import type { ICalendarService } from '../../../../src/service/interface/ICalendarService';
import type { TestRepositorySetup } from '../../../utility/testSetupHelper';
import {
    clearMocks,
    setupTestRepositoryMock,
} from '../../../utility/testSetupHelper';
import {
    mockCalendarDataList,
    mockRaceEntityList,
    testRaceTypeListAll,
} from '../mock/common/baseCommonData';

describe('CalendarService', () => {
    let service: ICalendarService;
    let repositorySetup: TestRepositorySetup;

    beforeEach(() => {
        repositorySetup = setupTestRepositoryMock();
        service = container.resolve(CalendarService);
    });

    afterEach(() => {
        clearMocks();
    });

    describe('fetchEventList', () => {
        it('カレンダーのイベントの取得が正常に行われること', async () => {
            const startDate = new Date('2023-01-01');
            const finishDate = new Date('2023-01-31');

            const searchRaceFilter = new SearchCalendarFilterEntity(
                startDate,
                finishDate,
                testRaceTypeListAll,
            );
            const result = await service.fetchEvents(searchRaceFilter);

            expect(
                repositorySetup.calendarRepository.fetchEventList,
            ).toHaveBeenCalledWith(searchRaceFilter);
            expect(result).toEqual(mockCalendarDataList);
        });
    });

    describe('deleteEventList', () => {
        it('カレンダーのイベントの削除が正常に行われること', async () => {
            await service.deleteEventList(mockCalendarDataList);

            expect(
                repositorySetup.calendarRepository.deleteEventList,
            ).toHaveBeenCalledWith(mockCalendarDataList);
        });
    });

    describe('upsertEventList', () => {
        it('カレンダーのイベントの更新が正常に行われること', async () => {
            await service.upsertEventList(mockRaceEntityList);

            expect(
                repositorySetup.calendarRepository.upsertEventList,
            ).toHaveBeenCalledWith(mockRaceEntityList);
        });
    });
});
