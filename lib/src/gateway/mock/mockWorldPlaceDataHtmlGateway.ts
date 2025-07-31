import fs from 'node:fs/promises';
import path from 'node:path';

import { format } from 'date-fns';

import { Logger } from '../../utility/logger';
import { IWorldPlaceDataHtmlGateway } from '../interface/iWorldPlaceDataHtmlGateway';
/**
 * 競馬場データのHTMLを取得するGateway
 */
export class MockWorldPlaceDataHtmlGateway
    implements IWorldPlaceDataHtmlGateway
{
    /**
     * 競馬場データのHTMLを取得する
     * @param date - 取得する年月
     * @returns Promise<string> - 競馬場データのHTML
     */
    @Logger
    public async getPlaceDataHtml(date: Date): Promise<string> {
        // mockDataフォルダにあるhtmlを取得
        const testHtmlUrl = `../mockData/html/world/place/${format(date, 'yyyyMM')}.html`;
        // lib/src/gateway/mockData/html/world/placeの中にあるhtmlを取得
        const htmlFilePath = path.join(__dirname, testHtmlUrl);

        const htmlContent = await fs.readFile(htmlFilePath, 'utf8');
        return htmlContent;
    }
}
