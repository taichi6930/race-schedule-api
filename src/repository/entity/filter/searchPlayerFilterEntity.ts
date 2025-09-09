import type { RaceType } from '../../../utility/raceType';

export class SearchPlayerFilterEntity {
    public constructor(public readonly raceTypeList: RaceType[]) {}
}
