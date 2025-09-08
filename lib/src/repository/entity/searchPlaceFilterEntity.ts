import type { RaceType } from '../../../../src/utility/raceType';

export class SearchPlaceFilterEntityForAWS {
    public constructor(
        public readonly startDate: Date,
        public readonly finishDate: Date,
        public readonly raceType: RaceType,
    ) {}
}
