import * as fs from 'node:fs';
import * as path from 'node:path';

import { format } from 'date-fns';

import { Logger } from '../../utility/logger';
import { IWorldRaceDataHtmlGateway } from '../interface/iWorldRaceDataHtmlGateway';

/**
 * レースデータのHTMLを取得するGateway
 */
export class MockWorldRaceDataHtmlGateway implements IWorldRaceDataHtmlGateway {
    /**
     * レースデータのHTMLを取得する
     * @param date - 取得する年月
     * @returns Promise<string> - レースデータのHTML
     */
    @Logger
    async getRaceDataHtml(date: Date): Promise<string> {
        // mockDataフォルダにあるhtmlを取得
        const testHtmlUrl = `../mockData/html/world/race/${format(date, 'yyyyMM')}.html`;
        // lib/src/gateway/mockData/html/world/placeの中にあるhtmlを取得
        const htmlFilePath = path.join(__dirname, testHtmlUrl);

        const htmlContent = fs.readFileSync(htmlFilePath, 'utf8');
        return Promise.resolve(htmlContent);
    }
}
