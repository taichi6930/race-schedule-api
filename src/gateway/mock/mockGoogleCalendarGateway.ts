import type { calendar_v3 } from 'googleapis';

import type { RaceType } from '../../../packages/shared/src/types/raceType';
import { allowedEnvs, ENV } from '../../utility/env';
import type { IOldGoogleCalendarGateway } from '../interface/iOldGoogleCalendarGateway';

/**
 * Googleカレンダーのモックサービス
 */
export class MockGoogleCalendarGateway implements IOldGoogleCalendarGateway {
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
            case allowedEnvs.githubActionsCi:
            case allowedEnvs.local: {
                break;
            }
            default: {
                throw new Error('Invalid ENV value');
            }
        }
    }

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
        return raceData;
    }

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
