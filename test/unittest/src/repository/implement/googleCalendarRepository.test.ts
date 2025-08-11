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
} from '../../mock/common/baseBoatraceData';
import {
    baseJraCalendarData,
    baseJraCalendarDataFromGoogleCalendar,
} from '../../mock/common/baseJraData';
import {
    baseKeirinCalendarData,
    baseKeirinCalendarDataFromGoogleCalendar,
} from '../../mock/common/baseKeirinData';
import {
    baseNarCalendarData,
    baseNarCalendarDataFromGoogleCalendar,
} from '../../mock/common/baseNarData';
import {
    baseWorldCalendarData,
    baseWorldCalendarDataFromGoogleCalendar,
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

        // expect(calendarDataList).toContainEqual(baseAutoraceCalendarData);
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
        googleCalendarGateway.deleteCalendarData.mockResolvedValue();

        await repository.deleteEvents(RaceType.AUTORACE, [
            baseAutoraceCalendarData,
        ]);

        expect(googleCalendarGateway.deleteCalendarData).toHaveBeenCalled();
    });

    it('カレンダー情報が正常に削除できないこと', async () => {
        googleCalendarGateway.deleteCalendarData.mockRejectedValue(
            new Error('API Error'),
        );

        await repository.deleteEvents(RaceType.AUTORACE, [
            baseAutoraceCalendarData,
        ]);
        expect(googleCalendarGateway.deleteCalendarData).toHaveBeenCalled();
    });

    it('カレンダー情報が正常に登録できること', async () => {
        googleCalendarGateway.fetchCalendarData.mockRejectedValue(
            new Error('API Error'),
        );

        await repository.upsertEvents(RaceType.AUTORACE, [
            baseAutoraceRaceEntity,
        ]);

        expect(googleCalendarGateway.insertCalendarData).toHaveBeenCalled();
    });

    it('カレンダー情報が正常に更新できること', async () => {
        googleCalendarGateway.fetchCalendarData.mockResolvedValue(
            baseAutoraceCalendarDataFromGoogleCalendar,
        );

        await repository.upsertEvents(RaceType.AUTORACE, [
            baseAutoraceRaceEntity,
        ]);

        expect(googleCalendarGateway.updateCalendarData).toHaveBeenCalled();
    });

    it('カレンダー情報が正常に更新できないこと', async () => {
        googleCalendarGateway.insertCalendarData.mockRejectedValue(
            new Error('API Error'),
        );

        await repository.upsertEvents(RaceType.AUTORACE, [
            baseAutoraceRaceEntity,
        ]);
        expect(googleCalendarGateway.insertCalendarData).toHaveBeenCalled();
    });
});
