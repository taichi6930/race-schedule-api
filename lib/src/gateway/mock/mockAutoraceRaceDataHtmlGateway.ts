import fs from 'node:fs/promises';
import path from 'node:path';

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
     * @param place - 開催場
     * @returns Promise<string> - レースデータのHTML
     */
    @Logger
    public async getRaceDataHtml(
        date: Date,
        place: AutoraceRaceCourse,
    ): Promise<string> {
        // mockDataフォルダにあるhtmlを取得
        const testHtmlUrl = `../mockData/html/autorace/race/${format(date, 'yyyyMMdd')}${AutoracePlaceCodeMap[place]}.html`;
        // lib/src/gateway/mockData/html/autorace/placeの中にあるhtmlを取得
        const htmlFilePath = path.join(__dirname, testHtmlUrl);

        const htmlContent = await fs.readFile(htmlFilePath, 'utf8');
        return htmlContent;
    }
}
