import type { calendar_v3 } from 'googleapis';
import { google } from 'googleapis';

import { createErrorMessage } from '../../utility/error';
import { Logger } from '../../utility/logger';
import type { ICalendarGateway } from '../interface/iCalendarGateway';

/**
 * Google Calendar Gateway - Googleカレンダーとの連携を行うゲートウェイ
 * google-auth-libraryとgoogleapisのバージョン互換性を考慮した実装
 */
export class GoogleCalendarGateway implements ICalendarGateway {
    private readonly calendar: calendar_v3.Calendar;
    private readonly calendarId: string;

    public constructor(calendarId: string) {
        // GoogleAPIキーを使用して認証
        const apiKey = process.env.GOOGLE_API_KEY ?? '';

        // カレンダーAPIの初期化（googleapis v150.0.1に対応）
        this.calendar = google.calendar({
            version: 'v3',
            auth: apiKey,
        });
        this.calendarId = calendarId;
    }

    @Logger
    public async fetchCalendarDataList(
        startDate: Date,
        finishDate: Date,
    ): Promise<calendar_v3.Schema$Event[]> {
        try {
            // orderBy: 'startTime'で開始時刻順に取得
            const response = await this.calendar.events.list({
                calendarId: this.calendarId,
                timeMin: startDate.toISOString(),
                timeMax: finishDate.toISOString(),
                singleEvents: true,
                orderBy: 'startTime',
            });
            return response.data.items ?? [];
        } catch (error) {
            throw new Error(
                createErrorMessage('Failed to get calendar list', error),
            );
        }
    }

    @Logger
    public async fetchCalendarData(
        eventId: string,
    ): Promise<calendar_v3.Schema$Event> {
        try {
            const response = await this.calendar.events.get({
                calendarId: this.calendarId,
                eventId,
            });
            return response.data;
        } catch (error) {
            throw new Error(
                createErrorMessage('Failed to get calendar', error),
            );
        }
    }

    @Logger
    public async updateCalendarData(
        calendarData: calendar_v3.Schema$Event,
    ): Promise<void> {
        try {
            const eventId = calendarData.id;
            if (!eventId) {
                throw new Error('イベントIDが指定されていません');
            }
            await this.calendar.events.update({
                calendarId: this.calendarId,
                eventId,
                requestBody: calendarData,
            });
        } catch (error) {
            throw new Error(
                createErrorMessage('Failed to update calendar event', error),
            );
        }
    }

    @Logger
    public async insertCalendarData(
        calendarData: calendar_v3.Schema$Event,
    ): Promise<void> {
        try {
            await this.calendar.events.insert({
                calendarId: this.calendarId,
                requestBody: calendarData,
            });
        } catch (error) {
            throw new Error(
                createErrorMessage('Failed to create calendar event', error),
            );
        }
    }

    @Logger
    public async deleteCalendarData(eventId: string): Promise<void> {
        try {
            await this.calendar.events.delete({
                calendarId: this.calendarId,
                eventId,
            });
        } catch (error) {
            throw new Error(
                createErrorMessage('Failed to delete calendar event', error),
            );
        }
    }
}
