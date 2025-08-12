import 'reflect-metadata';

import { container } from 'tsyringe';

import type { ICalendarGateway } from '../../../../../lib/src/gateway/interface/iCalendarGateway';
import { SearchCalendarFilterEntity } from '../../../../../lib/src/repository/entity/searchCalendarFilterEntity';
import { GoogleCalendarRepository } from '../../../../../lib/src/repository/implement/googleCalendarRepository';
import type { ICalendarRepository } from '../../../../../lib/src/repository/interface/ICalendarRepository';
import { RaceType } from '../../../../../lib/src/utility/raceType';
import {
    baseAutoraceCalendarData,
    baseAutoraceCalendarDataFromGoogleCalendar,
    baseAutoraceRaceEntity,
} from '../../mock/common/baseAutoraceData';
import {
    baseBoatraceCalendarData,
    baseBoatraceCalendarDataFromGoogleCalendar,
    baseBoatraceRaceEntity,
} from '../../mock/common/baseBoatraceData';
import {
    baseJraCalendarData,
    baseJraCalendarDataFromGoogleCalendar,
    baseJraRaceEntity,
} from '../../mock/common/baseJraData';
import {
    baseKeirinCalendarData,
    baseKeirinCalendarDataFromGoogleCalendar,
    baseKeirinRaceEntity,
} from '../../mock/common/baseKeirinData';
import {
    baseNarCalendarData,
    baseNarCalendarDataFromGoogleCalendar,
    baseNarRaceEntity,
} from '../../mock/common/baseNarData';
import {
    baseWorldCalendarData,
    baseWorldCalendarDataFromGoogleCalendar,
    baseWorldRaceEntity,
} from '../../mock/common/baseWorldData';
import { mockGoogleCalendarGateway } from '../../mock/gateway/mockGoogleCalendarGateway';

