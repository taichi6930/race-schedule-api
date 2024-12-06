import { format } from 'date-fns';

import { AutoraceRaceData } from '../../domain/autoraceRaceData';
import { RaceData } from '../../domain/baseData';
import { BoatraceRaceData } from '../../domain/boatraceRaceData';
import { CalendarData } from '../../domain/calendarData';
import { KeirinRaceData } from '../../domain/keirinRaceData';
import { AUTORACE_PLACE_CODE } from '../../utility/data/autorace';
import { BOATRACE_PLACE_CODE } from '../../utility/data/boatrace';
import { JraRaceCourse } from '../../utility/data/jra';
import { KEIRIN_PLACE_CODE } from '../../utility/data/keirin';
import { NarRaceCourse } from '../../utility/data/nar';
import { NETKEIBA_BABACODE } from '../../utility/data/netkeiba';
import { WORLD_PLACE_CODE, WorldRaceCourse } from '../../utility/data/world';
import { ENV } from '../../utility/env';
import { Logger } from '../../utility/logger';
import { generateJraRaceId } from '../../utility/raceId';
import {
    GoogleCalendarService,
    RaceType,
} from '../implement/googleCalendarService';
import type { ICalendarService } from '../interface/ICalendarService';

/**
 * Googleカレンダーのモックサービス
 */

export class MockGoogleCalendarService implements ICalendarService<RaceData> {
    constructor(private readonly raceType: RaceType) {
        this.setCalendarData();
    }

    @Logger
    private setCalendarData(): void {
        switch (ENV) {
            case 'PRODUCTION': // ENV が production の場合、GoogleCalendarService を使用
            case 'ITa': // ENV が ita の場合、データを後で設定したいので何もしない
                break;
            case 'LOCAL':
            default:
                {
                    // 2024年のデータ366日分を作成
                    const startDate = new Date('2024-01-01');
                    const currentDate = new Date(startDate);
                    // whileで回していって、最初の日付の年数と異なったら終了
                    while (
                        currentDate.getFullYear() === startDate.getFullYear()
                    ) {
                        for (let i = 1; i <= 12; i++) {
                            let location = '';
                            let raceId = '';

                            switch (this.raceType) {
                                case 'jra':
                                    location = '東京';
                                    raceId = generateJraRaceId(
                                        currentDate,
                                        location as JraRaceCourse,
                                        i,
                                    );
                                    break;
                                case 'nar':
                                    location = '大井';
                                    raceId = `${this.raceType}${format(currentDate, 'yyyyMMdd')}${NETKEIBA_BABACODE[location as NarRaceCourse]}${i.toXDigits(2)}`;
                                    break;
                                case 'world':
                                    location = 'ロンシャン';
                                    raceId = `${this.raceType}${format(currentDate, 'yyyyMMdd')}${WORLD_PLACE_CODE[location as WorldRaceCourse]}${i.toXDigits(2)}`;
                                    break;
                                case 'keirin':
                                    location = '川崎';
                                    raceId = `${this.raceType}${format(currentDate, 'yyyyMMdd')}${KEIRIN_PLACE_CODE[location]}${i.toXDigits(2)}`;
                                    break;
                                case 'autorace':
                                    location = '伊勢崎';
                                    raceId = `${this.raceType}${format(currentDate, 'yyyyMMdd')}${AUTORACE_PLACE_CODE[location]}${i.toXDigits(2)}`;
                                    break;
                                case 'boatrace':
                                    location = '平和島';
                                    raceId = `${this.raceType}${format(currentDate, 'yyyyMMdd')}${BOATRACE_PLACE_CODE[location]}${i.toXDigits(2)}`;
                                    break;
                                default:
                                    break;
                            }
                            const calendarData = new CalendarData(
                                raceId,
                                `テストレース${raceId}`,
                                new Date(
                                    currentDate.getFullYear(),
                                    currentDate.getMonth(),
                                    currentDate.getDate(),
                                    i + 6,
                                    0,
                                ),
                                new Date(
                                    currentDate.getFullYear(),
                                    currentDate.getMonth(),
                                    currentDate.getDate(),
                                    i + 6,
                                    10,
                                ),
                                location,
                                'testDescription',
                            );
                            MockGoogleCalendarService.mockCalendarData[
                                this.raceType
                            ].push(calendarData);
                        }
                        currentDate.setDate(currentDate.getDate() + 1);
                    }
                }
                break;
        }
    }

    private static mockCalendarData: Record<string, CalendarData[]> = {
        jra: [],
        nar: [],
        world: [],
        keirin: [],
        autorace: [],
        boatrace: [],
    };
    @Logger
    getEvents(startDate: Date, finishDate: Date): Promise<CalendarData[]> {
        return Promise.resolve(
            MockGoogleCalendarService.mockCalendarData[this.raceType].filter(
                (data) =>
                    data.startTime >= startDate && data.startTime <= finishDate,
            ),
        );
    }

    @Logger
    async upsertEvents(raceDataList: RaceData[]): Promise<void> {
        for (const raceData of raceDataList) {
            const eventId = GoogleCalendarService.generateEventId(
                this.raceType,
                raceData,
            );
            const existingEventIndex =
                MockGoogleCalendarService.mockCalendarData[
                    this.raceType
                ].findIndex((data) => data.id === eventId);

            const calendarEvent = this.translateToCalendarEvent(raceData);

            if (existingEventIndex !== -1) {
                // Update existing event
                MockGoogleCalendarService.mockCalendarData[this.raceType][
                    existingEventIndex
                ] = calendarEvent;
            } else {
                // Insert new event
                MockGoogleCalendarService.mockCalendarData[this.raceType].push(
                    calendarEvent,
                );
            }
        }
        return Promise.resolve();
    }

    @Logger
    async cleansingEvents(): Promise<void> {
        // モックの動作を記述
    }

    private translateToCalendarEvent(raceData: RaceData): CalendarData {
        return new CalendarData(
            GoogleCalendarService.generateEventId(this.raceType, raceData),
            raceData instanceof KeirinRaceData ||
            raceData instanceof AutoraceRaceData ||
            raceData instanceof BoatraceRaceData
                ? `${raceData.name} ${raceData.grade} ${raceData.stage}`
                : `${raceData.name} ${raceData.grade}`,
            raceData.dateTime,
            new Date(raceData.dateTime.getTime() + 10 * 60 * 1000), // Assuming event duration is 10 minutes
            raceData.location,
            `testDescription ${raceData.grade}`,
        );
    }
}
