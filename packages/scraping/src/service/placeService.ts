import { RaceType } from '@race-schedule/shared/src/types/raceType';
import { Logger } from '@race-schedule/shared/src/utilities/logger';
import { load } from 'cheerio';
import { inject, injectable } from 'tsyringe';

import { PlaceHtmlEntity } from '../entity/placeHtmlEntity';
import { IPlaceHtmlRepository } from '../repository/interface/IPlaceHtmlRepository';
import type { IPlaceService } from './interface/IPlaceService';

@injectable()
export class PlaceService implements IPlaceService {
    public constructor(
        @inject('PlaceHtmlRepository')
        private readonly placeHtmlRepository: IPlaceHtmlRepository,
    ) {}

    @Logger
    public async fetch(
        raceType: RaceType,
        date: Date,
    ): Promise<PlaceHtmlEntity[]> {
        // キャッシュから取得を試みる
        const html: string =
            (await this.placeHtmlRepository.loadPlaceHtml(raceType, date)) ??
            (await this.placeHtmlRepository.fetchPlaceHtml(raceType, date));

        // レース種別ごとにパース処理を振り分け
        switch (raceType) {
            case RaceType.JRA: {
                return this.parseJra(html, date);
            }
            case RaceType.NAR: {
                return this.parseNar();
            }
            case RaceType.OVERSEAS: {
                return this.parseOverseas();
            }
            case RaceType.KEIRIN: {
                return this.parseKeirin();
            }
            case RaceType.AUTORACE: {
                return this.parseAutorace();
            }
            case RaceType.BOATRACE: {
                return this.parseBoatrace();
            }
        }
    }

    /**
     * JRA（中央競馬）のHTMLをパース
     */
    private parseJra(html: string, date: Date): PlaceHtmlEntity[] {
        const $ = load(html);
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
                    raceType: RaceType.JRA,
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

    /**
     * NAR（地方競馬）のHTMLをパース
     */
    private parseNar(): PlaceHtmlEntity[] {
        const placeEntityList: PlaceHtmlEntity[] = [];

        // TODO: NARのHTML構造に合わせたパース処理を実装
        console.warn('NAR place parsing is not fully implemented yet');

        return placeEntityList;
    }

    /**
     * OVERSEAS（海外競馬）のHTMLをパース
     */
    private parseOverseas(): PlaceHtmlEntity[] {
        const placeEntityList: PlaceHtmlEntity[] = [];

        // TODO: OVERSEASのHTML構造に合わせたパース処理を実装
        console.warn('OVERSEAS place parsing is not fully implemented yet');

        return placeEntityList;
    }

    /**
     * KEIRIN（競輪）のHTMLをパース
     */
    private parseKeirin(): PlaceHtmlEntity[] {
        const placeEntityList: PlaceHtmlEntity[] = [];

        // TODO: KEIRINのHTML構造に合わせたパース処理を実装
        console.warn('KEIRIN place parsing is not fully implemented yet');

        return placeEntityList;
    }

    /**
     * AUTORACE（オートレース）のHTMLをパース
     */
    private parseAutorace(): PlaceHtmlEntity[] {
        const placeEntityList: PlaceHtmlEntity[] = [];

        // TODO: AUTORACEのHTML構造に合わせたパース処理を実装
        console.warn('AUTORACE place parsing is not fully implemented yet');

        return placeEntityList;
    }

    /**
     * BOATRACE（ボートレース）のHTMLをパース
     */
    private parseBoatrace(): PlaceHtmlEntity[] {
        const placeEntityList: PlaceHtmlEntity[] = [];

        // TODO: BOATRACEのHTML構造に合わせたパース処理を実装
        console.warn('BOATRACE place parsing is not fully implemented yet');

        return placeEntityList;
    }
}
