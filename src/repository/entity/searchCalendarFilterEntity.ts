import type { RaceType } from '../../utility/raceType';

export class SearchCalendarFilterEntity {
    public constructor(
        public readonly startDate: Date,
        public readonly finishDate: Date,
        public readonly raceTypeList: RaceType[],
    ) {}
}
