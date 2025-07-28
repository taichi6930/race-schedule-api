import 'reflect-metadata'; // reflect-metadataをインポート

import { container } from 'tsyringe';

import type { CalendarData } from '../../../../lib/src/domain/calendarData';
import type { KeirinPlaceEntity } from '../../../../lib/src/repository/entity/keirinPlaceEntity';
import type { KeirinRaceEntity } from '../../../../lib/src/repository/entity/keirinRaceEntity';
import type { ICalendarService } from '../../../../lib/src/service/interface/ICalendarService';
import type { IOldCalendarService } from '../../../../lib/src/service/interface/IOldCalendarService';
import type { IPlayerDataService } from '../../../../lib/src/service/interface/IPlayerDataService';
import type { IRaceDataService } from '../../../../lib/src/service/interface/IRaceDataService';
import { KeirinRaceCalendarUseCase } from '../../../../lib/src/usecase/implement/keirinRaceCalendarUseCase';
import { KeirinSpecifiedGradeList } from '../../../../lib/src/utility/data/keirin/keirinGradeType';
import {
    baseKeirinCalendarData,
    baseKeirinRaceEntity,
} from '../../mock/common/baseKeirinData';
import { calendarServiceMock } from '../../mock/service/calendarServiceMock';
import { oldCalendarServiceMock } from '../../mock/service/oldCalendarServiceMock';
import { playerDataServiceMock } from '../../mock/service/playerDataServiceMock';
import { raceDataServiceMock } from '../../mock/service/raceDataServiceMock';

describe('KeirinRaceCalendarUseCase', () => {
    let calendarService: jest.Mocked<ICalendarService>;
    let oldCalendarService: jest.Mocked<IOldCalendarService<KeirinRaceEntity>>;
    let raceDataService: jest.Mocked<
        IRaceDataService<KeirinRaceEntity, KeirinPlaceEntity>
    >;
    let playerDataService: jest.Mocked<IPlayerDataService>;
    let useCase: KeirinRaceCalendarUseCase;

    beforeEach(() => {
        calendarService = calendarServiceMock();
        container.registerInstance<ICalendarService>(
            'PublicGamblingCalendarService',
            calendarService,
        );

        oldCalendarService = oldCalendarServiceMock<KeirinRaceEntity>();
        container.registerInstance<IOldCalendarService<KeirinRaceEntity>>(
            'KeirinCalendarService',
            oldCalendarService,
        );

        raceDataService = raceDataServiceMock<
            KeirinRaceEntity,
            KeirinPlaceEntity
        >();
        container.registerInstance<
            IRaceDataService<KeirinRaceEntity, KeirinPlaceEntity>
        >('KeirinRaceDataService', raceDataService);

        playerDataService = playerDataServiceMock();
        container.registerInstance<IPlayerDataService>(
            'PlayerDataService',
            playerDataService,
        );
        useCase = container.resolve(KeirinRaceCalendarUseCase);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('updateRacesToCalendar', () => {
        it('イベントが追加・削除されること', async () => {
            const mockCalendarDataList: CalendarData[] = Array.from(
                { length: 8 },
                (_, i: number) =>
                    baseKeirinCalendarData.copy({
                        id: `keirin2024122920${(i + 1).toXDigits(2)}`,
                    }),
            );
            const mockRaceEntityList: KeirinRaceEntity[] = [
                ...Array.from({ length: 5 }, (_, i: number) =>
                    baseKeirinRaceEntity.copy({
                        id: `keirin2024122920${(i + 1).toXDigits(2)}`,
                    }),
                ),
                ...Array.from({ length: 3 }, (_, i: number) =>
                    baseKeirinRaceEntity.copy({
                        id: `keirin2024122920${(i + 6).toXDigits(2)}`,
                        raceData: baseKeirinRaceEntity.raceData.copy({
                            grade: 'FⅠ',
                        }),
                    }),
                ),
            ];

            const expectCalendarDataList: CalendarData[] = Array.from(
                { length: 3 },
                (_, i: number) =>
                    baseKeirinCalendarData.copy({
                        id: `keirin2024122920${(i + 6).toXDigits(2)}`,
                    }),
            );
            const expectRaceEntityList: KeirinRaceEntity[] = Array.from(
                { length: 5 },
                (_, i: number) =>
                    baseKeirinRaceEntity.copy({
                        id: `keirin2024122920${(i + 1).toXDigits(2)}`,
                    }),
            );

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
                KeirinSpecifiedGradeList,
            );

            // モックが呼び出されたことを確認
            expect(calendarService.fetchEvents).toHaveBeenCalledWith(
                startDate,
                finishDate,
                ['keirin'],
            );

            // deleteEventsが呼び出された回数を確認
            expect(oldCalendarService.deleteEvents).toHaveBeenCalledTimes(1);
            expect(oldCalendarService.deleteEvents).toHaveBeenCalledWith(
                expectCalendarDataList,
            );
            expect(oldCalendarService.upsertEvents).toHaveBeenCalledTimes(1);
            expect(oldCalendarService.upsertEvents).toHaveBeenCalledWith(
                expectRaceEntityList,
            );
        });
    });
});
