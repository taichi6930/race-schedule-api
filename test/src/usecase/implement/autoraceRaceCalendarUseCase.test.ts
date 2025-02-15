import 'reflect-metadata'; // reflect-metadataをインポート

import { container } from 'tsyringe';

import type { CalendarData } from '../../../../lib/src/domain/calendarData';
import type { AutoracePlaceEntity } from '../../../../lib/src/repository/entity/autoracePlaceEntity';
import type { AutoraceRaceEntity } from '../../../../lib/src/repository/entity/autoraceRaceEntity';
import type { ICalendarService } from '../../../../lib/src/service/interface/ICalendarService';
import type { IRaceDataService } from '../../../../lib/src/service/interface/IRaceDataService';
import { AutoraceRaceCalendarUseCase } from '../../../../lib/src/usecase/implement/autoraceRaceCalendarUseCase';
import { AutoraceSpecifiedGradeList } from '../../../../lib/src/utility/data/autorace/autoraceGradeType';
import {
    baseAutoraceCalendarData,
    baseAutoraceRaceEntity,
} from '../../mock/common/baseAutoraceData';
import { CalendarServiceMock } from '../../mock/service/calendarServiceMock';
import { RaceDataServiceMock } from '../../mock/service/raceDataServiceMock';

describe('AutoraceRaceCalendarUseCase', () => {
    let calendarServiceMock: jest.Mocked<ICalendarService<AutoraceRaceEntity>>;
    let autoraceRaceDataService: jest.Mocked<
        IRaceDataService<AutoraceRaceEntity, AutoracePlaceEntity>
    >;
    let useCase: AutoraceRaceCalendarUseCase;

    beforeEach(() => {
        // ICalendarServiceインターフェースの依存関係を登録
        calendarServiceMock = CalendarServiceMock<AutoraceRaceEntity>();
        container.register<ICalendarService<AutoraceRaceEntity>>(
            'AutoraceCalendarService',
            {
                useValue: calendarServiceMock,
            },
        );

        // AutoraceRaceDataServiceをコンテナに登録
        autoraceRaceDataService = RaceDataServiceMock<
            AutoraceRaceEntity,
            AutoracePlaceEntity
        >();
        container.register<
            IRaceDataService<AutoraceRaceEntity, AutoracePlaceEntity>
        >('AutoraceRaceDataService', {
            useValue: autoraceRaceDataService,
        });

        // AutoraceRaceCalendarUseCaseをコンテナから取得
        useCase = container.resolve(AutoraceRaceCalendarUseCase);
    });

    describe('getRacesFromCalendar', () => {
        it('CalendarDataのリストが正常に返ってくること', async () => {
            const mockCalendarData: CalendarData[] = [baseAutoraceCalendarData];

            // モックの戻り値を設定
            calendarServiceMock.getEvents.mockResolvedValue(mockCalendarData);

            const startDate = new Date('2023-08-01');
            const finishDate = new Date('2023-08-31');

            const result = await useCase.getRacesFromCalendar(
                startDate,
                finishDate,
            );

            expect(calendarServiceMock.getEvents).toHaveBeenCalledWith(
                startDate,
                finishDate,
            );
            expect(result).toEqual(mockCalendarData);
        });
    });

    describe('updateRacesToCalendar', () => {
        it('CalendarList、RaceListもあり、IDが複数被る場合、イベントが追加・削除されること', async () => {
            const mockCalendarDataList: CalendarData[] = Array.from(
                { length: 8 },
                (_, i: number) =>
                    baseAutoraceCalendarData.copy({
                        id: `autorace2024122920${(i + 1).toXDigits(2)}`,
                    }),
            );
            const mockRaceEntityList: AutoraceRaceEntity[] = Array.from(
                { length: 5 },
                (_, i: number) =>
                    baseAutoraceRaceEntity.copy({
                        id: `autorace2024122920${(i + 1).toXDigits(2)}`,
                    }),
            );

            const expectCalendarDataList: CalendarData[] = Array.from(
                { length: 3 },
                (_, i: number) =>
                    baseAutoraceCalendarData.copy({
                        id: `autorace2024122920${(i + 6).toXDigits(2)}`,
                    }),
            );
            const expectRaceEntityList: AutoraceRaceEntity[] =
                mockRaceEntityList;

            // モックの戻り値を設定
            calendarServiceMock.getEvents.mockResolvedValue(
                mockCalendarDataList,
            );
            autoraceRaceDataService.fetchRaceEntityList.mockResolvedValue(
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
            expect(calendarServiceMock.getEvents).toHaveBeenCalledWith(
                startDate,
                finishDate,
            );

            // deleteEventsが呼び出された回数を確認
            expect(calendarServiceMock.deleteEvents).toHaveBeenCalledTimes(1);
            expect(calendarServiceMock.deleteEvents).toHaveBeenCalledWith(
                expectCalendarDataList,
            );
            expect(calendarServiceMock.upsertEvents).toHaveBeenCalledTimes(1);
            expect(calendarServiceMock.upsertEvents).toHaveBeenCalledWith(
                expectRaceEntityList,
            );
        });
    });
});
