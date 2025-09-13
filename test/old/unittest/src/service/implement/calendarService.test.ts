import 'reflect-metadata';

import { container } from 'tsyringe';

import { SearchCalendarFilterEntityForAWS } from '../../../../../../lib/src/repository/entity/searchCalendarFilterEntity';
import { CalendarServiceForAWS } from '../../../../../../lib/src/service/implement/calendarServiceForAWS';
import type { ICalendarServiceForAWS } from '../../../../../../lib/src/service/interface/ICalendarServiceForAWS';
import {
    mockCalendarDataList,
    mockRaceEntityList,
    testRaceTypeListAll,
} from '../../../../../unittest/src/mock/common/baseCommonData';
import type { TestRepositoryForAWSSetup } from '../../../../../utility/testSetupHelper';
import {
    clearMocks,
    setupTestRepositoryForAWSMock,
} from '../../../../../utility/testSetupHelper';

describe('CalendarService', () => {
    let service: ICalendarServiceForAWS;
    let repositorySetup: TestRepositoryForAWSSetup;

    beforeEach(() => {
        repositorySetup = setupTestRepositoryForAWSMock();
        service = container.resolve(CalendarServiceForAWS);
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

            expect(
                repositorySetup.calendarRepository.getEvents,
            ).toHaveBeenCalledWith(
                new SearchCalendarFilterEntityForAWS(
                    startDate,
                    finishDate,
                    testRaceTypeListAll,
                ),
            );
            expect(result).toEqual(mockCalendarDataList);
        });
    });

    describe('deleteEvents', () => {
        it('カレンダーのイベントの削除が正常に行われること', async () => {
            await service.deleteEvents(mockCalendarDataList);

            expect(
                repositorySetup.calendarRepository.deleteEvents,
            ).toHaveBeenCalledWith(mockCalendarDataList);
        });
    });

    describe('upsertEvents', () => {
        it('カレンダーのイベントの更新が正常に行われること', async () => {
            await service.upsertEvents(mockRaceEntityList);

            expect(
                repositorySetup.calendarRepository.upsertEvents,
            ).toHaveBeenCalledWith(mockRaceEntityList);
        });
    });
});
