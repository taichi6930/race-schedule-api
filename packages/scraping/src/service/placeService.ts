import { RaceType } from '@race-schedule/shared';
import cheerio from 'cheerio';
import { inject, injectable } from 'tsyringe';

import { PlaceHtmlEntity } from '../entity/placeHtmlEntity';
import { IPlaceHtmlRepository } from '../repository/interface/IPlaceHtmlRepository';
@injectable()
export class PlaceService {
    public constructor(
        @inject('PlaceHtmlRepository')
        private readonly placeHtmlRepository?: IPlaceHtmlRepository,
    ) {}

    public async fetch(
        raceType: RaceType,
        date: Date,
    ): Promise<PlaceHtmlEntity[]> {
        if (!this.placeHtmlRepository)
            throw new Error('Repository not provided');
        // HTMLを取得
        const html: string =
            (await this.placeHtmlRepository.loadPlaceHtml(raceType, date)) ??
            (await this.placeHtmlRepository.fetchPlaceHtml(raceType, date));
        const $ = cheerio.load(html);
        // <div class="chartWrapprer">を取得
        const chartWrapprer = $('.chartWrapprer');
        // <div class="chartWrapprer">内のテーブルを取得
        const table = chartWrapprer.find('table');
        // その中のtbodyを取得
        const tbody = table.find('tbody');
        // tbody内のtrたちを取得
        // 1行目のtrはヘッダーとして取得
        // 2行目のtrは曜日
        // ３行目のtr以降はレース情報
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
