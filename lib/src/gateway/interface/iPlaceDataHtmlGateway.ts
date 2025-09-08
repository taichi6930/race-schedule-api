import type { RaceType } from '../../../../src/utility/raceType';

export interface IPlaceDataHtmlGateway {
    getPlaceDataHtml: (raceType: RaceType, date: Date) => Promise<string>;
}
