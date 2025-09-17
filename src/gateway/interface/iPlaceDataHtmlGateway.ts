import type { RaceType } from '../../utility/raceType';

export interface IPlaceDataHtmlGateway {
    getPlaceDataHtml: (raceType: RaceType, date: Date) => Promise<string>;
}
export interface IPlaceDataHtmlGatewayForAWS {
    getPlaceDataHtml: (raceType: RaceType, date: Date) => Promise<string>;
}
