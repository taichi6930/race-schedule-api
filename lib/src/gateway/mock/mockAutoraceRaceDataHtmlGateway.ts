import * as fs from 'node:fs';
import * as path from 'node:path';

import { format } from 'date-fns';

import { AutoracePlaceCodeMap } from '../../utility/data/autorace/autoraceRaceCourse';
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
     * @param date - 取得する年月
     * @returns Promise<string> - レースデータのHTML
     */
    @Logger
    async getRaceDataHtml(
        date: Date,
        place: AutoraceRaceCourse,
    ): Promise<string> {
        // mockDataフォルダにあるhtmlを取得
        const testHtmlUrl = `../mockData/html/autorace/race/${format(date, 'yyyyMMdd')}${AutoracePlaceCodeMap[place]}.html`;
        // lib/src/gateway/mockData/html/autorace/placeの中にあるhtmlを取得
        const htmlFilePath = path.join(__dirname, testHtmlUrl);

        const htmlContent = fs.readFileSync(htmlFilePath, 'utf8');
        return Promise.resolve(htmlContent);
    }
}
