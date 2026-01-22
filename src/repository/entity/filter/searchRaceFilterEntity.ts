import type { RaceType } from '../../../../packages/shared/src/types/raceType';
import type { GradeType } from '../../../../packages/shared/src/utilities/gradeType';
import type { RaceCourse } from '../../../../packages/shared/src/utilities/raceCourse';
import type { RaceStage } from '../../../../packages/shared/src/utilities/raceStage';

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
