import type { RaceType } from '../../../lib/src/utility/raceType';

export class SearchRaceFilterEntity {
    public constructor(
        public readonly startDate: Date,
        public readonly finishDate: Date,
        public readonly raceType: RaceType,
    ) {}
}
