import type { RaceType } from '../../utility/racetype';

export class SearchPlayerFilterEntity {
    public constructor(
        public readonly raceType: RaceType, // レースタイプ（競輪・競艇・オートレース）
        public readonly playerNumber: number, // 選手番号
        public readonly name: string, // 選手名
        public readonly priority: number, // 優先度
    ) {}
}
