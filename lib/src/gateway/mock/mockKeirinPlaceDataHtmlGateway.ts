import { format } from 'date-fns';
import * as fs from 'fs';
import * as path from 'path';

import { Logger } from '../../utility/logger';
import { IKeirinPlaceDataHtmlGateway } from '../interface/iKeirinPlaceDataHtmlGateway';
/**
 * 競輪場開催データのHTMLを取得するGateway
 */
export class MockKeirinPlaceDataHtmlGateway
    implements IKeirinPlaceDataHtmlGateway
{
    /**
     * 競輪場開催データのHTMLを取得する
     *
     * @param date - 取得する年月
     * @returns Promise<string> - 競輪場開催データのHTML
     */
    @Logger
    getPlaceDataHtml(date: Date): Promise<string> {
        // mockDataフォルダにあるhtmlを取得
        const testHtmlUrl = `../mockData/html/keirin/place/${format(date, 'yyyyMM')}.html`;
        // lib/src/gateway/mockData/html/keirin/placeの中にあるhtmlを取得
        const htmlFilePath = path.join(__dirname, testHtmlUrl);

        const htmlContent = fs.readFileSync(htmlFilePath, 'utf8');
        return Promise.resolve(htmlContent);
    }
}
