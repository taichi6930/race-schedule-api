import type { RaceCourse } from '../../../../lib/src/utility/validateAndType/raceCourse';
import type { RaceType } from '../../../utility/raceType';

export class SearchRaceFilterEntity {
    public constructor(
        public readonly startDate: Date,
        public readonly finishDate: Date,
        public readonly raceTypeList: RaceType[],
        public readonly locationList: RaceCourse[],
    ) {}
}
