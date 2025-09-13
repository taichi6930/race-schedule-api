import type { RaceType } from '../../../utility/raceType';
import type { GradeType } from '../../../utility/validateAndType/gradeType';
import type { RaceCourse } from '../../../utility/validateAndType/raceCourse';
import type { RaceStage } from '../../../utility/validateAndType/raceStage';

export class SearchRaceFilterEntity {
    public constructor(
        public readonly startDate: Date,
        public readonly finishDate: Date,
        public readonly raceTypeList: RaceType[],
        public readonly locationList: RaceCourse[],
        public readonly gradeList: GradeType[],
        public readonly stageList: RaceStage[],
    ) {}
}
