import type { calendar_v3 } from 'googleapis';

import { generateRaceId } from '../../utility/data/common/raceId';
import { allowedEnvs, ENV } from '../../utility/env';
import { formatDate } from '../../utility/format';
import { Logger } from '../../utility/logger';
import { RaceType } from '../../utility/raceType';
import { ICalendarGateway } from '../interface/iCalendarGateway';


export class MockGoogleCalendarGateway implements ICalendarGateway {
    public constructor() {
        this.setCalendarData();
    }
    private static readonly mockCalendarData: Record<
        string,
        calendar_v3.Schema$Event[]
    > = {
        JRA: [],
        NAR: [],
        OVERSEAS: [],
        KEIRIN: [],
        AUTORACE: [],
        BOATRACE: [],
    };

    private static isInitialized = false;

    private setCalendarData(): void {
        if (MockGoogleCalendarGateway.isInitialized) {
            return;
        }
        MockGoogleCalendarGateway.isInitialized = true;
        switch (ENV) {
            case allowedEnvs.production: 
            case allowedEnvs.test:
            case allowedEnvs.localNoInitData:
            case allowedEnvs.githubActionsCi:
            case allowedEnvs.local: {
                break;
            }
            case allowedEnvs.localInitMadeData: {
                
                {
                    
                    const startDate = new Date('2024-01-01');
                    const currentDate = new Date(startDate);
                    
                    while (
                        currentDate.getFullYear() === startDate.getFullYear()
                    ) {
                        for (const raceType of [
                            RaceType.JRA,
                            RaceType.NAR,
                            RaceType.KEIRIN,
                            RaceType.AUTORACE,
                            RaceType.BOATRACE,
                            RaceType.OVERSEAS,
                        ]) {
                            const location = this.defaultLocation[raceType];
                            for (
                                let raceNumber = 1;
                                raceNumber <= 12;
                                raceNumber++
                            ) {
                                const raceId = generateRaceId(
                                    raceType,
                                    currentDate,
                                    location,
                                    raceNumber,
                                );
                                const calendarData: calendar_v3.Schema$Event = {
                                    id: raceId,
                                    summary: `テストレース${raceId}`,
                                    location: location,
                                    start: {
                                        dateTime: formatDate(
                                            new Date(
                                                currentDate.getFullYear(),
                                                currentDate.getMonth(),
                                                currentDate.getDate(),
                                                raceNumber + 6,
                                                0,
                                            ),
                                        ),
                                        timeZone: 'Asia/Tokyo',
                                    },
                                    end: {
                                        
                                        dateTime: formatDate(
                                            new Date(
                                                currentDate.getFullYear(),
                                                currentDate.getMonth(),
                                                currentDate.getDate(),
                                                raceNumber + 6,
                                                10,
                                            ),
                                        ),
                                        timeZone: 'Asia/Tokyo',
                                    },
                                    colorId: '8',
                                    description: 'testDescription',
                                };
                                MockGoogleCalendarGateway.mockCalendarData[
                                    raceType
                                ].push(calendarData);
                            }
                        }
                        currentDate.setDate(currentDate.getDate() + 1);
                    }
                }
                break;
            }
            default: {
                throw new Error('Invalid ENV value');
            }
        }
    }

    private readonly defaultLocation = {
        [RaceType.JRA]: '東京',
        [RaceType.NAR]: '大井',
        [RaceType.OVERSEAS]: 'パリロンシャン',
        [RaceType.KEIRIN]: '平塚',
        [RaceType.AUTORACE]: '川口',
        [RaceType.BOATRACE]: '浜名湖',
    };

    @Logger
    public async fetchCalendarDataList(
        raceType: RaceType,
        startDate: Date,
        finishDate: Date,
    ): Promise<calendar_v3.Schema$Event[]> {
        console.log(MockGoogleCalendarGateway.mockCalendarData[raceType]);
        const raceData = MockGoogleCalendarGateway.mockCalendarData[raceType]
            .filter(
                (data) =>
                    new Date(data.start?.dateTime ?? '') >= startDate &&
                    new Date(data.start?.dateTime ?? '') <= finishDate,
            )
            
            .sort(
                (a, b) =>
                    new Date(a.start?.dateTime ?? '').getTime() -
                    new Date(b.start?.dateTime ?? '').getTime(),
            );
        await new Promise((resolve) => setTimeout(resolve, 0));
        return raceData;
    }

    public async fetchCalendarData(
        raceType: RaceType,
        eventId: string,
    ): Promise<calendar_v3.Schema$Event> {
        const raceData = MockGoogleCalendarGateway.mockCalendarData[
            raceType
        ].find((data) => data.id === eventId);
        if (!raceData) {
            throw new Error('Not found');
        }
        await new Promise((resolve) => setTimeout(resolve, 0));
        return raceData;
    }

    @Logger
    public async updateCalendarData(
        raceType: RaceType,
        calendarData: calendar_v3.Schema$Event,
    ): Promise<void> {
        try {
            
            const index = MockGoogleCalendarGateway.mockCalendarData[
                raceType
            ].findIndex((data) => data.id === calendarData.id);
            
            if (index === -1) {
                throw new Error('Event already exists');
            }
            MockGoogleCalendarGateway.mockCalendarData[raceType][index] =
                calendarData;
        } catch (error) {
            console.error(
                'Google Calendar APIからのイベント取得に失敗しました',
                error,
            );
        }
        await Promise.resolve();
    }

    public async insertCalendarData(
        raceType: RaceType,
        calendarData: calendar_v3.Schema$Event,
    ): Promise<void> {
        try {
            
            const index = MockGoogleCalendarGateway.mockCalendarData[
                raceType
            ].findIndex((data) => data.id === calendarData.id);
            
            if (index !== -1) {
                throw new Error('Not found');
            }
            MockGoogleCalendarGateway.mockCalendarData[raceType].push(
                calendarData,
            );
        } catch (error) {
            console.error(
                'Google Calendar APIからのイベント取得に失敗しました',
                error,
            );
        }
        await Promise.resolve();
    }

    public async deleteCalendarData(
        raceType: RaceType,
        eventId: string,
    ): Promise<void> {
        try {
            
            const index = MockGoogleCalendarGateway.mockCalendarData[
                raceType
            ].findIndex((data) => data.id === eventId);
            
            if (index === -1) {
                throw new Error('Not found');
            }
            MockGoogleCalendarGateway.mockCalendarData[raceType].splice(
                index,
                1,
            );
        } catch (error) {
            console.error(
                'Google Calendar APIからのイベント取得に失敗しました',
                error,
            );
        }
        await Promise.resolve();
    }
}
