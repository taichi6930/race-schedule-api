import type { RaceType } from '../../utility/raceType';
import type { PlaceEntityForAWS } from './placeEntity';

export class SearchRaceFilterEntityForAWS {
    public constructor(
        public readonly startDate: Date,
        public readonly finishDate: Date,
        public readonly raceType: RaceType,
        public readonly placeEntityList: PlaceEntityForAWS[],
    ) {}
}
