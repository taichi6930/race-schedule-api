import { promises as fs } from 'node:fs';
import path from 'node:path';

import { format } from 'date-fns';

import {
    BoatracePlaceCodeMap,
    BoatraceRaceCourse,
} from '../../utility/data/boatrace/boatraceRaceCourse';
import { BoatraceRaceNumber } from '../../utility/data/boatrace/boatraceRaceNumber';
import { Logger } from '../../utility/logger';
import { IBoatraceRaceDataHtmlGateway } from '../interface/iBoatraceRaceDataHtmlGateway';
/**
 * レースデータのHTMLを取得するGateway
 */
export class MockBoatraceRaceDataHtmlGateway
    implements IBoatraceRaceDataHtmlGateway
{
    /**
     * レースデータのHTMLを取得する
     * @param date - 取得する年月
     * @returns Promise<string> - レースデータのHTML
     */
    @Logger
    async getRaceDataHtml(
        date: Date,
        place: BoatraceRaceCourse,
        number: BoatraceRaceNumber,
    ): Promise<string> {
        // mockDataフォルダにあるhtmlを取得
        const testHtmlUrl = `../mockData/html/boatrace/race/${format(date, 'yyyyMMdd')}${BoatracePlaceCodeMap[place]}${number.toString()}.html`;
        // lib/src/gateway/mockData/html/boatrace/placeの中にあるhtmlを取得
        const htmlFilePath = path.join(__dirname, testHtmlUrl);

        const htmlContent = await fs.readFile(htmlFilePath, 'utf8');
        return htmlContent;
    }
}
