export interface IPlaceDataHtmlGateway {
    getPlaceDataHtml: (raceType: RaceType, date: Date) => Promise<string>;
}
