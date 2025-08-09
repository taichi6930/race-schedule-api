import type { calendar_v3 } from 'googleapis';
import { google } from 'googleapis';

import { createErrorMessage } from '../../utility/error';
import { Logger } from '../../utility/logger';
import type { IOldCalendarGateway } from '../interface/iCalendarGateway';

export class GoogleCalendarGateway implements IOldCalendarGateway {
    private readonly calendar: calendar_v3.Calendar;
    private readonly calendarId: string;

    public constructor(calendarId: string) {
        // googleapis v150.0.1 に対応するためにGoogleAuth -> authを使用
        const auth = new google.auth.GoogleAuth({
            credentials: {
                client_email: process.env.GOOGLE_CLIENT_EMAIL,
                private_key: process.env.GOOGLE_PRIVATE_KEY,
            },
            scopes: ['https://www.googleapis.com/auth/calendar'],
        });

        this.calendar = google.calendar({
            version: 'v3',
            auth,
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
                createErrorMessage('Failed to get calendar events', error),
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
