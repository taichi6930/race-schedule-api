import { CalendarData } from '../../domain/calendarData';
import { AutoraceRaceEntity } from '../../repository/entity/autoraceRaceEntity';
import { ENV } from '../../utility/env';
import { Logger } from '../../utility/logger';
import { generateAutoraceRaceId } from '../../utility/raceId';
import type { ICalendarService } from '../interface/ICalendarService';

/**
 * GoogleカレンダーのAutorace用モックサービス
 */

export class MockAutoraceGoogleCalendarService
    implements ICalendarService<AutoraceRaceEntity>
{
    constructor() {
        this.setCalendarData();
    }

    @Logger
    private setCalendarData(): void {
        switch (ENV) {
            case 'PRODUCTION': // ENV が production の場合、GoogleCalendarService を使用
            case 'LOCAL_NO_INIT_DATA':
            case 'LOCAL_INIT_MADE_DATA': // ENV が ita の場合、データを後で設定したいので何もしない
                break;
            case 'LOCAL':
                {
                    // 2024年のデータ366日分を作成
                    const startDate = new Date('2024-01-01');
                    const currentDate = new Date(startDate);
                    // whileで回していって、最初の日付の年数と異なったら終了
                    while (
                        currentDate.getFullYear() === startDate.getFullYear()
                    ) {
                        for (let i = 1; i <= 12; i++) {
                            const location = '伊勢崎';
                            const raceId = generateAutoraceRaceId(
                                currentDate,
                                location,
                                i,
                            );
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
                            MockAutoraceGoogleCalendarService.mockCalendarData.push(
                                calendarData,
                            );
                        }
                        currentDate.setDate(currentDate.getDate() + 1);
                    }
                }
                break;
            default:
                throw new Error('Invalid ENV value');
        }
    }

    private static mockCalendarData: CalendarData[] = [];

    @Logger
    getEvents(startDate: Date, finishDate: Date): Promise<CalendarData[]> {
        return Promise.resolve(
            MockAutoraceGoogleCalendarService.mockCalendarData.filter(
                (data) =>
                    data.startTime >= startDate && data.startTime <= finishDate,
            ),
        );
    }

    @Logger
    async upsertEvents(raceEntityList: AutoraceRaceEntity[]): Promise<void> {
        for (const raceEntity of raceEntityList) {
            const eventId = generateAutoraceRaceId(
                raceEntity.raceData.dateTime,
                raceEntity.raceData.location,
                raceEntity.raceData.number,
            );
            const existingEventIndex =
                MockAutoraceGoogleCalendarService.mockCalendarData.findIndex(
                    (data) => data.id === eventId,
                );

            const calendarEvent = this.translateToCalendarEvent(raceEntity);

            if (existingEventIndex !== -1) {
                // Update existing event
                MockAutoraceGoogleCalendarService.mockCalendarData[
                    existingEventIndex
                ] = calendarEvent;
            } else {
                // Insert new event
                MockAutoraceGoogleCalendarService.mockCalendarData.push(
                    calendarEvent,
                );
            }
        }
        return Promise.resolve();
    }

    @Logger
    async deleteEvents(): Promise<void> {
        // モックの動作を記述
    }

    private translateToCalendarEvent(
        raceEntity: AutoraceRaceEntity,
    ): CalendarData {
        return new CalendarData(
            generateAutoraceRaceId(
                raceEntity.raceData.dateTime,
                raceEntity.raceData.location,
                raceEntity.raceData.number,
            ),
            `${raceEntity.raceData.name} ${raceEntity.raceData.grade} ${raceEntity.raceData.stage}`,
            raceEntity.raceData.dateTime,
            new Date(raceEntity.raceData.dateTime.getTime() + 10 * 60 * 1000), // Assuming event duration is 10 minutes
            raceEntity.raceData.location,
            `testDescription ${raceEntity.raceData.grade}`,
        );
    }
}
