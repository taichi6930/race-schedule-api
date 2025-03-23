import * as fs from 'node:fs';
import path from 'node:path';

import { format } from 'date-fns';

import { Logger } from '../../utility/logger';
import { INarPlaceDataHtmlGateway } from '../interface/iNarPlaceDataHtmlGateway';
/**
 * 競馬場開催データのHTMLを取得するGateway
 */
export class MockNarPlaceDataHtmlGateway implements INarPlaceDataHtmlGateway {
    /**
     * 開催データのHTMLを取得する
     * @param date - 取得する年月
     * @returns Promise<string> - 開催データのHTML
     */
    @Logger
    getPlaceDataHtml(date: Date): Promise<string> {
        // mockDataフォルダにあるhtmlを取得
        const testHtmlUrl = `../mockData/html/nar/place/${format(date, 'yyyyMM')}.html`;
        // lib/src/gateway/mockData/html/nar/placeの中にあるhtmlを取得
        const htmlFilePath = path.join(__dirname, testHtmlUrl);

        const htmlContent = fs.readFileSync(htmlFilePath, 'utf8');
        return Promise.resolve(htmlContent);
    }
}
