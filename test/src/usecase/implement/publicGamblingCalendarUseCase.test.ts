import 'reflect-metadata'; // reflect-metadataをインポート

import { container } from 'tsyringe';

import type { CalendarData } from '../../../../lib/src/domain/calendarData';
import type { ICalendarService } from '../../../../lib/src/service/interface/ICalendarService';
import type { IPlayerDataService } from '../../../../lib/src/service/interface/IPlayerDataService';
import { PublicGamblingCalendarUseCase } from '../../../../lib/src/usecase/implement/publicGamblingCalendarUseCase';
import { baseAutoraceCalendarData } from '../../mock/common/baseAutoraceData';
import { calendarServiceMock } from '../../mock/service/calendarServiceMock';
import { playerDataServiceMock } from '../../mock/service/playerDataServiceMock';

describe('PublicGamblingRaceCalendarUseCase', () => {
    let calendarService: jest.Mocked<ICalendarService>;
    let playerDataService: jest.Mocked<IPlayerDataService>;
    let useCase: PublicGamblingCalendarUseCase;

    beforeEach(() => {
        calendarService = calendarServiceMock();
        container.registerInstance<ICalendarService>(
            'PublicGamblingCalendarService',
            calendarService,
        );

        playerDataService = playerDataServiceMock();
        container.registerInstance<IPlayerDataService>(
            'PlayerDataService',
            playerDataService,
        );

        useCase = container.resolve(PublicGamblingCalendarUseCase);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('getRacesFromCalendar', () => {
        it('CalendarDataのリストが正常に返ってくること', async () => {
            const mockCalendarData: CalendarData[] = [baseAutoraceCalendarData];

            // モックの戻り値を設定
            calendarService.fetchEvents.mockResolvedValue(mockCalendarData);

            const startDate = new Date('2023-08-01');
            const finishDate = new Date('2023-08-31');

            const result = await useCase.fetchRacesFromCalendar(
                startDate,
                finishDate,
                ['jra', 'nar', 'keirin', 'boatrace', 'autorace'],
            );

            expect(calendarService.fetchEvents).toHaveBeenCalledWith(
                startDate,
                finishDate,
                ['jra', 'nar', 'keirin', 'boatrace', 'autorace'],
            );
            expect(result).toEqual(mockCalendarData);
        });
    });
});
