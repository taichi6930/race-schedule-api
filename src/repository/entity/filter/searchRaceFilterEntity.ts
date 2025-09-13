import type { GradeType } from '../../../../lib/src/utility/validateAndType/gradeType';
import type { RaceStage } from '../../../../lib/src/utility/validateAndType/raceStage';
import type { RaceType } from '../../../utility/raceType';
import type { RaceCourse } from '../../../utility/validateAndType/raceCourse';

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
