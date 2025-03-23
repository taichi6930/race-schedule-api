import { format } from 'date-fns';
import type { calendar_v3 } from 'googleapis';

import { WorldPlaceCodeMap } from '../../utility/data/world/worldRaceCourse';
import { allowedEnvs, ENV } from '../../utility/env';
import { formatDate } from '../../utility/format';
import { Logger } from '../../utility/logger';
import type { ICalendarGateway } from '../interface/iCalendarGateway';

type RaceType = 'jra' | 'nar' | 'world' | 'keirin' | 'autorace' | 'boatrace';
/**
 * Googleカレンダーのモックサービス
 */
export class MockGoogleCalendarGateway implements ICalendarGateway {
    constructor(private readonly raceType: RaceType) {
        this.setCalendarData();
    }
    private static mockCalendarData: Record<
        string,
        calendar_v3.Schema$Event[]
    > = {
        jra: [],
        nar: [],
        world: [],
        keirin: [],
        autorace: [],
        boatrace: [],
    };

    private static isInitialized = false;

    private setCalendarData(): void {
        if (MockGoogleCalendarGateway.isInitialized) {
            return;
        }
        MockGoogleCalendarGateway.isInitialized = true;
        switch (ENV) {
            case allowedEnvs.production: // ENV が production の場合、GoogleCalendarGateway を使用
            case allowedEnvs.test:
            case allowedEnvs.localNoInitData:
            case allowedEnvs.local: {
                break;
            }
            case allowedEnvs.localInitMadeData: {
                // ENV が LOCAL_INIT_MADE_DATA の場合、データを後で設定したいので何もしない
                {
                    // 2024年のデータ366日分を作成
                    const startDate = new Date('2024-01-01');
                    const currentDate = new Date(startDate);
                    // whileで回していって、最初の日付の年数と異なったら終了
                    while (
                        currentDate.getFullYear() === startDate.getFullYear()
                    ) {
                        for (let i = 1; i <= 12; i++) {
                            let location = '';
                            let raceId = '';

                            switch (this.raceType) {
                                case 'world': {
                                    location = 'パリロンシャン';
                                    raceId = `${this.raceType}${format(currentDate, 'yyyyMMdd')}${WorldPlaceCodeMap[location]}${(i + 1).toXDigits(2)}`;
                                    break;
                                }
                                default: {
                                    break;
                                }
                            }
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
                                            i + 6,
                                            0,
                                        ),
                                    ),
                                    timeZone: 'Asia/Tokyo',
                                },
                                end: {
                                    // 終了時刻は発走時刻から10分後とする
                                    dateTime: formatDate(
                                        new Date(
                                            currentDate.getFullYear(),
                                            currentDate.getMonth(),
                                            currentDate.getDate(),
                                            i + 6,
                                            10,
                                        ),
                                    ),
                                    timeZone: 'Asia/Tokyo',
                                },
                                colorId: '8',
                                description: 'testDescription',
                            };
                            MockGoogleCalendarGateway.mockCalendarData[
                                this.raceType
                            ].push(calendarData);
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

    @Logger
    fetchCalendarDataList(
        startDate: Date,
        finishDate: Date,
    ): Promise<calendar_v3.Schema$Event[]> {
        console.log(MockGoogleCalendarGateway.mockCalendarData[this.raceType]);
        console.log(startDate);
        console.log(finishDate);
        const raceData = MockGoogleCalendarGateway.mockCalendarData[
            this.raceType
        ]
            .filter(
                (data) =>
                    new Date(data.start?.dateTime ?? '') >= startDate &&
                    new Date(data.start?.dateTime ?? '') <= finishDate,
            )
            // 日付順に並び替え
            .sort(
                (a, b) =>
                    new Date(a.start?.dateTime ?? '').getTime() -
                    new Date(b.start?.dateTime ?? '').getTime(),
            );
        return Promise.resolve(raceData);
    }

    fetchCalendarData(eventId: string): Promise<calendar_v3.Schema$Event> {
        const raceData = MockGoogleCalendarGateway.mockCalendarData[
            this.raceType
        ].find((data) => data.id === eventId);
        if (!raceData) {
            throw new Error('Not found');
        }
        return Promise.resolve(raceData);
    }

    @Logger
    updateCalendarData(calendarData: calendar_v3.Schema$Event): Promise<void> {
        try {
            // mockCalendarDataに存在するかどうかの判定
            const index = MockGoogleCalendarGateway.mockCalendarData[
                this.raceType
            ].findIndex((data) => data.id === calendarData.id);
            // 存在しない場合は新規追加
            if (index === -1) {
                throw new Error('Event already exists');
            }
            MockGoogleCalendarGateway.mockCalendarData[this.raceType][index] =
                calendarData;
        } catch (error) {
            console.error(
                'Google Calendar APIからのイベント取得に失敗しました',
                error,
            );
        }
        return Promise.resolve();
    }

    insertCalendarData(calendarData: calendar_v3.Schema$Event): Promise<void> {
        try {
            // mockCalendarDataに存在するかどうかの判定
            const index = MockGoogleCalendarGateway.mockCalendarData[
                this.raceType
            ].findIndex((data) => data.id === calendarData.id);
            // 存在しない場合は新規追加
            if (index !== -1) {
                throw new Error('Not found');
            }
            MockGoogleCalendarGateway.mockCalendarData[this.raceType].push(
                calendarData,
            );
        } catch (error) {
            console.error(
                'Google Calendar APIからのイベント取得に失敗しました',
                error,
            );
        }
        return Promise.resolve();
    }

    deleteCalendarData(eventId: string): Promise<void> {
        try {
            // mockCalendarDataに存在するかどうかの判定
            const index = MockGoogleCalendarGateway.mockCalendarData[
                this.raceType
            ].findIndex((data) => data.id === eventId);
            // 存在しない場合はエラー
            if (index === -1) {
                throw new Error('Not found');
            }
            MockGoogleCalendarGateway.mockCalendarData[this.raceType].splice(
                index,
                1,
            );
        } catch (error) {
            console.error(
                'Google Calendar APIからのイベント取得に失敗しました',
                error,
            );
        }
        return Promise.resolve();
    }
}
