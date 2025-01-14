import { format } from 'date-fns';
import * as fs from 'fs';
import * as path from 'path';

import {
    KEIRIN_PLACE_CODE,
    KeirinRaceCourse,
} from '../../utility/data/keirin/keirinRaceCourse';
import { Logger } from '../../utility/logger';
import { IKeirinRaceDataHtmlGateway } from '../interface/iKeirinRaceDataHtmlGateway';
/**
 * レースデータのHTMLを取得するGateway
 */
export class MockKeirinRaceDataHtmlGateway
    implements IKeirinRaceDataHtmlGateway
{
    /**
     * レースデータのHTMLを取得する
     *
     * @param date - 取得する年月
     * @returns Promise<string> - レースデータのHTML
     */
    @Logger
    async getRaceDataHtml(
        date: Date,
        place: KeirinRaceCourse,
    ): Promise<string> {
        // mockDataフォルダにあるhtmlを取得
        const testHtmlUrl = `../mockData/html/keirin/race/${format(date, 'yyyyMMdd')}${KEIRIN_PLACE_CODE[place]}.html`;
        // lib/src/gateway/mockData/html/keirin/placeの中にあるhtmlを取得
        const htmlFilePath = path.join(__dirname, testHtmlUrl);

        const htmlContent = fs.readFileSync(htmlFilePath, 'utf8');
        return Promise.resolve(htmlContent);
    }

    html = ``;
}
