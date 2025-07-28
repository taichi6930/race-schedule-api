import 'reflect-metadata'; // reflect-metadataをインポート

import { container } from 'tsyringe';

import type { CalendarData } from '../../../../lib/src/domain/calendarData';
import type { AutoracePlaceEntity } from '../../../../lib/src/repository/entity/autoracePlaceEntity';
import type { AutoraceRaceEntity } from '../../../../lib/src/repository/entity/autoraceRaceEntity';
import type { ICalendarService } from '../../../../lib/src/service/interface/ICalendarService';
import type { IOldRaceDataService } from '../../../../lib/src/service/interface/IOldRaceDataService';
import type { IPlayerDataService } from '../../../../lib/src/service/interface/IPlayerDataService';
import { AutoraceRaceCalendarUseCase } from '../../../../lib/src/usecase/implement/autoraceRaceCalendarUseCase';
import { AutoraceSpecifiedGradeList } from '../../../../lib/src/utility/data/autorace/autoraceGradeType';
import {
    baseAutoraceCalendarData,
    baseAutoraceRaceEntity,
} from '../../mock/common/baseAutoraceData';
import { calendarServiceMock } from '../../mock/service/calendarServiceMock';
import { oldRaceDataServiceMock } from '../../mock/service/oldRaceDataServiceMock';
import { playerDataServiceMock } from '../../mock/service/playerDataServiceMock';

describe('AutoraceRaceCalendarUseCase', () => {
    let calendarService: jest.Mocked<ICalendarService>;
    let raceDataService: jest.Mocked<
        IOldRaceDataService<AutoraceRaceEntity, AutoracePlaceEntity>
    >;
    let playerDataService: jest.Mocked<IPlayerDataService>;
    let useCase: AutoraceRaceCalendarUseCase;

    beforeEach(() => {
        calendarService = calendarServiceMock();
        container.registerInstance<ICalendarService>(
            'PublicGamblingCalendarService',
            calendarService,
        );

        raceDataService = oldRaceDataServiceMock<
            AutoraceRaceEntity,
            AutoracePlaceEntity
        >();
        container.registerInstance<
            IOldRaceDataService<AutoraceRaceEntity, AutoracePlaceEntity>
        >('AutoraceRaceDataService', raceDataService);

        playerDataService = playerDataServiceMock();
        container.registerInstance<IPlayerDataService>(
            'PlayerDataService',
            playerDataService,
        );
        useCase = container.resolve(AutoraceRaceCalendarUseCase);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('updateRacesToCalendar', () => {
        it('イベントが追加・削除されること', async () => {
            const mockCalendarDataList: CalendarData[] = Array.from(
                { length: 8 },
                (_, i: number) =>
                    baseAutoraceCalendarData.copy({
                        id: `autorace2024122920${(i + 1).toXDigits(2)}`,
                    }),
            );
            const mockRaceEntityList: AutoraceRaceEntity[] = [
                ...Array.from({ length: 5 }, (_, i: number) =>
                    baseAutoraceRaceEntity.copy({
                        id: `autorace2024122920${(i + 1).toXDigits(2)}`,
                    }),
                ),
                ...Array.from({ length: 3 }, (_, i: number) =>
                    baseAutoraceRaceEntity.copy({
                        id: `autorace2024122920${(i + 6).toXDigits(2)}`,
                        raceData: baseAutoraceRaceEntity.raceData.copy({
                            grade: '開催',
                        }),
                    }),
                ),
            ];

            const expectCalendarDataList = {
                autorace: Array.from({ length: 3 }, (_, i: number) =>
                    baseAutoraceCalendarData.copy({
                        id: `autorace2024122920${(i + 6).toXDigits(2)}`,
                    }),
                ),
            };
            const expectRaceEntityList = {
                autorace: Array.from({ length: 5 }, (_, i: number) =>
                    baseAutoraceRaceEntity.copy({
                        id: `autorace2024122920${(i + 1).toXDigits(2)}`,
                    }),
                ),
            };

            // モックの戻り値を設定
            calendarService.fetchEvents.mockResolvedValue(mockCalendarDataList);
            raceDataService.fetchRaceEntityList.mockResolvedValue(
                mockRaceEntityList,
            );

            const startDate = new Date('2024-02-01');
            const finishDate = new Date('2024-12-31');

            await useCase.updateRacesToCalendar(
                startDate,
                finishDate,
                AutoraceSpecifiedGradeList,
            );

            // モックが呼び出されたことを確認
            expect(calendarService.fetchEvents).toHaveBeenCalledWith(
                startDate,
                finishDate,
                ['autorace'],
            );

            // deleteEventsが呼び出された回数を確認
            expect(calendarService.deleteEvents).toHaveBeenCalledTimes(1);
            expect(calendarService.deleteEvents).toHaveBeenCalledWith(
                expectCalendarDataList,
            );
            expect(calendarService.upsertEvents).toHaveBeenCalledTimes(1);
            expect(calendarService.upsertEvents).toHaveBeenCalledWith(
                expectRaceEntityList,
            );
        });
    });
});
