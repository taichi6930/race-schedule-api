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
import { commonParameterMock } from '../mock/common/commonParameterMock';

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

    describe('getEvents', () => {
        it('カレンダーのイベントの取得が正常に行われること', async () => {
            const startDate = new Date('2023-01-01');
            const finishDate = new Date('2023-01-31');

            const commonParameter = commonParameterMock();
            const searchRaceFilter = new SearchCalendarFilterEntity(
                startDate,
                finishDate,
                testRaceTypeListAll,
            );
            const result = await service.fetchEvents(
                commonParameter,
                searchRaceFilter,
            );

            expect(
                repositorySetup.calendarRepository.getEvents,
            ).toHaveBeenCalledWith(commonParameter, searchRaceFilter);
            expect(result).toEqual(mockCalendarDataList);
        });
    });

    describe('deleteEvents', () => {
        it('カレンダーのイベントの削除が正常に行われること', async () => {
            const commonParameter = commonParameterMock();
            await service.deleteEvents(commonParameter, mockCalendarDataList);

            expect(
                repositorySetup.calendarRepository.deleteEvents,
            ).toHaveBeenCalledWith(commonParameter, mockCalendarDataList);
        });
    });

    describe('upsertEvents', () => {
        it('カレンダーのイベントの更新が正常に行われること', async () => {
            const commonParameter = commonParameterMock();
            await service.upsertEvents(commonParameter, mockRaceEntityList);

            expect(
                repositorySetup.calendarRepository.upsertEvents,
            ).toHaveBeenCalledWith(commonParameter, mockRaceEntityList);
        });
    });
});
