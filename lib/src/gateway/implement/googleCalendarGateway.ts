import type { calendar_v3 } from 'googleapis';
import { google } from 'googleapis';

import { createErrorMessage } from '../../utility/error';
import { Logger } from '../../utility/logger';
import { RaceType } from '../../utility/raceType';
import type { ICalendarGateway } from '../interface/iCalendarGateway';

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
            const calendarId = await this.getCalendarId(raceType);
            // orderBy: 'startTime'で開始時刻順に取得
            const response = await this.calendar.events.list({
                calendarId,
                timeMin: startDate.toISOString(),
                timeMax: finishDate.toISOString(),
                singleEvents: true,
                orderBy: 'startTime',
            });
            return response.data.items ?? [];
        } catch (error) {
            const calendarId = await this.getCalendarId(raceType);
            const clientEmail = process.env.GOOGLE_CLIENT_EMAIL ?? 'unknown';
            throw new Error(
                createErrorMessage(
                    `Failed to get calendar list (calendarId: ${calendarId}, client_email: ${clientEmail})`,
                    error,
                ),
            );
        }
    }

    @Logger
    public async fetchCalendarData(
        raceType: RaceType,
        eventId: string,
    ): Promise<calendar_v3.Schema$Event> {
        try {
            const calendarId = await this.getCalendarId(raceType);
            const response = await this.calendar.events.get({
                calendarId,
                eventId,
            });
            return response.data;
        } catch (error) {
            throw new Error(
                createErrorMessage('Failed to get calendar event', error),
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
                calendarId: await this.getCalendarId(raceType),
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
                calendarId: await this.getCalendarId(raceType),
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
                calendarId: await this.getCalendarId(raceType),
                eventId,
            });
        } catch (error) {
            throw new Error(
                createErrorMessage('Failed to delete calendar event', error),
            );
        }
    }

    @Logger
    private async getCalendarId(raceType: RaceType): Promise<string> {
        let calendarId: unknown = undefined;
        switch (raceType) {
            case RaceType.JRA: {
                calendarId = process.env.JRA_CALENDAR_ID;
                break;
            }
            case RaceType.NAR: {
                calendarId = process.env.NAR_CALENDAR_ID;
                break;
            }
            case RaceType.WORLD: {
                calendarId = process.env.WORLD_CALENDAR_ID;
                break;
            }
            case RaceType.KEIRIN: {
                calendarId = process.env.KEIRIN_CALENDAR_ID;
                break;
            }
            case RaceType.AUTORACE: {
                calendarId = process.env.AUTORACE_CALENDAR_ID;
                break;
            }
            case RaceType.BOATRACE: {
                calendarId = process.env.BOATRACE_CALENDAR_ID;
                break;
            }
            default: {
                throw new Error('Unknown race type');
            }
        }
        if (
            typeof calendarId !== 'string' ||
            !calendarId.includes('@group.calendar.google.com')
        ) {
            throw new Error(
                `Invalid or empty calendarId for raceType: ${raceType}, value: ${String(calendarId)}`,
            );
        }
        return new Promise((resolve) => {
            resolve(calendarId);
        });
    }
}
