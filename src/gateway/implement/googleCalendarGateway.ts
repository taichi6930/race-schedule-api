import type { calendar_v3 } from 'googleapis';
import { google } from 'googleapis';

import { RaceType } from '../../../packages/shared/src/types/raceType';
import { createErrorMessage } from '../../../packages/shared/src/utilities/error';
import { Logger } from '../../../packages/shared/src/utilities/logger';
import { OldCloudFlareEnv } from '../../utility/oldCloudFlareEnv';
import { OldEnvStore } from '../../utility/oldEnvStore';
import { ICalendarGateway } from '../interface/iCalendarGateway';

export class GoogleCalendarGateway implements ICalendarGateway {
    private calendar: calendar_v3.Calendar;

    public constructor() {
        this.authInit();
    }

    private authInit(): void {
        const client_email = OldEnvStore.env.GOOGLE_CLIENT_EMAIL;
        // Cloudflare環境変数は\nで渡されることが多いので、\n→\n変換
        const private_key = OldEnvStore.env.GOOGLE_PRIVATE_KEY.replace(
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
            const calendarId = await this.getCalendarId(
                raceType,
                OldEnvStore.env,
            );
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
            const calendarId = await this.getCalendarId(
                raceType,
                OldEnvStore.env,
            );
            const clientEmail = OldEnvStore.env.GOOGLE_CLIENT_EMAIL;
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
            const calendarId = await this.getCalendarId(
                raceType,
                OldEnvStore.env,
            );
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
                calendarId: await this.getCalendarId(raceType, OldEnvStore.env),
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
                calendarId: await this.getCalendarId(raceType, OldEnvStore.env),
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
                calendarId: await this.getCalendarId(raceType, OldEnvStore.env),
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
        env: OldCloudFlareEnv,
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
