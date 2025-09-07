import type { RaceType } from '../../../lib/src/utility/raceType';

export class SearchPlaceFilterEntity {
    public constructor(
        public readonly raceTypeList: RaceType[],
        public readonly startDate: Date,
        public readonly finishDate: Date,
    ) {
        // startDate が finishDate より後の日付の場合、エラーを投げる
        if (this.startDate > this.finishDate) {
            throw new Error('startDate is after finishDate');
        }
    }
}
