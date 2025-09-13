import type { RaceType } from '../../../utility/raceType';
import type { RaceCourse } from '../../../utility/validateAndType/raceCourse';

export class SearchPlaceFilterEntity {
    public constructor(
        public readonly startDate: Date,
        public readonly finishDate: Date,
        public readonly raceTypeList: RaceType[],
        public readonly locationList: RaceCourse[],
    ) {}
}
