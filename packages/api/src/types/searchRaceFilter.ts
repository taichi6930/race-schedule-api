import type { RaceType } from '@race-schedule/shared/src/types/raceType';

export interface SearchRaceFilterParams {
    startDate: Date; // ISO8601文字列
    finishDate: Date; // ISO8601文字列
    raceTypeList: RaceType[];
}
