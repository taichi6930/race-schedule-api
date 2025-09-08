import type { calendar_v3 } from 'googleapis';
import { google } from 'googleapis';

import { createErrorMessage } from '../../lib/src/utility/error';
import { SearchCalendarFilterEntity } from '../repository/entity/searchCalendarFilterEntity';
import { CloudFlareEnv, CommonParameter } from '../utility/commonParameter';
import { Logger } from '../utility/logger';
import { RaceType } from '../utility/raceType';
import { ICalendarGateway } from './iCalendarGateway';

export class GoogleCalendarGateway implements ICalendarGateway {
    private calendar: calendar_v3.Calendar;

    private authInit(commonParameter: CommonParameter): void {
        const client_email = commonParameter.env.GOOGLE_CLIENT_EMAIL;
        // Cloudflare環境変数は\nで渡されることが多いので、\n→\n変換
        const private_key = commonParameter.env.GOOGLE_PRIVATE_KEY.replace(
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
        commonParameter: CommonParameter,
        searchCalendarFilter: SearchCalendarFilterEntity,
    ): Promise<calendar_v3.Schema$Event[]> {
        try {
            this.authInit(commonParameter);
            const calendarId = await this.getCalendarId(
                searchCalendarFilter.raceType,
                commonParameter.env,
            );
            // orderBy: 'startTime'で開始時刻順に取得
            const response = await this.calendar.events.list({
                calendarId,
                timeMin: searchCalendarFilter.startDate.toISOString(),
                timeMax: searchCalendarFilter.finishDate.toISOString(),
                singleEvents: true,
                orderBy: 'startTime',
            });
            return response.data.items ?? [];
        } catch (error) {
            const calendarId = await this.getCalendarId(
                searchCalendarFilter.raceType,
                commonParameter.env,
            );
            const clientEmail = commonParameter.env.GOOGLE_CLIENT_EMAIL;
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
        commonParameter: CommonParameter,
        raceType: RaceType,
        eventId: string,
    ): Promise<calendar_v3.Schema$Event> {
        try {
            this.authInit(commonParameter);
            const calendarId = await this.getCalendarId(
                raceType,
                commonParameter.env,
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
        commonParameter: CommonParameter,
        raceType: RaceType,
        calendarData: calendar_v3.Schema$Event,
    ): Promise<void> {
        try {
            this.authInit(commonParameter);
            const eventId = calendarData.id;
            if (!eventId) {
                throw new Error('イベントIDが指定されていません');
            }
            await this.calendar.events.update({
                calendarId: await this.getCalendarId(
                    raceType,
                    commonParameter.env,
                ),
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
        commonParameter: CommonParameter,
        raceType: RaceType,
        calendarData: calendar_v3.Schema$Event,
    ): Promise<void> {
        try {
            this.authInit(commonParameter);
            await this.calendar.events.insert({
                calendarId: await this.getCalendarId(
                    raceType,
                    commonParameter.env,
                ),
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
        commonParameter: CommonParameter,
        raceType: RaceType,
        eventId: string,
    ): Promise<void> {
        try {
            this.authInit(commonParameter);
            await this.calendar.events.delete({
                calendarId: await this.getCalendarId(
                    raceType,
                    commonParameter.env,
                ),
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
        let calendarId: unknown = undefined;
        switch (raceType) {
            case RaceType.JRA: {
                calendarId = env.JRA_CALENDAR_ID;
                break;
            }
            case RaceType.NAR: {
                calendarId = env.NAR_CALENDAR_ID;
                break;
            }
            case RaceType.OVERSEAS: {
                calendarId = env.WORLD_CALENDAR_ID;
                break;
            }
            case RaceType.KEIRIN: {
                calendarId = env.KEIRIN_CALENDAR_ID;
                break;
            }
            case RaceType.AUTORACE: {
                calendarId = env.AUTORACE_CALENDAR_ID;
                break;
            }
            case RaceType.BOATRACE: {
                calendarId = env.BOATRACE_CALENDAR_ID;
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
