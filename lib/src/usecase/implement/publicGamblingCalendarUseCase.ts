import 'reflect-metadata'; // reflect-metadataをインポート
import 'reflect-metadata'; // reflect-metadataをインポート

import { inject, injectable } from 'tsyringe';

import { CalendarData } from '../../domain/calendarData';
import { AutoraceRaceEntity } from '../../repository/entity/autoraceRaceEntity';
import { BoatraceRaceEntity } from '../../repository/entity/boatraceRaceEntity';
import { JraRaceEntity } from '../../repository/entity/jraRaceEntity';
import { KeirinRaceEntity } from '../../repository/entity/keirinRaceEntity';
import { NarRaceEntity } from '../../repository/entity/narRaceEntity';
import { WorldRaceEntity } from '../../repository/entity/worldRaceEntity';
import { ICalendarService } from '../../service/interface/ICalendarService';
import { Logger } from '../../utility/logger';
import { IRaceCalendarUseCase } from '../interface/IRaceCalendarUseCase';

/**
 * 公営競技のレースカレンダーユースケース
 */
@injectable()
export class PublicGamblingCalendarUseCase implements IRaceCalendarUseCase {
    public constructor(
        @inject('JraCalendarService')
        private readonly jraCalendarService: ICalendarService<JraRaceEntity>,
        @inject('NarCalendarService')
        private readonly narCalendarService: ICalendarService<NarRaceEntity>,
        @inject('KeirinCalendarService')
        private readonly keirinCalendarService: ICalendarService<KeirinRaceEntity>,
        @inject('BoatraceCalendarService')
        private readonly boatraceCalendarService: ICalendarService<BoatraceRaceEntity>,
        @inject('AutoraceCalendarService')
        private readonly autoraceCalendarService: ICalendarService<AutoraceRaceEntity>,
        @inject('WorldCalendarService')
        private readonly worldCalendarService: ICalendarService<WorldRaceEntity>,
    ) {}

    /**
     * カレンダーからレース情報の取得を行う
     * @param startDate
     * @param finishDate
     * @param raceTypeList
     */
    @Logger
    public async getRacesFromCalendar(
        startDate: Date,
        finishDate: Date,
        raceTypeList?: string[],
    ): Promise<CalendarData[]> {
        const types = raceTypeList ?? [];
        const calendarDataList: CalendarData[] = [];
        if (types.includes('jra')) {
            calendarDataList.push(
                ...(await this.jraCalendarService.getEvents(
                    startDate,
                    finishDate,
                )),
            );
        }
        if (types.includes('nar')) {
            calendarDataList.push(
                ...(await this.narCalendarService.getEvents(
                    startDate,
                    finishDate,
                )),
            );
        }
        if (types.includes('keirin')) {
            calendarDataList.push(
                ...(await this.keirinCalendarService.getEvents(
                    startDate,
                    finishDate,
                )),
            );
        }
        if (types.includes('boatrace')) {
            calendarDataList.push(
                ...(await this.boatraceCalendarService.getEvents(
                    startDate,
                    finishDate,
                )),
            );
        }
        if (types.includes('autorace')) {
            calendarDataList.push(
                ...(await this.autoraceCalendarService.getEvents(
                    startDate,
                    finishDate,
                )),
            );
        }
        if (types.includes('world')) {
            calendarDataList.push(
                ...(await this.worldCalendarService.getEvents(
                    startDate,
                    finishDate,
                )),
            );
        }
        return calendarDataList;
    }

    public async updateRacesToCalendar(): Promise<void> {
        throw new Error('Not implemented');
        await Promise.resolve();
    }
}
