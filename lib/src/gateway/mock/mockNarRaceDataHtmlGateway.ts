import fs from 'node:fs/promises';
import path from 'node:path';

import { format } from 'date-fns';

import {
    NarBabacodeMap,
    NarRaceCourse,
} from '../../utility/data/nar/narRaceCourse';
import { Logger } from '../../utility/logger';
import { INarRaceDataHtmlGateway } from '../interface/iNarRaceDataHtmlGateway';
/**
 * レースデータのHTMLを取得するGateway
 */
export class MockNarRaceDataHtmlGateway implements INarRaceDataHtmlGateway {
    /**
     * レースデータのHTMLを取得する
     * @param date - 取得する年月
     * @param place - 開催場
     * @returns Promise<string> - レースデータのHTML
     */
    @Logger
    public async getRaceDataHtml(
        date: Date,
        place: NarRaceCourse,
    ): Promise<string> {
        try {
            // mockDataフォルダにあるhtmlを取得
            const testHtmlUrl = `../mockData/html/nar/race/${format(date, 'yyyyMMdd')}${NarBabacodeMap[place]}.html`;
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
