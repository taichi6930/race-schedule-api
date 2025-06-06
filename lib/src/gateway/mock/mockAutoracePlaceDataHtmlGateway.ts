import * as fs from 'node:fs';
import path from 'node:path';

import { format } from 'date-fns';

import { Logger } from '../../utility/logger';
import { IAutoracePlaceDataHtmlGateway } from '../interface/iAutoracePlaceDataHtmlGateway';
/**
 * オートレース開催データのHTMLを取得するGateway
 */
export class MockAutoracePlaceDataHtmlGateway
    implements IAutoracePlaceDataHtmlGateway
{
    /**
     * 開催データのHTMLを取得する
     * @param date - 取得する年月
     * @returns Promise<string> - 開催データのHTML
     */
    @Logger
    public async getPlaceDataHtml(date: Date): Promise<string> {
        // mockDataフォルダにあるhtmlを取得
        const testHtmlUrl = `../mockData/html/autorace/place/${format(date, 'yyyyMM')}.html`;
        // lib/src/gateway/mockData/html/autorace/placeの中にあるhtmlを取得
        const htmlFilePath = path.join(__dirname, testHtmlUrl);

        const htmlContent = await fs.promises.readFile(htmlFilePath, 'utf8');
        return htmlContent;
    }
}
