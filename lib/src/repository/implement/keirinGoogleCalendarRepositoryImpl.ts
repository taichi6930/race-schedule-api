import 'reflect-metadata';

import { inject, injectable } from 'tsyringe';

import { ICalendarGateway } from '../../gateway/interface/iCalendarGateway';
import { KeirinRaceEntity } from '../entity/keirinRaceEntity';
import { FetchCalendarListRequest } from '../request/fetchCalendarListRequest';
import { FetchCalendarListResponse } from '../response/fetchCalendarListResponse';
import { BaseGoogleCalendarRepository } from './baseGoogleCalendarRepository';

/**
 * 競輪場開催データリポジトリの実装
 */
@injectable()
export class KeirinGoogleCalendarRepositoryImpl extends BaseGoogleCalendarRepository<KeirinRaceEntity> {
    constructor(
        @inject('KeirinGoogleCalendarGateway')
        protected readonly googleCalendarGateway: ICalendarGateway,
    ) {
        super();
    }
    async getEvents(
        request: FetchCalendarListRequest,
    ): Promise<FetchCalendarListResponse> {
        // GoogleカレンダーAPIからイベントを取得
        try {
            const calendarDataList =
                await this.googleCalendarGateway.fetchCalendarDataList(
                    request.startDate,
                    request.finishDate,
                );
            return new FetchCalendarListResponse(
                calendarDataList.map
                    ? calendarDataList.map((calendarData) =>
                          KeirinRaceEntity.fromGoogleCalendarDataToCalendarData(
                              calendarData,
                          ),
                      )
                    : [],
            );
        } catch (error) {
            console.error(
                'Google Calendar APIからのイベント取得に失敗しました',
                error,
            );
            return new FetchCalendarListResponse([]);
        }
    }
}
