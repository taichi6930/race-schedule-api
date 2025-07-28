import 'reflect-metadata'; // reflect-metadataをインポート

import { container } from 'tsyringe';

import type { CalendarData } from '../../../../lib/src/domain/calendarData';
import type { BoatracePlaceEntity } from '../../../../lib/src/repository/entity/boatracePlaceEntity';
import type { BoatraceRaceEntity } from '../../../../lib/src/repository/entity/boatraceRaceEntity';
import type { ICalendarService } from '../../../../lib/src/service/interface/ICalendarService';
import type { IOldCalendarService } from '../../../../lib/src/service/interface/IOldCalendarService';
import type { IPlayerDataService } from '../../../../lib/src/service/interface/IPlayerDataService';
import type { IRaceDataService } from '../../../../lib/src/service/interface/IRaceDataService';
import { BoatraceRaceCalendarUseCase } from '../../../../lib/src/usecase/implement/boatraceRaceCalendarUseCase';
import { BoatraceSpecifiedGradeList } from '../../../../lib/src/utility/data/boatrace/boatraceGradeType';
import {
    baseBoatraceCalendarData,
    baseBoatraceRaceEntity,
} from '../../mock/common/baseBoatraceData';
import { calendarServiceMock } from '../../mock/service/calendarServiceMock';
import { oldCalendarServiceMock } from '../../mock/service/oldCalendarServiceMock';
import { playerDataServiceMock } from '../../mock/service/playerDataServiceMock';
import { raceDataServiceMock } from '../../mock/service/raceDataServiceMock';

describe('BoatraceRaceCalendarUseCase', () => {
    let calendarService: jest.Mocked<ICalendarService>;
    let oldCalendarService: jest.Mocked<
        IOldCalendarService<BoatraceRaceEntity>
    >;
    let raceDataService: jest.Mocked<
        IRaceDataService<BoatraceRaceEntity, BoatracePlaceEntity>
    >;
    let playerDataService: jest.Mocked<IPlayerDataService>;
    let useCase: BoatraceRaceCalendarUseCase;

    beforeEach(() => {
        calendarService = calendarServiceMock();
        container.registerInstance<ICalendarService>(
            'PublicGamblingCalendarService',
            calendarService,
        );

        oldCalendarService = oldCalendarServiceMock<BoatraceRaceEntity>();
        container.registerInstance<IOldCalendarService<BoatraceRaceEntity>>(
            'BoatraceCalendarService',
            oldCalendarService,
        );

        raceDataService = raceDataServiceMock<
            BoatraceRaceEntity,
            BoatracePlaceEntity
        >();
        container.registerInstance<
            IRaceDataService<BoatraceRaceEntity, BoatracePlaceEntity>
        >('BoatraceRaceDataService', raceDataService);

        playerDataService = playerDataServiceMock();
        container.registerInstance<IPlayerDataService>(
            'PlayerDataService',
            playerDataService,
        );
        useCase = container.resolve(BoatraceRaceCalendarUseCase);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('updateRacesToCalendar', () => {
        it('イベントが追加・削除されること', async () => {
            const mockCalendarDataList: CalendarData[] = Array.from(
                { length: 8 },
                (_, i: number) =>
                    baseBoatraceCalendarData.copy({
                        id: `boatrace2024122920${(i + 1).toXDigits(2)}`,
                    }),
            );
            const mockRaceEntityList: BoatraceRaceEntity[] = [
                ...Array.from({ length: 5 }, (_, i: number) =>
                    baseBoatraceRaceEntity.copy({
                        id: `boatrace2024122920${(i + 1).toXDigits(2)}`,
                    }),
                ),
                ...Array.from({ length: 3 }, (_, i: number) =>
                    baseBoatraceRaceEntity.copy({
                        id: `boatrace2024122920${(i + 6).toXDigits(2)}`,
                        raceData: baseBoatraceRaceEntity.raceData.copy({
                            grade: '一般',
                        }),
                    }),
                ),
            ];

            const expectCalendarDataList = {
                boatrace: Array.from({ length: 3 }, (_, i: number) =>
                    baseBoatraceCalendarData.copy({
                        id: `boatrace2024122920${(i + 6).toXDigits(2)}`,
                    }),
                ),
                jra: [],
                nar: [],
                world: [],
                keirin: [],
                autorace: [],
            };
            const expectRaceEntityList: BoatraceRaceEntity[] = Array.from(
                { length: 5 },
                (_, i: number) =>
                    baseBoatraceRaceEntity.copy({
                        id: `boatrace2024122920${(i + 1).toXDigits(2)}`,
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
                BoatraceSpecifiedGradeList,
            );

            // モックが呼び出されたことを確認
            expect(calendarService.fetchEvents).toHaveBeenCalledWith(
                startDate,
                finishDate,
                ['boatrace'],
            );

            // deleteEventsが呼び出された回数を確認
            expect(calendarService.deleteEvents).toHaveBeenCalledTimes(1);
            expect(calendarService.deleteEvents).toHaveBeenCalledWith(
                expectCalendarDataList,
            );
            expect(oldCalendarService.upsertEvents).toHaveBeenCalledTimes(1);
            expect(oldCalendarService.upsertEvents).toHaveBeenCalledWith(
                expectRaceEntityList,
            );
        });
    });
});
