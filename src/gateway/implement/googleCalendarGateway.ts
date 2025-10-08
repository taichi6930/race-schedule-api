import type { calendar_v3 } from 'googleapis';
import { google } from 'googleapis';

import { CloudFlareEnv } from '../../utility/cloudFlareEnv';
import { EnvStore } from '../../utility/envStore';
import { createErrorMessage } from '../../utility/error';
import { Logger } from '../../utility/logger';
import { RaceType } from '../../utility/raceType';
import { ICalendarGateway } from '../interface/iCalendarGateway';

export class GoogleCalendarGateway implements ICalendarGateway {
    private calendar: calendar_v3.Calendar;

    private authInit(): void {
        const client_email = EnvStore.env.GOOGLE_CLIENT_EMAIL;
        // Cloudflare環境変数は\nで渡されることが多いので、\n→\n変換
        const private_key = EnvStore.env.GOOGLE_PRIVATE_KEY.replace(
            /\\n/g,
            '\n',
        );
        const auth = new google.auth.GoogleAuth({
            credentials: {
                client_email,
                private_key,
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
            this.authInit();
            const calendarId = await this.getCalendarId(raceType, EnvStore.env);
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
            const calendarId = await this.getCalendarId(raceType, EnvStore.env);
            const clientEmail = EnvStore.env.GOOGLE_CLIENT_EMAIL;
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
            this.authInit();
            const calendarId = await this.getCalendarId(raceType, EnvStore.env);
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
            this.authInit();
            const eventId = calendarData.id;
            if (!eventId) {
                throw new Error('イベントIDが指定されていません');
            }
            await this.calendar.events.update({
                calendarId: await this.getCalendarId(raceType, EnvStore.env),
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
            this.authInit();
            await this.calendar.events.insert({
                calendarId: await this.getCalendarId(raceType, EnvStore.env),
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
            this.authInit();
            await this.calendar.events.delete({
                calendarId: await this.getCalendarId(raceType, EnvStore.env),
                eventId,
            });
        } catch (error) {
            throw new Error(
                createErrorMessage('Failed to delete calendar event', error),
            );
        }
    }

    private async getCalendarId(
        raceType: RaceType,
        env: CloudFlareEnv,
    ): Promise<string> {
        const calendarIdMap = {
            JRA: env.JRA_CALENDAR_ID,
            NAR: env.NAR_CALENDAR_ID,
            OVERSEAS: env.WORLD_CALENDAR_ID,
            KEIRIN: env.KEIRIN_CALENDAR_ID,
            AUTORACE: env.AUTORACE_CALENDAR_ID,
            BOATRACE: env.BOATRACE_CALENDAR_ID,
        };
        const calendarId: string = calendarIdMap[raceType];
        if (
            typeof calendarId !== 'string' ||
            !calendarId.includes('@group.calendar.google.com')
        ) {
            throw new Error(
                `Invalid or empty calendarId for raceType: ${raceType}, value: ${calendarId}`,
            );
        }
        return new Promise((resolve) => {
            resolve(calendarId);
        });
    }
}
