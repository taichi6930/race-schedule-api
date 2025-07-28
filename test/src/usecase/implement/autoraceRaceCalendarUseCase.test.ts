import 'reflect-metadata'; // reflect-metadataをインポート

import { container } from 'tsyringe';

import type { CalendarData } from '../../../../lib/src/domain/calendarData';
import type { AutoracePlaceEntity } from '../../../../lib/src/repository/entity/autoracePlaceEntity';
import type { AutoraceRaceEntity } from '../../../../lib/src/repository/entity/autoraceRaceEntity';
import type { IOldCalendarService } from '../../../../lib/src/service/interface/IOldCalendarService';
import type { IPlayerDataService } from '../../../../lib/src/service/interface/IPlayerDataService';
import type { IRaceDataService } from '../../../../lib/src/service/interface/IRaceDataService';
import { AutoraceRaceCalendarUseCase } from '../../../../lib/src/usecase/implement/autoraceRaceCalendarUseCase';
import { AutoraceSpecifiedGradeList } from '../../../../lib/src/utility/data/autorace/autoraceGradeType';
import {
    baseAutoraceCalendarData,
    baseAutoraceRaceEntity,
} from '../../mock/common/baseAutoraceData';
import { calendarServiceMock } from '../../mock/service/calendarServiceMock';
import { playerDataServiceMock } from '../../mock/service/playerDataServiceMock';
import { raceDataServiceMock } from '../../mock/service/raceDataServiceMock';

describe('AutoraceRaceCalendarUseCase', () => {
    let calendarService: jest.Mocked<IOldCalendarService<AutoraceRaceEntity>>;
    let raceDataService: jest.Mocked<
        IRaceDataService<AutoraceRaceEntity, AutoracePlaceEntity>
    >;
    let playerDataService: jest.Mocked<IPlayerDataService>;
    let useCase: AutoraceRaceCalendarUseCase;

    beforeEach(() => {
        calendarService = calendarServiceMock<AutoraceRaceEntity>();
        container.registerInstance<IOldCalendarService<AutoraceRaceEntity>>(
            'AutoraceCalendarService',
            calendarService,
        );

        raceDataService = raceDataServiceMock<
            AutoraceRaceEntity,
            AutoracePlaceEntity
        >();
        container.registerInstance<
            IRaceDataService<AutoraceRaceEntity, AutoracePlaceEntity>
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

    describe('getRacesFromCalendar', () => {
        it('CalendarDataのリストが正常に返ってくること', async () => {
            const mockCalendarData: CalendarData[] = [baseAutoraceCalendarData];

            // モックの戻り値を設定
            calendarService.getEvents.mockResolvedValue(mockCalendarData);

            const startDate = new Date('2023-08-01');
            const finishDate = new Date('2023-08-31');

            const result = await useCase.fetchRacesFromCalendar(
                startDate,
                finishDate,
            );

            expect(calendarService.getEvents).toHaveBeenCalledWith(
                startDate,
                finishDate,
            );
            expect(result).toEqual(mockCalendarData);
        });
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

            const expectCalendarDataList: CalendarData[] = Array.from(
                { length: 3 },
                (_, i: number) =>
                    baseAutoraceCalendarData.copy({
                        id: `autorace2024122920${(i + 6).toXDigits(2)}`,
                    }),
            );
            const expectRaceEntityList: AutoraceRaceEntity[] = Array.from(
                { length: 5 },
                (_, i: number) =>
                    baseAutoraceRaceEntity.copy({
                        id: `autorace2024122920${(i + 1).toXDigits(2)}`,
                    }),
            );

            // モックの戻り値を設定
            calendarService.getEvents.mockResolvedValue(mockCalendarDataList);
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
            expect(calendarService.getEvents).toHaveBeenCalledWith(
                startDate,
                finishDate,
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
