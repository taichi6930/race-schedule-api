import type { RaceType } from '../../../../src/utility/raceType';

export class SearchCalendarFilterEntityForAWS {
    public constructor(
        public readonly startDate: Date,
        public readonly finishDate: Date,
        public readonly raceTypeList: RaceType[],
    ) {}
}
