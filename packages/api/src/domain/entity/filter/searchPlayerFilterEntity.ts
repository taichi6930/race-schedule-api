import type { RaceType } from '@race-schedule/shared/src/types/raceType';

/**
 * 選手検索フィルターエンティティ
 */
export class SearchPlayerFilterEntity {
    public constructor(public readonly raceTypeList: RaceType[]) {}
}
