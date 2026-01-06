import type { RaceType } from '../../../../packages/shared/src/types/raceType';

export class OldSearchCalendarFilterEntity {
    public constructor(
        public readonly startDate: Date,
        public readonly finishDate: Date,
        public readonly raceTypeList: RaceType[],
    ) {}
}
