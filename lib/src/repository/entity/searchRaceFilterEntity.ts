import type { RaceType } from '../../utility/raceType';
import type { PlaceEntity } from './placeEntity';

export class SearchRaceFilterEntity {
    public constructor(
        public readonly startDate: Date,
        public readonly finishDate: Date,
        public readonly raceType: RaceType,
        public readonly placeEntityList: PlaceEntity[],
    ) {}
}
