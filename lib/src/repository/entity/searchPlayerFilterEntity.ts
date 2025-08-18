import type { RaceType } from '../../utility/raceType';

export class SearchPlayerFilterEntity {
    public constructor(
        public readonly raceType: RaceType, 
        public readonly playerNumber: number, 
        public readonly name: string, 
        public readonly priority: number, 
    ) {}
}
