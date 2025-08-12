import 'reflect-metadata';

import { container } from 'tsyringe';

import type { CalendarData } from '../../../../../lib/src/domain/calendarData';
import { SearchCalendarFilterEntity } from '../../../../../lib/src/repository/entity/searchCalendarFilterEntity';
import type { ICalendarRepository } from '../../../../../lib/src/repository/interface/ICalendarRepository';
import { PublicGamblingCalendarService } from '../../../../../lib/src/service/implement/publicGamblingCalendarService';
import type { ICalendarService } from '../../../../../lib/src/service/interface/ICalendarService';
import { RaceType } from '../../../../../lib/src/utility/raceType';
import type { TestSetup } from '../../../../utility/testSetupHelper';
import { setupTestMock } from '../../../../utility/testSetupHelper';
import {
    baseAutoraceCalendarData,
    baseAutoraceRaceEntityList,
} from '../../mock/common/baseAutoraceData';
import {
    baseBoatraceCalendarData,
    baseBoatraceRaceEntityList,
} from '../../mock/common/baseBoatraceData';
import {
    baseJraCalendarData,
    baseJraRaceEntityList,
} from '../../mock/common/baseJraData';
import {
    baseKeirinCalendarData,
    baseKeirinRaceEntityList,
} from '../../mock/common/baseKeirinData';
import {
    baseNarCalendarData,
    baseNarRaceEntityList,
} from '../../mock/common/baseNarData';
import {
    baseWorldCalendarData,
    baseWorldRaceEntityList,
} from '../../mock/common/baseWorldData';

