import type { RaceType } from '../../../../src/utility/raceType';

export interface IPlaceDataHtmlGatewayForAWS {
    getPlaceDataHtml: (raceType: RaceType, date: Date) => Promise<string>;
}
