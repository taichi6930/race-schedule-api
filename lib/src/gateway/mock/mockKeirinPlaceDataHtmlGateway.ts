import fs from 'node:fs/promises';
import path from 'node:path';

import { format } from 'date-fns';

import { Logger } from '../../utility/logger';
import { IKeirinPlaceDataHtmlGateway } from '../interface/iKeirinPlaceDataHtmlGateway';
/**
 * 競輪場開催データのHTMLを取得するGateway
 */
export class MockKeirinPlaceDataHtmlGateway
    implements IKeirinPlaceDataHtmlGateway
{
    /**
     * 開催データのHTMLを取得する
     * @param date - 取得する年月
     * @returns Promise<string> - 開催データのHTML
     */
    @Logger
    public async getPlaceDataHtml(date: Date): Promise<string> {
        // mockDataフォルダにあるhtmlを取得
        const testHtmlUrl = `../mockData/html/keirin/place/${format(date, 'yyyyMM')}.html`;
        // lib/src/gateway/mockData/html/keirin/placeの中にあるhtmlを取得
        const htmlFilePath = path.join(__dirname, testHtmlUrl);

        const htmlContent = await fs.readFile(htmlFilePath, 'utf8');
        return htmlContent;
    }
}
