import type { RaceType } from '@race-schedule/shared/src/types/raceType';

export interface IPlaceDataHtmlGateway {
    getPlaceDataHtml: (raceType: RaceType, date: Date) => Promise<string>;
}
