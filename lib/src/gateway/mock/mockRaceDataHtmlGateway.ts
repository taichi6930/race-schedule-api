import fs from 'node:fs/promises';
import path from 'node:path';

import { format } from 'date-fns';

import { AutoracePlaceCodeMap } from '../../utility/data/autorace/autoraceRaceCourse';
import { RaceCourse } from '../../utility/data/base';
import { KeirinPlaceCodeMap } from '../../utility/data/keirin/keirinRaceCourse';
import { NarBabacodeMap } from '../../utility/data/nar/narRaceCourse';
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
        place: RaceCourse | undefined,
    ): string {
        if (raceType === RaceType.JRA) {
            return `../mockData/html/jra/race/${format(date, 'yyyyMMdd')}.html`;
        }
        if (raceType === RaceType.NAR) {
            if (place === undefined) {
                throw new Error('NARレースの開催場が指定されていません');
            }
            return `../mockData/html/nar/race/${format(date, 'yyyyMMdd')}${NarBabacodeMap[place]}.html`;
        }
        if (raceType === RaceType.WORLD) {
            return `../mockData/html/world/race/${format(date, 'yyyyMM')}.html`;
        }
        if (raceType === RaceType.KEIRIN) {
            if (place === undefined) {
                throw new Error('競輪レースの開催場が指定されていません');
            }
            return `../mockData/html/keirin/race/${format(date, 'yyyyMMdd')}${KeirinPlaceCodeMap[place]}.html`;
        }
        if (raceType === RaceType.AUTORACE) {
            if (place === undefined) {
                throw new Error('オートレースの開催場が指定されていません');
            }
            return `../mockData/html/autorace/race/${format(date, 'yyyyMMdd')}${AutoracePlaceCodeMap[place]}.html`;
        }
        throw new Error('未対応のraceTypeです');
    }
    /**
     * レースデータのHTMLを取得する
     * @param raceType
     * @param date - 取得する年月
     * @param place - 開催場
     * @returns Promise<string> - レースデータのHTML
     */
    @Logger
    public async getRaceDataHtml(
        raceType: RaceType,
        date: Date,
        place: RaceCourse | undefined,
    ): Promise<string> {
        try {
            // mockDataフォルダにあるhtmlを取得
            const testHtmlUrl = this.buildUrl(raceType, date, place);
            // lib/src/gateway/mockData/html/nar/placeの中にあるhtmlを取得
            const htmlFilePath = path.join(__dirname, testHtmlUrl);
            const htmlContent = await fs.readFile(htmlFilePath, 'utf8');
            return htmlContent;
        } catch (error) {
            console.debug('htmlを取得できませんでした', error);
            throw new Error('htmlを取得できませんでした');
        }
    }
}
