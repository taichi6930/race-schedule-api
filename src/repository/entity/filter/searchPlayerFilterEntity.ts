import type { RaceType } from '../../../../packages/shared/src/types/raceType';

export class SearchPlayerFilterEntity {
    public constructor(public readonly raceTypeList: RaceType[]) {}
}
