import 'reflect-metadata'; // reflect-metadataをインポート

import { container } from 'tsyringe';

import type { CalendarData } from '../../../../../lib/src/domain/calendarData';
import type { ICalendarService } from '../../../../../lib/src/service/interface/ICalendarService';
import type { IPlayerDataService } from '../../../../../lib/src/service/interface/IPlayerDataService';
import type { IRaceDataService } from '../../../../../lib/src/service/interface/IRaceDataService';
import { PublicGamblingCalendarUseCase } from '../../../../../lib/src/usecase/implement/publicGamblingCalendarUseCase';
import type { IRaceCalendarUseCase } from '../../../../../lib/src/usecase/interface/IRaceCalendarUseCase';
import {
    AutoraceSpecifiedGradeList,
    BoatraceSpecifiedGradeList,
    JraSpecifiedGradeList,
    KeirinSpecifiedGradeList,
    NarSpecifiedGradeList,
    WorldSpecifiedGradeList,
} from '../../../../../lib/src/utility/data/common/gradeType';
import { RaceType } from '../../../../../lib/src/utility/raceType';
import {
    baseAutoraceCalendarData,
    baseAutoraceRaceEntity,
} from '../../mock/common/baseAutoraceData';
import {
    baseBoatraceCalendarData,
    baseBoatraceRaceEntity,
} from '../../mock/common/baseBoatraceData';
import {
    baseJraCalendarData,
    baseJraRaceEntity,
} from '../../mock/common/baseJraData';
import {
    baseKeirinCalendarData,
    baseKeirinRaceEntity,
} from '../../mock/common/baseKeirinData';
import {
    baseNarCalendarData,
    baseNarRaceEntity,
} from '../../mock/common/baseNarData';
import {
    baseWorldCalendarData,
    baseWorldRaceEntity,
} from '../../mock/common/baseWorldData';
import { calendarServiceMock } from '../../mock/service/calendarServiceMock';
import { playerDataServiceMock } from '../../mock/service/playerDataServiceMock';
import { raceDataServiceMock } from '../../mock/service/raceDataServiceMock';

