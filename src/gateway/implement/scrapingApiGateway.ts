import 'reflect-metadata';

import { format } from 'date-fns';
import { injectable } from 'tsyringe';

import type { PlaceHtmlEntity } from '../../../packages/scraping/src/entity/placeHtmlEntity';
import type { RaceHtmlEntity } from '../../../packages/scraping/src/entity/raceHtmlEntity';
import type { RaceType } from '../../../packages/shared/src/types/raceType';
import type { GradeType } from '../../../packages/shared/src/utilities/gradeType';
import { Logger } from '../../../packages/shared/src/utilities/logger';
import { OldEnvStore } from '../../utility/oldEnvStore';
import type { IScrapingApiGateway } from '../interface/iScrapingApiGateway';

/**
 * ScrapingAPIを呼び出すGatewayの実装
 */
@injectable()
export class ScrapingApiGateway implements IScrapingApiGateway {
    private get baseUrl(): string {
        return OldEnvStore.env.SCRAPING_API_BASE_URL;
    }

    /**
     * 開催場データを取得
     */
    @Logger
    public async fetchPlaceList(
        raceTypeList: RaceType[],
        startDate: Date,
        finishDate: Date,
        locationList?: string[],
    ): Promise<PlaceHtmlEntity[]> {
        const params = new URLSearchParams({
            startDate: format(startDate, 'yyyy-MM-dd'),
            finishDate: format(finishDate, 'yyyy-MM-dd'),
            raceTypeList: raceTypeList.join(','),
        });

        if (locationList && locationList.length > 0) {
            params.set('locationList', locationList.join(','));
        }

        const url = `${this.baseUrl}/scraping/place?${params.toString()}`;
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(
                `Scraping API failed: ${response.status} ${response.statusText}`,
            );
        }

        const data = (await response.json()) as PlaceHtmlEntity[];

        // Date型に変換
        return data.map((item) => ({
            ...item,
            datetime: new Date(item.datetime),
        }));
    }

    /**
     * レースデータを取得
     */
    @Logger
    public async fetchRaceList(
        raceTypeList: RaceType[],
        startDate: Date,
        finishDate: Date,
        locationList?: string[],
        gradeList?: GradeType[],
    ): Promise<RaceHtmlEntity[]> {
        const params = new URLSearchParams({
            startDate: format(startDate, 'yyyy-MM-dd'),
            finishDate: format(finishDate, 'yyyy-MM-dd'),
            raceTypeList: raceTypeList.join(','),
        });

        if (locationList && locationList.length > 0) {
            params.set('locationList', locationList.join(','));
        }

        if (gradeList && gradeList.length > 0) {
            params.set('gradeList', gradeList.join(','));
        }

        const url = `${this.baseUrl}/scraping/race?${params.toString()}`;
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(
                `Scraping API failed: ${response.status} ${response.statusText}`,
            );
        }

        const data = (await response.json()) as RaceHtmlEntity[];

        // Date型に変換
        return data.map((item) => ({
            ...item,
            datetime: new Date(item.datetime),
        }));
    }
}
