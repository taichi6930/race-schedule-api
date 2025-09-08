import type { RaceType } from '../../../../src/utility/raceType';

export class SearchPlayerFilterEntity {
    public constructor(public readonly raceType: RaceType) {}
}
