import { format } from 'date-fns';
import * as fs from 'fs';
import * as path from 'path';

import { AUTORACE_PLACE_CODE } from '../../utility/data/autorace/autoraceRaceCourse';
import { AutoraceRaceCourse } from '../../utility/data/autorace/autoraceRaceCourse';
import { Logger } from '../../utility/logger';
import { IAutoraceRaceDataHtmlGateway } from '../interface/iAutoraceRaceDataHtmlGateway';
/**
 * レースデータのHTMLを取得するGateway
 */
export class MockAutoraceRaceDataHtmlGateway
    implements IAutoraceRaceDataHtmlGateway
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
        place: AutoraceRaceCourse,
    ): Promise<string> {
        // mockDataフォルダにあるhtmlを取得
        const testHtmlUrl = `../mockData/html/autorace/race/${format(date, 'yyyyMMdd')}${AUTORACE_PLACE_CODE[place]}.html`;
        // lib/src/gateway/mockData/html/autorace/placeの中にあるhtmlを取得
        const htmlFilePath = path.join(__dirname, testHtmlUrl);

        const htmlContent = fs.readFileSync(htmlFilePath, 'utf8');
        return Promise.resolve(htmlContent);
    }

    html = ``;
}
