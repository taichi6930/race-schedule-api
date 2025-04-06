import fs from 'node:fs/promises';
import path from 'node:path';

import { Logger } from '../../utility/logger';
import { IBoatracePlaceDataHtmlGateway } from '../interface/iBoatracePlaceDataHtmlGateway';
/**
 * ボートレース開催データのHTMLを取得するGateway
 */
export class MockBoatracePlaceDataHtmlGateway
    implements IBoatracePlaceDataHtmlGateway
{
    /**
     * ボートレース開催データのHTMLを取得する
     * @param quarter - 取得するクォーター
     * @returns Promise<string> - 開催データのHTML
     */
    @Logger
    public async getPlaceDataHtml(quarter: string): Promise<string> {
        // mockDataフォルダにあるhtmlを取得
        const testHtmlUrl = `../mockData/html/boatrace/place/${quarter}.html`;
        // lib/src/gateway/mockData/html/boatrace/placeの中にあるhtmlを取得
        const htmlFilePath = path.join(__dirname, testHtmlUrl);

        const htmlContent = await fs.readFile(htmlFilePath, 'utf8');
        return htmlContent;
    }
}
