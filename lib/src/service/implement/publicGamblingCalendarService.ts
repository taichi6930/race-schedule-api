import 'reflect-metadata';
import '../../utility/format';

import { inject, injectable } from 'tsyringe';

import { CalendarData } from '../../domain/calendarData';
import { HorseRacingRaceEntity } from '../../repository/entity/horseRacingRaceEntity';
import { JraRaceEntity } from '../../repository/entity/jraRaceEntity';
import { MechanicalRacingRaceEntity } from '../../repository/entity/mechanicalRacingRaceEntity';
import { SearchCalendarFilterEntity } from '../../repository/entity/searchCalendarFilterEntity';
import { ICalendarRepository } from '../../repository/interface/ICalendarRepository';
import { Logger } from '../../utility/logger';
import { RaceType } from '../../utility/raceType';
import { ICalendarService } from '../interface/ICalendarService';


@injectable()
export class PublicGamblingCalendarService implements ICalendarService {
    public constructor(
        @inject('CalendarRepository')
        protected readonly calendarRepository: ICalendarRepository,
    ) {}
    
    @Logger
    public async fetchEvents(
        startDate: Date,
        finishDate: Date,
        raceTypeList: RaceType[],
    ): Promise<CalendarData[]> {
        const searchFilter = new SearchCalendarFilterEntity(
            startDate,
            finishDate,
        );

        return this.calendarRepository.getEvents(raceTypeList, searchFilter);
    }

    
    @Logger
    public async upsertEvents(raceEntityList: {
        [RaceType.JRA]: JraRaceEntity[];
        [RaceType.NAR]: HorseRacingRaceEntity[];
        [RaceType.OVERSEAS]: HorseRacingRaceEntity[];
        [RaceType.KEIRIN]: MechanicalRacingRaceEntity[];
        [RaceType.AUTORACE]: MechanicalRacingRaceEntity[];
        [RaceType.BOATRACE]: MechanicalRacingRaceEntity[];
    }): Promise<void> {
        const raceTypes = [
            RaceType.JRA,
            RaceType.NAR,
            RaceType.OVERSEAS,
            RaceType.KEIRIN,
            RaceType.AUTORACE,
            RaceType.BOATRACE,
        ];
        for (const raceType of raceTypes) {
            await this.calendarRepository.upsertEvents(
                raceEntityList[raceType],
            );
        }
    }

    
    @Logger
    public async deleteEvents(calendarDataList: CalendarData[]): Promise<void> {
        await this.calendarRepository.deleteEvents(calendarDataList);
    }
}
