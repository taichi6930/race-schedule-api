import type { RaceType } from '../../../packages/shared/src/types/raceType';

export interface IPlaceDataHtmlGateway {
    getPlaceDataHtml: (raceType: RaceType, date: Date) => Promise<string>;
}
