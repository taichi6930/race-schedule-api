import fs from 'node:fs/promises';
import path from 'node:path';

import { format } from 'date-fns';

import {
    createPlaceCodeMap,
    RaceCourse,
} from '../../utility/data/common/raceCourse';
import { Logger } from '../../utility/logger';
import { RaceType } from '../../utility/raceType';
import { IRaceDataHtmlGateway } from '../interface/iRaceDataHtmlGateway';
/**
 * レースデータのHTMLを取得するGateway
 */
export class MockRaceDataHtmlGateway implements IRaceDataHtmlGateway {
    private buildUrl(
        raceType: RaceType,
        date: Date,
        place?: RaceCourse,
        number?: number,
    ): string {
        switch (raceType) {
            case RaceType.JRA: {
                return this.buildJraUrl(date);
            }
            case RaceType.NAR: {
                return this.buildNarUrl(date, place);
            }
            case RaceType.OVERSEAS: {
                return this.buildOverseasUrl(date);
            }
            case RaceType.KEIRIN: {
                return this.buildKeirinUrl(date, place);
            }
            case RaceType.AUTORACE: {
                return this.buildAutoraceUrl(date, place);
            }
            case RaceType.BOATRACE: {
                return this.buildBoatraceUrl(date, place, number);
            }
        }
    }

    private buildJraUrl(date: Date): string {
        return `../mockData/html/jra/race/${format(date, 'yyyyMMdd')}.html`;
    }

    private buildNarUrl(date: Date, place?: RaceCourse): string {
        if (place === undefined) {
            throw new Error('NARレースの開催場が指定されていません');
        }
        return `../mockData/html/nar/race/${format(date, 'yyyyMMdd')}${
            createPlaceCodeMap(RaceType.NAR)[place]
        }.html`;
    }

    private buildOverseasUrl(date: Date): string {
        return `../mockData/html/overseas/race/${format(date, 'yyyyMM')}.html`;
    }

    private buildKeirinUrl(date: Date, place?: RaceCourse): string {
        if (place === undefined) {
            throw new Error('競輪レースの開催場が指定されていません');
        }
        return `../mockData/html/keirin/race/${format(date, 'yyyyMMdd')}${createPlaceCodeMap(RaceType.KEIRIN)[place]}.html`;
    }

    private buildAutoraceUrl(date: Date, place?: RaceCourse): string {
        if (place === undefined) {
            throw new Error('オートレースの開催場が指定されていません');
        }
        return `../mockData/html/autorace/race/${format(date, 'yyyyMMdd')}${createPlaceCodeMap(RaceType.AUTORACE)[place]}.html`;
    }

    private buildBoatraceUrl(
        date: Date,
        place?: RaceCourse,
        number?: number,
    ): string {
        if (place === undefined) {
            throw new Error('ボートレースの開催場が指定されていません');
        }
        if (number === undefined) {
            throw new Error('ボートレースのレース番号が指定されていません');
        }
        return `../mockData/html/boatrace/race/${format(date, 'yyyyMMdd')}${
            createPlaceCodeMap(RaceType.BOATRACE)[place]
        }${number.toString()}.html`;
        // lib/src/gateway/mockData/html/boatrace/placeの中にあるhtmlを取得
    }

    /**
     * レースデータのHTMLを取得する
     * @param raceType - レース種別
     * @param date - 取得する年月
     * @param place - 開催場
     * @param number - レース番号
     * @returns Promise<string> - レースデータのHTML
     */
    @Logger
    public async getRaceDataHtml(
        raceType: RaceType,
        date: Date,
        place: RaceCourse | undefined,
        number?: number,
    ): Promise<string> {
        try {
            // mockDataフォルダにあるhtmlを取得
            const testHtmlUrl = this.buildUrl(raceType, date, place, number);
            // lib/src/gateway/mockData/html/nar/placeの中にあるhtmlを取得
            const htmlFilePath = path.join(__dirname, testHtmlUrl);
            const htmlContent = await fs.readFile(htmlFilePath, 'utf8');
            return htmlContent;
        } catch (error) {
            console.debug('HTMLの取得に失敗しました', error);
            throw new Error('HTMLの取得に失敗しました');
        }
    }
}
