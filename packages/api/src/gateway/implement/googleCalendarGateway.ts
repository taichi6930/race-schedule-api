import { RaceType } from '@race-schedule/shared/src/types/raceType';
import { CloudFlareEnv } from '@race-schedule/shared/src/utilities/cloudFlareEnv';
import { EnvStore } from '@race-schedule/shared/src/utilities/envStore';
import { createErrorMessage } from '@race-schedule/shared/src/utilities/error';
import { Logger } from '@race-schedule/shared/src/utilities/logger';
import type { calendar_v3 } from 'googleapis';
import { google } from 'googleapis';
import { injectable } from 'tsyringe';

import { IGoogleCalendarGateway } from '../interface/iGoogleCalendarGateway';

@injectable()
export class GoogleCalendarGateway implements IGoogleCalendarGateway {
    private calendar: calendar_v3.Calendar | null = null;

    @Logger
    private ensureInitialized(): void {
        if (this.calendar !== null) {
            return;
        }
        const client_email = EnvStore.env.GOOGLE_CLIENT_EMAIL;
        console.log(`Using GOOGLE_CLIENT_EMAIL: ${client_email}`);
        // Cloudflare環境変数は\nで渡されることが多いので、\n→\n変換
        const rawPrivateKey = EnvStore.env.GOOGLE_PRIVATE_KEY;
        if (!rawPrivateKey) {
            throw new Error(
                'GOOGLE_PRIVATE_KEY is not set in environment variables',
            );
        }
        const private_key = rawPrivateKey.replace(/\\n/g, '\n');
        // 最初の50文字をログに出力（デバッグ用）
        console.log(`Using GOOGLE_PRIVATE_KEY: ${private_key.slice(0, 50)}...`);
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
        this.ensureInitialized();
        try {
            const calendarId = await this.getCalendarId(raceType, EnvStore.env);
            // orderBy: 'startTime'で開始時刻順に取得
            const response = await this.calendar?.events.list({
                calendarId,
                timeMin: startDate.toISOString(),
                timeMax: finishDate.toISOString(),
                singleEvents: true,
                orderBy: 'startTime',
            });
            return response?.data.items ?? [];
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
        this.ensureInitialized();
        try {
            const calendarId = await this.getCalendarId(raceType, EnvStore.env);
            const response = await this.calendar?.events.get({
                calendarId,
                eventId,
            });
            if (!response?.data) {
                throw new Error('Calendar event data is empty');
            }
            return response.data;
        } catch (error) {
            throw new Error(
                createErrorMessage('Failed to get calendar event', error),
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

    @Logger
    public async updateCalendarData(
        raceType: RaceType,
        calendarData: calendar_v3.Schema$Event,
    ): Promise<void> {
        this.ensureInitialized();
        if (!calendarData.id) {
            throw new Error('eventId (id) is required for update');
        }
        try {
            const calendarId = await this.getCalendarId(raceType, EnvStore.env);
            await this.calendar?.events.update({
                calendarId,
                eventId: calendarData.id,
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
        raceType: RaceType,
        calendarData: calendar_v3.Schema$Event,
    ): Promise<void> {
        this.ensureInitialized();
        try {
            const calendarId = await this.getCalendarId(raceType, EnvStore.env);
            await this.calendar?.events.insert({
                calendarId,
                requestBody: calendarData,
            });
        } catch (error) {
            throw new Error(
                createErrorMessage('Failed to insert calendar event', error),
            );
        }
    }

    @Logger
    public async deleteCalendarData(
        raceType: RaceType,
        eventId: string,
    ): Promise<void> {
        this.ensureInitialized();
        try {
            const calendarId = await this.getCalendarId(raceType, EnvStore.env);
            await this.calendar?.events.delete({
                calendarId,
                eventId,
            });
        } catch (error) {
            throw new Error(
                createErrorMessage('Failed to delete calendar event', error),
            );
        }
    }
}
