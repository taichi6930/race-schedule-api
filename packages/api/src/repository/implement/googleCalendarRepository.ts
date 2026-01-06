import { injectable } from 'tsyringe';

import type { CalendarDataDto } from '../../domain/calendarData';
import { IGoogleCalendarGateway } from '../../gateway/interface/iGoogleCalendarGateway';
import type { SearchCalendarFilterEntity } from '../../usecase/dto/searchCalendarFilterEntity';
import type { ICalendarRepository } from '../interface/ICalendarRepository';

/**
 * Googleカレンダー用リポジトリ
 */
@injectable()
export class GoogleCalendarRepository implements ICalendarRepository {
    private readonly gateway: IGoogleCalendarGateway;

    public constructor(gateway: IGoogleCalendarGateway) {
        this.gateway = gateway;
    }

    /**
     * Googleカレンダーからデータを取得する
     * @param searchCalendarFilter - 検索フィルター
     * @returns カレンダーデータ一覧
     */
    public async fetch(
        searchCalendarFilter: SearchCalendarFilterEntity,
    ): Promise<CalendarDataDto[]> {
        const { startDate, finishDate, raceTypeList } = searchCalendarFilter;
        const allEvents: CalendarDataDto[] = [];
        for (const raceType of raceTypeList) {
            const events = await this.gateway.fetchCalendarDataList(
                raceType,
                startDate,
                finishDate,
            );
            // Google APIのイベントをCalendarDataDtoに変換
            const dtoList = events.map((event) => ({
                id: event.id ?? '',
                raceType,
                title: event.summary ?? '',
                startTime: event.start?.dateTime ?? event.start?.date ?? '',
                endTime: event.end?.dateTime ?? event.end?.date ?? '',
                location: event.location ?? '',
                description: event.description ?? '',
            }));
            allEvents.push(...dtoList);
        }
        return allEvents;
    }
}
