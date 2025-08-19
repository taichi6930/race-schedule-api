import type { RaceType } from '../../utility/raceType';
import type { IPlaceEntity } from './iPlaceEntity';

export class SearchRaceFilterEntity<P extends IPlaceEntity<P>> {
    public constructor(
        public readonly startDate: Date,
        public readonly finishDate: Date,
        public readonly raceType: RaceType,
        public readonly placeEntityList: P[],
    ) {}
}