describe('GoogleCalendarRepository', () => {
    let repository: ICalendarRepository;
    let googleCalendarGateway: jest.Mocked<ICalendarGateway>;

    beforeEach(() => {
        googleCalendarGateway = mockGoogleCalendarGateway();
        container.registerInstance(
            'GoogleCalendarGateway',
            googleCalendarGateway,
        );
        repository = container.resolve(GoogleCalendarRepository);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('一旦テストを通す', () => {
        expect(true).toBe(true);
    });

    it('カレンダー情報が正常に取得できること', async () => {
        googleCalendarGateway.fetchCalendarDataList.mockImplementation(
            async (raceType: RaceType) => {
                // searchFilterの引数も追加
                switch (raceType) {
                    case RaceType.JRA: {
                        return [baseJraCalendarDataFromGoogleCalendar];
                    }
                    case RaceType.NAR: {
                        return [baseNarCalendarDataFromGoogleCalendar];
                    }
                    case RaceType.WORLD: {
                        return [baseWorldCalendarDataFromGoogleCalendar];
                    }
                    case RaceType.KEIRIN: {
                        return [baseKeirinCalendarDataFromGoogleCalendar];
                    }
                    case RaceType.AUTORACE: {
                        return [baseAutoraceCalendarDataFromGoogleCalendar];
                    }
                    case RaceType.BOATRACE: {
                        return [baseBoatraceCalendarDataFromGoogleCalendar];
                    }
                    default: {
                        throw new Error(`Unsupported race type`);
                    }
                }
            },
        );
        const searchFilter = new SearchCalendarFilterEntity(
            new Date('2023-01-01'),
            new Date('2023-12-31'),
        );
        const calendarDataList = await repository.getEvents(
            [
                RaceType.JRA,
                RaceType.NAR,
                RaceType.WORLD,
                RaceType.KEIRIN,
                RaceType.AUTORACE,
                RaceType.BOATRACE,
            ],
            searchFilter,
        );

        expect(calendarDataList).toHaveLength(6);
        // calendarDataListの中に、baseAutoraceCalendarDataが含まれていることを確認
        const expectedData = [
            baseJraCalendarData,
            baseNarCalendarData,
            baseWorldCalendarData,
            baseKeirinCalendarData,
            baseAutoraceCalendarData,
            baseBoatraceCalendarData,
        ];
        for (const data of expectedData) {
            expect(calendarDataList).toContainEqual(data);
        }

        expect(googleCalendarGateway.fetchCalendarDataList).toHaveBeenCalled();
    });

    it('カレンダー情報が正常に取得できないこと', async () => {
        googleCalendarGateway.fetchCalendarDataList.mockRejectedValue(
            new Error('API Error'),
        );

        const searchFilter = new SearchCalendarFilterEntity(
            new Date('2023-01-01'),
            new Date('2023-12-31'),
        );
        const calendarDataList = await repository.getEvents(
            [
                RaceType.JRA,
                RaceType.NAR,
                RaceType.WORLD,
                RaceType.KEIRIN,
                RaceType.AUTORACE,
                RaceType.BOATRACE,
            ],
            searchFilter,
        );

        expect(calendarDataList).toHaveLength(0);
        expect(googleCalendarGateway.fetchCalendarDataList).toHaveBeenCalled();
    });

    it('カレンダー情報が正常に削除できること', async () => {
        for (const { raceType, baseCalendarData } of [
            { raceType: RaceType.JRA, baseCalendarData: baseJraCalendarData },
            { raceType: RaceType.NAR, baseCalendarData: baseNarCalendarData },
            {
                raceType: RaceType.WORLD,
                baseCalendarData: baseWorldCalendarData,
            },
            {
                raceType: RaceType.KEIRIN,
                baseCalendarData: baseKeirinCalendarData,
            },
            {
                raceType: RaceType.AUTORACE,
                baseCalendarData: baseAutoraceCalendarData,
            },
            {
                raceType: RaceType.BOATRACE,
                baseCalendarData: baseBoatraceCalendarData,
            },
        ]) {
            googleCalendarGateway.deleteCalendarData.mockResolvedValue();

            await repository.deleteEvents(raceType, [baseCalendarData]);
            expect(googleCalendarGateway.deleteCalendarData).toHaveBeenCalled();
        }
    });

    it('カレンダー情報が正常に削除できないこと', async () => {
        for (const { raceType, baseCalendarData } of [
            { raceType: RaceType.JRA, baseCalendarData: baseJraCalendarData },
            { raceType: RaceType.NAR, baseCalendarData: baseNarCalendarData },
            {
                raceType: RaceType.WORLD,
                baseCalendarData: baseWorldCalendarData,
            },
            {
                raceType: RaceType.KEIRIN,
                baseCalendarData: baseKeirinCalendarData,
            },
            {
                raceType: RaceType.AUTORACE,
                baseCalendarData: baseAutoraceCalendarData,
            },
            {
                raceType: RaceType.BOATRACE,
                baseCalendarData: baseBoatraceCalendarData,
            },
        ]) {
            googleCalendarGateway.deleteCalendarData.mockRejectedValue(
                new Error('API Error'),
            );

            await repository.deleteEvents(raceType, [baseCalendarData]);
            expect(googleCalendarGateway.deleteCalendarData).toHaveBeenCalled();
        }
    });

    it('カレンダー情報が正常に登録できること', async () => {
        for (const { raceType, baseRaceEntityList } of [
            { raceType: RaceType.JRA, baseRaceEntityList: [baseJraRaceEntity] },
            { raceType: RaceType.NAR, baseRaceEntityList: [baseNarRaceEntity] },
            {
                raceType: RaceType.WORLD,
                baseRaceEntityList: [baseWorldRaceEntity],
            },
            {
                raceType: RaceType.KEIRIN,
                baseRaceEntityList: [baseKeirinRaceEntity],
            },
            {
                raceType: RaceType.AUTORACE,
                baseRaceEntityList: [baseAutoraceRaceEntity],
            },
            {
                raceType: RaceType.BOATRACE,
                baseRaceEntityList: [baseBoatraceRaceEntity],
            },
        ]) {
            googleCalendarGateway.fetchCalendarData.mockRejectedValue(
                new Error('API Error'),
            );

            await repository.upsertEvents(raceType, baseRaceEntityList);

            expect(googleCalendarGateway.insertCalendarData).toHaveBeenCalled();
        }
    });

    it('カレンダー情報が正常に更新できること', async () => {
        for (const {
            raceType,
            baseRaceEntityList,
            baseCalendarDataFromGoogleCalendar,
        } of [
            {
                raceType: RaceType.JRA,
                baseRaceEntityList: [baseJraRaceEntity],
                baseCalendarDataFromGoogleCalendar:
                    baseJraCalendarDataFromGoogleCalendar,
            },
            {
                raceType: RaceType.NAR,
                baseRaceEntityList: [baseNarRaceEntity],
                baseCalendarDataFromGoogleCalendar:
                    baseNarCalendarDataFromGoogleCalendar,
                baseNarCalendarDataFromGoogleCalendar,
            },
            {
                raceType: RaceType.WORLD,
                baseRaceEntityList: [baseWorldRaceEntity],
                baseCalendarDataFromGoogleCalendar:
                    baseWorldCalendarDataFromGoogleCalendar,
            },
            {
                raceType: RaceType.KEIRIN,
                baseRaceEntityList: [baseKeirinRaceEntity],
                baseCalendarDataFromGoogleCalendar:
                    baseKeirinCalendarDataFromGoogleCalendar,
            },
            {
                raceType: RaceType.AUTORACE,
                baseRaceEntityList: [baseAutoraceRaceEntity],
                baseCalendarDataFromGoogleCalendar:
                    baseAutoraceCalendarDataFromGoogleCalendar,
            },
            {
                raceType: RaceType.BOATRACE,
                baseRaceEntityList: [baseBoatraceRaceEntity],
                baseCalendarDataFromGoogleCalendar:
                    baseBoatraceCalendarDataFromGoogleCalendar,
            },
        ]) {
            googleCalendarGateway.fetchCalendarData.mockResolvedValue(
                baseCalendarDataFromGoogleCalendar,
            );

            await repository.upsertEvents(raceType, baseRaceEntityList);

            expect(googleCalendarGateway.updateCalendarData).toHaveBeenCalled();
        }
    });

    it('カレンダー情報が正常に更新できないこと', async () => {
        for (const { raceType, baseRaceEntityList } of [
            { raceType: RaceType.JRA, baseRaceEntityList: [baseJraRaceEntity] },
            { raceType: RaceType.NAR, baseRaceEntityList: [baseNarRaceEntity] },
            {
                raceType: RaceType.WORLD,
                baseRaceEntityList: [baseWorldRaceEntity],
            },
            {
                raceType: RaceType.KEIRIN,
                baseRaceEntityList: [baseKeirinRaceEntity],
            },
            {
                raceType: RaceType.AUTORACE,
                baseRaceEntityList: [baseAutoraceRaceEntity],
            },
            {
                raceType: RaceType.BOATRACE,
                baseRaceEntityList: [baseBoatraceRaceEntity],
            },
        ]) {
            googleCalendarGateway.insertCalendarData.mockRejectedValue(
                new Error('API Error'),
            );
            await repository.upsertEvents(raceType, baseRaceEntityList);

            expect(googleCalendarGateway.insertCalendarData).toHaveBeenCalled();
        }
    });
});
