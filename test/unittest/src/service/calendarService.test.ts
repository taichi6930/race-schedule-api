import 'reflect-metadata';

import { container } from 'tsyringe';

import { CalendarService } from '../../../../src/service/implement/calendarService';
import type { ICalendarService } from '../../../../src/service/interface/ICalendarService';
import type { TestRepositorySetup } from '../../../utility/testSetupHelper';
import {
    clearMocks,
    setupTestRepositoryMock,
} from '../../../utility/testSetupHelper';
import { mockCalendarDataList } from '../mock/common/baseCommonData';
import { commonParameterMock } from './../../../old/unittest/src/mock/common/commonParameterMock';

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

    // describe('getEvents', () => {
    //     it('カレンダーのイベントの取得が正常に行われること', async () => {
    //         const startDate = new Date('2023-01-01');
    //         const finishDate = new Date('2023-01-31');
    //         const result = await service.fetchEvents(
    //             startDate,
    //             finishDate,
    //             testRaceTypeListAll,
    //         );

    //         expect(
    //             repositorySetup.calendarRepository.getEvents,
    //         ).toHaveBeenCalledWith(
    //             new SearchCalendarFilterEntity(
    //                 startDate,
    //                 finishDate,
    //                 testRaceTypeListAll,
    //             ),
    //         );
    //         expect(result).toEqual(mockCalendarDataList);
    //     });
    // });

    describe('deleteEvents', () => {
        it('カレンダーのイベントの削除が正常に行われること', async () => {
            const commonParameter = commonParameterMock();
            await service.deleteEvents(commonParameter, mockCalendarDataList);

            expect(
                repositorySetup.calendarRepository.deleteEvents,
            ).toHaveBeenCalledWith(commonParameter, mockCalendarDataList);
        });
    });

    // describe('upsertEvents', () => {
    //     it('カレンダーのイベントの更新が正常に行われること', async () => {
    //         await service.upsertEvents(mockRaceEntityList);

    //         expect(
    //             repositorySetup.calendarRepository.upsertEvents,
    //         ).toHaveBeenCalledWith(mockRaceEntityList);
    //     });
    // });
});
