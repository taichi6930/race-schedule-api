import { RaceType } from '@race-schedule/shared/src/types/raceType';
import { Logger } from '@race-schedule/shared/src/utilities/logger';
import { load } from 'cheerio';
import { inject, injectable } from 'tsyringe';

import { PlaceHtmlEntity } from '../entity/placeHtmlEntity';
import { IPlaceHtmlRepository } from '../repository/interface/IPlaceHtmlRepository';
@injectable()
export class PlaceService {
    public constructor(
        @inject('PlaceHtmlRepository')
        private readonly placeHtmlRepository: IPlaceHtmlRepository,
    ) {}

    @Logger
    public async fetch(
        raceType: RaceType,
        date: Date,
    ): Promise<PlaceHtmlEntity[]> {
        // JRAは年単位で取得
        const html: string =
            raceType === 'JRA'
                ? ((await this.placeHtmlRepository.loadPlaceHtml(
                      raceType,
                      date,
                  )) ??
                  (await this.placeHtmlRepository.fetchPlaceHtml(
                      raceType,
                      date,
                  )))
                : ((await this.placeHtmlRepository.loadPlaceHtml(
                      raceType,
                      date,
                  )) ??
                  (await this.placeHtmlRepository.fetchPlaceHtml(
                      raceType,
                      date,
                  )));
        const $ = load(html);
        // ...existing code...
        const chartWrapprer = $('.chartWrapprer');
        const table = chartWrapprer.find('table');
        const tbody = table.find('tbody');
        const trs = tbody.find('tr');
        const placeDataDict: Record<string, number[]> = {};
        trs.each((index: number, element) => {
            if (index < 2) {
                return;
            }
            const tds = $(element).find('td');
            const placeData = $(tds[0]).text();
            tds.each((tdIndex: number, tdElement) => {
                if (tdIndex === 0) {
                    if (!(placeData in placeDataDict)) {
                        placeDataDict[placeData] = [];
                    }
                    return;
                }
                if (
                    $(tdElement).text().includes('●') ||
                    $(tdElement).text().includes('☆') ||
                    $(tdElement).text().includes('Ｄ')
                ) {
                    placeDataDict[placeData].push(tdIndex);
                }
            });
        });
        const placeEntityList: PlaceHtmlEntity[] = [];
        for (const [place, raceDays] of Object.entries(placeDataDict)) {
            for (const raceDay of raceDays) {
                placeEntityList.push({
                    raceType: raceType,
                    datetime: new Date(
                        date.getFullYear(),
                        date.getMonth(),
                        raceDay,
                    ),
                    placeName: place,
                    placeHeldDays: undefined,
                });
            }
        }
        return placeEntityList;
    }
}