describe('PublicGamblingCalendarService', () => {
    let service: ICalendarService;
    let calendarRepository: jest.Mocked<ICalendarRepository>;

    beforeEach(() => {
        const setup: TestSetup = setupTestMock();
        ({ calendarRepository } = setup);
        service = container.resolve(PublicGamblingCalendarService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('getEvents', () => {
        it('カレンダーのイベントの取得が正常に行われること', async () => {
            const startDate = new Date('2023-01-01');
            const finishDate = new Date('2023-01-31');
            const calendarDataList: CalendarData[] = [
                baseJraCalendarData,
                baseNarCalendarData,
                baseWorldCalendarData,
                baseKeirinCalendarData,
                baseBoatraceCalendarData,
                baseAutoraceCalendarData,
            ];

            calendarRepository.getEvents.mockImplementation(
                async (raceTypeList: RaceType[]) => {
                    const CalendarDataList: CalendarData[] = [];
                    if (raceTypeList.includes(RaceType.JRA)) {
                        CalendarDataList.push(baseJraCalendarData);
                    }
                    if (raceTypeList.includes(RaceType.NAR)) {
                        CalendarDataList.push(baseNarCalendarData);
                    }
                    if (raceTypeList.includes(RaceType.WORLD)) {
                        CalendarDataList.push(baseWorldCalendarData);
                    }
                    if (raceTypeList.includes(RaceType.KEIRIN)) {
                        CalendarDataList.push(baseKeirinCalendarData);
                    }
                    if (raceTypeList.includes(RaceType.BOATRACE)) {
                        CalendarDataList.push(baseBoatraceCalendarData);
                    }
                    if (raceTypeList.includes(RaceType.AUTORACE)) {
                        CalendarDataList.push(baseAutoraceCalendarData);
                    }
                    return CalendarDataList;
                },
            );

            const result = await service.fetchEvents(startDate, finishDate, [
                RaceType.JRA,
                RaceType.NAR,
                RaceType.WORLD,
                RaceType.KEIRIN,
                RaceType.AUTORACE,
                RaceType.BOATRACE,
            ]);

            expect(calendarRepository.getEvents).toHaveBeenCalledWith(
                [
                    RaceType.JRA,
                    RaceType.NAR,
                    RaceType.WORLD,
                    RaceType.KEIRIN,
                    RaceType.AUTORACE,
                    RaceType.BOATRACE,
                ],
                new SearchCalendarFilterEntity(startDate, finishDate),
            );
            expect(result).toEqual(calendarDataList);
        });
    });

    describe('deleteEvents', () => {
        it('カレンダーのイベントの削除が正常に行われること', async () => {
            await service.deleteEvents({
                jra: [baseJraCalendarData],
                nar: [baseNarCalendarData],
                world: [baseWorldCalendarData],
                keirin: [baseKeirinCalendarData],
                boatrace: [baseBoatraceCalendarData],
                autorace: [baseAutoraceCalendarData],
            });

            expect(calendarRepository.deleteEvents).toHaveBeenCalledWith(
                RaceType.JRA,
                [baseJraCalendarData],
            );
            expect(calendarRepository.deleteEvents).toHaveBeenCalledWith(
                RaceType.NAR,
                [baseNarCalendarData],
            );
            expect(calendarRepository.deleteEvents).toHaveBeenCalledWith(
                RaceType.WORLD,
                [baseWorldCalendarData],
            );
            expect(calendarRepository.deleteEvents).toHaveBeenCalledWith(
                RaceType.KEIRIN,
                [baseKeirinCalendarData],
            );
            expect(calendarRepository.deleteEvents).toHaveBeenCalledWith(
                RaceType.BOATRACE,
                [baseBoatraceCalendarData],
            );
            expect(calendarRepository.deleteEvents).toHaveBeenCalledWith(
                RaceType.AUTORACE,
                [baseAutoraceCalendarData],
            );
        });

        it('削除対象のイベントが見つからない場合、削除処理が行われないこと', async () => {
            const consoleSpy = jest
                .spyOn(console, 'debug')
                .mockImplementation();

            await service.deleteEvents({
                jra: [],
                nar: [],
                world: [],
                keirin: [],
                boatrace: [],
                autorace: [],
            });

            expect(consoleSpy).toHaveBeenCalledWith(
                '削除対象のイベントが見つかりませんでした。',
            );
            expect(calendarRepository.deleteEvents).not.toHaveBeenCalled();

            consoleSpy.mockRestore();
        });
    });

    describe('upsertEvents', () => {
        it('カレンダーのイベントの更新が正常に行われること', async () => {
            await service.upsertEvents({
                jra: baseJraRaceEntityList,
                nar: baseNarRaceEntityList,
                world: baseWorldRaceEntityList,
                keirin: baseKeirinRaceEntityList,
                boatrace: baseBoatraceRaceEntityList,
                autorace: baseAutoraceRaceEntityList,
            });

            expect(calendarRepository.upsertEvents).toHaveBeenCalledWith(
                RaceType.JRA,
                baseJraRaceEntityList,
            );
            expect(calendarRepository.upsertEvents).toHaveBeenCalledWith(
                RaceType.NAR,
                baseNarRaceEntityList,
            );
            expect(calendarRepository.upsertEvents).toHaveBeenCalledWith(
                RaceType.WORLD,
                baseWorldRaceEntityList,
            );
            expect(calendarRepository.upsertEvents).toHaveBeenCalledWith(
                RaceType.KEIRIN,
                baseKeirinRaceEntityList,
            );
            expect(calendarRepository.upsertEvents).toHaveBeenCalledWith(
                RaceType.BOATRACE,
                baseBoatraceRaceEntityList,
            );
            expect(calendarRepository.upsertEvents).toHaveBeenCalledWith(
                RaceType.AUTORACE,
                baseAutoraceRaceEntityList,
            );
        });

        it('更新対象のイベントが見つからない場合、更新処理が行われないこと', async () => {
            const consoleSpy = jest
                .spyOn(console, 'debug')
                .mockImplementation();

            await service.upsertEvents({
                jra: [],
                nar: [],
                world: [],
                keirin: [],
                boatrace: [],
                autorace: [],
            });

            expect(consoleSpy).toHaveBeenCalledWith(
                '更新対象のイベントが見つかりませんでした。',
            );
            expect(calendarRepository.upsertEvents).not.toHaveBeenCalled();

            consoleSpy.mockRestore();
        });
    });
});
