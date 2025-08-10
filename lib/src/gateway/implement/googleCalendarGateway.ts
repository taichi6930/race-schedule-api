import type { calendar_v3 } from 'googleapis';
import { google } from 'googleapis';

import { createErrorMessage } from '../../utility/error';
import { Logger } from '../../utility/logger';
import { RaceType } from '../../utility/raceType';
import type {
    ICalendarGateway,
    IOldCalendarGateway,
} from '../interface/iCalendarGateway';

export class OldGoogleCalendarGateway implements IOldCalendarGateway {
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

export class GoogleCalendarGateway implements ICalendarGateway {
    private readonly calendar: calendar_v3.Calendar;

    public constructor() {
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
    }

    @Logger
    public async fetchCalendarDataList(
        raceType: RaceType,
        startDate: Date,
        finishDate: Date,
    ): Promise<calendar_v3.Schema$Event[]> {
        try {
            // orderBy: 'startTime'で開始時刻順に取得
            const response = await this.calendar.events.list({
                calendarId: this.getCalendarId(raceType),
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
        raceType: RaceType,
        eventId: string,
    ): Promise<calendar_v3.Schema$Event> {
        try {
            const response = await this.calendar.events.get({
                calendarId: this.getCalendarId(raceType),
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
        raceType: RaceType,
        calendarData: calendar_v3.Schema$Event,
    ): Promise<void> {
        try {
            const eventId = calendarData.id;
            if (!eventId) {
                throw new Error('イベントIDが指定されていません');
            }
            await this.calendar.events.update({
                calendarId: this.getCalendarId(raceType),
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
        raceType: RaceType,
        calendarData: calendar_v3.Schema$Event,
    ): Promise<void> {
        try {
            await this.calendar.events.insert({
                calendarId: this.getCalendarId(raceType),
                requestBody: calendarData,
            });
        } catch (error) {
            throw new Error(
                createErrorMessage('Failed to create calendar event', error),
            );
        }
    }

    @Logger
    public async deleteCalendarData(
        raceType: RaceType,
        eventId: string,
    ): Promise<void> {
        try {
            await this.calendar.events.delete({
                calendarId: this.getCalendarId(raceType),
                eventId,
            });
        } catch (error) {
            throw new Error(
                createErrorMessage('Failed to delete calendar event', error),
            );
        }
    }

    @Logger
    private getCalendarId(raceType: RaceType): string {
        switch (raceType) {
            case RaceType.JRA: {
                return process.env.JRA_CALENDAR_ID ?? '';
            }
            case RaceType.NAR: {
                return process.env.NAR_CALENDAR_ID ?? '';
            }
            case RaceType.WORLD: {
                return process.env.WORLD_CALENDAR_ID ?? '';
            }
            case RaceType.KEIRIN: {
                return process.env.KEIRIN_CALENDAR_ID ?? '';
            }
            case RaceType.AUTORACE: {
                return process.env.AUTORACE_CALENDAR_ID ?? '';
            }
            case RaceType.BOATRACE: {
                return process.env.BOATRACE_CALENDAR_ID ?? '';
            }
            default: {
                throw new Error('Unknown race type');
            }
        }
    }
}
