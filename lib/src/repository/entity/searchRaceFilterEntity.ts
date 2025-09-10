import type { PlaceEntity } from '../../../../src/repository/entity/placeEntity';
import type { RaceType } from '../../../../src/utility/raceType';

export class SearchRaceFilterEntityForAWS {
    public constructor(
        public readonly startDate: Date,
        public readonly finishDate: Date,
        public readonly raceType: RaceType,
        public readonly placeEntityList: PlaceEntity[],
    ) {}
}
