import { format } from 'date-fns';
import * as fs from 'fs';
import * as path from 'path';

import { Logger } from '../../utility/logger';
import { IJraRaceDataHtmlGateway } from '../interface/iJraRaceDataHtmlGateway';
/**
 * レースデータのHTMLを取得するGateway
 */
export class MockJraRaceDataHtmlGateway implements IJraRaceDataHtmlGateway {
    /**
     * レースデータのHTMLを取得する
     *
     * @param date - 取得する年月
     * @returns Promise<string> - レースデータのHTML
     */
    @Logger
    async getRaceDataHtml(date: Date): Promise<string> {
        // mockDataフォルダにあるhtmlを取得
        const testHtmlUrl = `../mockData/jra/race/${format(date, 'yyyyMMdd')}.html`;
        // lib/src/gateway/mockData/jra/placeの中にあるhtmlを取得
        const htmlFilePath = path.join(__dirname, testHtmlUrl);

        const htmlContent = fs.readFileSync(htmlFilePath, 'utf8');
        return Promise.resolve(htmlContent);
    }

    html = ``;
}