describe('PublicGamblingRaceCalendarUseCase', () => {
    let calendarService: jest.Mocked<ICalendarService>;
    let raceDataService: jest.Mocked<IRaceDataService>;
    let playerDataService: jest.Mocked<IPlayerDataService>;
    let useCase: IRaceCalendarUseCase;

    beforeEach(() => {
        calendarService = calendarServiceMock();
        container.registerInstance<ICalendarService>(
            'PublicGamblingCalendarService',
            calendarService,
        );

        raceDataService = raceDataServiceMock();
        container.registerInstance<IRaceDataService>(
            'PublicGamblingRaceDataService',
            raceDataService,
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
                [
                    RaceType.JRA,
                    RaceType.NAR,
                    RaceType.WORLD,
                    RaceType.KEIRIN,
                    RaceType.BOATRACE,
                    RaceType.AUTORACE,
                ],
            );

            expect(calendarService.fetchEvents).toHaveBeenCalledWith(
                startDate,
                finishDate,
                [
                    RaceType.JRA,
                    RaceType.NAR,
                    RaceType.WORLD,
                    RaceType.KEIRIN,
                    RaceType.BOATRACE,
                    RaceType.AUTORACE,
                ],
            );
            expect(result).toEqual(mockCalendarData);
        });
    });

    it('イベントが追加・削除されること（複数）', async () => {
        const mockCalendarDataList: CalendarData[] = [
            ...Array.from({ length: 8 }, (_, i: number) =>
                baseJraCalendarData.copy({
                    id: `jra2024122920${(i + 1).toXDigits(2)}`,
                }),
            ),
            ...Array.from({ length: 8 }, (_, i: number) =>
                baseNarCalendarData.copy({
                    id: `nar2024122920${(i + 1).toXDigits(2)}`,
                }),
            ),
            ...Array.from({ length: 8 }, (_, i: number) =>
                baseWorldCalendarData.copy({
                    id: `world2024122920${(i + 1).toXDigits(2)}`,
                }),
            ),
            ...Array.from({ length: 8 }, (_, i: number) =>
                baseKeirinCalendarData.copy({
                    id: `keirin2024122920${(i + 1).toXDigits(2)}`,
                }),
            ),
            ...Array.from({ length: 8 }, (_, i: number) =>
                baseBoatraceCalendarData.copy({
                    id: `boatrace2024122920${(i + 1).toXDigits(2)}`,
                }),
            ),
            ...Array.from({ length: 8 }, (_, i: number) =>
                baseAutoraceCalendarData.copy({
                    id: `autorace2024122920${(i + 1).toXDigits(2)}`,
                }),
            ),
        ];

        const mockRaceEntityList = {
            jra: Array.from({ length: 5 }, (_, i: number) =>
                baseJraRaceEntity.copy({
                    id: `jra2024122920${(i + 1).toXDigits(2)}`,
                }),
            ),
            nar: Array.from({ length: 5 }, (_, i: number) =>
                baseNarRaceEntity.copy({
                    id: `nar2024122920${(i + 1).toXDigits(2)}`,
                }),
            ),
            world: Array.from({ length: 5 }, (_, i: number) =>
                baseWorldRaceEntity.copy({
                    id: `world2024122920${(i + 1).toXDigits(2)}`,
                }),
            ),
            keirin: Array.from({ length: 5 }, (_, i: number) =>
                baseKeirinRaceEntity.copy({
                    id: `keirin2024122920${(i + 1).toXDigits(2)}`,
                }),
            ),
            boatrace: Array.from({ length: 5 }, (_, i: number) =>
                baseBoatraceRaceEntity.copy({
                    id: `boatrace2024122920${(i + 1).toXDigits(2)}`,
                }),
            ),
            autorace: Array.from({ length: 5 }, (_, i: number) =>
                baseAutoraceRaceEntity.copy({
                    id: `autorace2024122920${(i + 1).toXDigits(2)}`,
                }),
            ),
        };

        const expectDeleteCalendarDataList = {
            jra: Array.from({ length: 3 }, (_, i: number) =>
                baseJraCalendarData.copy({
                    id: `jra2024122920${(i + 6).toXDigits(2)}`,
                }),
            ),
            nar: Array.from({ length: 3 }, (_, i: number) =>
                baseNarCalendarData.copy({
                    id: `nar2024122920${(i + 6).toXDigits(2)}`,
                }),
            ),
            world: Array.from({ length: 3 }, (_, i: number) =>
                baseWorldCalendarData.copy({
                    id: `world2024122920${(i + 6).toXDigits(2)}`,
                }),
            ),
            keirin: Array.from({ length: 3 }, (_, i: number) =>
                baseKeirinCalendarData.copy({
                    id: `keirin2024122920${(i + 6).toXDigits(2)}`,
                }),
            ),
            boatrace: Array.from({ length: 3 }, (_, i: number) =>
                baseBoatraceCalendarData.copy({
                    id: `boatrace2024122920${(i + 6).toXDigits(2)}`,
                }),
            ),
            autorace: Array.from({ length: 3 }, (_, i: number) =>
                baseAutoraceCalendarData.copy({
                    id: `autorace2024122920${(i + 6).toXDigits(2)}`,
                }),
            ),
        };
        const expectRaceEntityList = mockRaceEntityList;

        // モックの戻り値を設定
        calendarService.fetchEvents.mockResolvedValue(mockCalendarDataList);

        raceDataService.fetchRaceEntityList.mockResolvedValue({
            jra: mockRaceEntityList.jra,
            nar: mockRaceEntityList.nar,
            world: mockRaceEntityList.world,
            keirin: mockRaceEntityList.keirin,
            boatrace: mockRaceEntityList.boatrace,
            autorace: mockRaceEntityList.autorace,
        });

        const startDate = new Date('2024-02-01');
        const finishDate = new Date('2024-12-31');

        await useCase.updateRacesToCalendar(startDate, finishDate, {
            jra: JraSpecifiedGradeList,
            nar: NarSpecifiedGradeList,
            world: WorldSpecifiedGradeList,
            keirin: KeirinSpecifiedGradeList,
            autorace: AutoraceSpecifiedGradeList,
            boatrace: BoatraceSpecifiedGradeList,
        });

        // モックが呼び出されたことを確認
        expect(calendarService.fetchEvents).toHaveBeenCalledWith(
            startDate,
            finishDate,
            [
                RaceType.JRA,
                RaceType.NAR,
                RaceType.WORLD,
                RaceType.KEIRIN,
                RaceType.AUTORACE,
                RaceType.BOATRACE,
            ],
        );

        // deleteEventsが呼び出された回数を確認
        expect(calendarService.deleteEvents).toHaveBeenCalledTimes(1);
        expect(calendarService.deleteEvents).toHaveBeenCalledWith(
            expectDeleteCalendarDataList,
        );
        expect(calendarService.upsertEvents).toHaveBeenCalledTimes(1);
        expect(calendarService.upsertEvents).toHaveBeenCalledWith(
            expectRaceEntityList,
        );
    });
});
