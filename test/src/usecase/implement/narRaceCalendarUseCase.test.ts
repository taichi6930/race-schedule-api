import 'reflect-metadata'; // reflect-metadataをインポート

import { container } from 'tsyringe';

import type { CalendarData } from '../../../../lib/src/domain/calendarData';
import type { NarPlaceEntity } from '../../../../lib/src/repository/entity/narPlaceEntity';
import type { NarRaceEntity } from '../../../../lib/src/repository/entity/narRaceEntity';
import type { ICalendarService } from '../../../../lib/src/service/interface/ICalendarService';
import type { IOldCalendarService } from '../../../../lib/src/service/interface/IOldCalendarService';
import type { IRaceDataService } from '../../../../lib/src/service/interface/IRaceDataService';
import { NarRaceCalendarUseCase } from '../../../../lib/src/usecase/implement/narRaceCalendarUseCase';
import { NarSpecifiedGradeList } from '../../../../lib/src/utility/data/nar/narGradeType';
import {
    baseNarCalendarData,
    baseNarRaceEntity,
} from '../../mock/common/baseNarData';
import { calendarServiceMock } from '../../mock/service/calendarServiceMock';
import { oldCalendarServiceMock } from '../../mock/service/oldCalendarServiceMock';
import { raceDataServiceMock } from '../../mock/service/raceDataServiceMock';

describe('NarRaceCalendarUseCase', () => {
    let calendarService: jest.Mocked<ICalendarService>;
    let oldCalendarService: jest.Mocked<IOldCalendarService<NarRaceEntity>>;
    let raceDataService: jest.Mocked<
        IRaceDataService<NarRaceEntity, NarPlaceEntity>
    >;
    let useCase: NarRaceCalendarUseCase;

    beforeEach(() => {
        calendarService = calendarServiceMock();
        container.registerInstance<ICalendarService>(
            'PublicGamblingCalendarService',
            calendarService,
        );

        oldCalendarService = oldCalendarServiceMock<NarRaceEntity>();
        container.registerInstance<IOldCalendarService<NarRaceEntity>>(
            'NarCalendarService',
            oldCalendarService,
        );

        raceDataService = raceDataServiceMock<NarRaceEntity, NarPlaceEntity>();
        container.registerInstance<
            IRaceDataService<NarRaceEntity, NarPlaceEntity>
        >('NarRaceDataService', raceDataService);

        useCase = container.resolve(NarRaceCalendarUseCase);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('updateRacesToCalendar', () => {
        it('イベントが追加・削除されること', async () => {
            const mockCalendarDataList: CalendarData[] = Array.from(
                { length: 8 },
                (_, i: number) =>
                    baseNarCalendarData.copy({
                        id: `nar2024122920${(i + 1).toXDigits(2)}`,
                    }),
            );
            const mockRaceEntityList: NarRaceEntity[] = Array.from(
                { length: 5 },
                (_, i: number) =>
                    baseNarRaceEntity.copy({
                        id: `nar2024122920${(i + 1).toXDigits(2)}`,
                    }),
            );

            const expectCalendarDataList = {
                nar: Array.from({ length: 3 }, (_, i: number) =>
                    baseNarCalendarData.copy({
                        id: `nar2024122920${(i + 6).toXDigits(2)}`,
                    }),
                ),
                jra: [],
                world: [],
                keirin: [],
                boatrace: [],
                autorace: [],
            };
            const expectRaceEntityList: NarRaceEntity[] = mockRaceEntityList;

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
                NarSpecifiedGradeList,
            );

            // モックが呼び出されたことを確認
            expect(calendarService.fetchEvents).toHaveBeenCalledWith(
                startDate,
                finishDate,
                ['nar'],
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
