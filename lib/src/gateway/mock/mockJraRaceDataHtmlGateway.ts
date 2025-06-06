import fs from 'node:fs/promises';
import path from 'node:path';

import { format } from 'date-fns';

import { Logger } from '../../utility/logger';
import { IJraRaceDataHtmlGateway } from '../interface/iJraRaceDataHtmlGateway';
/**
 * レースデータのHTMLを取得するGateway
 */
export class MockJraRaceDataHtmlGateway implements IJraRaceDataHtmlGateway {
    /**
     * レースデータのHTMLを取得する
     * @param date - 取得する年月
     * @returns Promise<string> - レースデータのHTML
     */
    @Logger
    public async getRaceDataHtml(date: Date): Promise<string> {
        // mockDataフォルダにあるhtmlを取得
        const testHtmlUrl = `../mockData/html/jra/race/${format(date, 'yyyyMMdd')}.html`;
        // lib/src/gateway/mockData/html/jra/placeの中にあるhtmlを取得
        const htmlFilePath = path.join(__dirname, testHtmlUrl);

        const htmlContent = await fs.readFile(htmlFilePath, 'utf8');
        return htmlContent;
    }
}
