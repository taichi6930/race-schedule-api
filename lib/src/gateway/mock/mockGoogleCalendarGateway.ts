import type { calendar_v3 } from 'googleapis';

import {
    RACE_TYPE_LIST_ALL_FOR_AWS,
    RaceType,
} from '../../../../src/utility/raceType';
import { defaultLocation } from '../../../../test/old/unittest/src/mock/common/baseCommonData';
import { allowedEnvs, ENV } from '../../utility/env';
import { formatDate } from '../../utility/format';
import { Logger } from '../../utility/logger';
import { generateRaceId } from '../../utility/validateAndType/raceId';
import { ICalendarGatewayForAWS } from '../interface/iCalendarGateway';

/**
 * Googleカレンダーのモックサービス
 */
export class MockGoogleCalendarGateway implements ICalendarGatewayForAWS {
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
            case allowedEnvs.production: // ENV が production の場合、GoogleCalendarGateway を使用
            case allowedEnvs.test:
            case allowedEnvs.localNoInitData:
            case allowedEnvs.githubActionsCi:
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
                        for (const raceType of RACE_TYPE_LIST_ALL_FOR_AWS) {
                            const location = defaultLocation[raceType];
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
                                        // 終了時刻は発走時刻から10分後とする
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

    @Logger
    public async fetchCalendarDataList(
        raceType: RaceType,
        startDate: Date,
        finishDate: Date,
    ): Promise<calendar_v3.Schema$Event[]> {
        const raceData = MockGoogleCalendarGateway.mockCalendarData[raceType]
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
            // mockCalendarDataに存在するかどうかの判定
            const index = MockGoogleCalendarGateway.mockCalendarData[
                raceType
            ].findIndex((data) => data.id === calendarData.id);
            // 存在しない場合は新規追加
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
            // mockCalendarDataに存在するかどうかの判定
            const index = MockGoogleCalendarGateway.mockCalendarData[
                raceType
            ].findIndex((data) => data.id === calendarData.id);
            // 存在しない場合は新規追加
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
            // mockCalendarDataに存在するかどうかの判定
            const index = MockGoogleCalendarGateway.mockCalendarData[
                raceType
            ].findIndex((data) => data.id === eventId);
            // 存在しない場合はエラー
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
