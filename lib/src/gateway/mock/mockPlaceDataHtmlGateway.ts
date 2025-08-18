import * as fs from 'node:fs';
import path from 'node:path';

import { format } from 'date-fns';

import { Logger } from '../../utility/logger';
import { RaceType } from '../../utility/raceType';
import { IPlaceDataHtmlGateway } from '../interface/iPlaceDataHtmlGateway';

export class MockPlaceDataHtmlGateway implements IPlaceDataHtmlGateway {
    
    private buildUrl(raceType: RaceType, date: Date): string {
        switch (raceType) {
            case RaceType.JRA: {
                return `../mockData/html/${raceType.toLowerCase()}/place/${format(date, 'yyyy')}.html`;
            }
            case RaceType.NAR:
            case RaceType.KEIRIN:
            case RaceType.AUTORACE: {
                return `../mockData/html/${raceType.toLowerCase()}/place/${format(date, 'yyyyMM')}.html`;
            }
            case RaceType.BOATRACE: {
                
                const quarter = Math.ceil((date.getMonth() + 1) / 3).toString();
                
                return `../mockData/html/${raceType.toLowerCase()}/place/${format(date, 'yyyy')}${quarter}.html`;
            }
            case RaceType.OVERSEAS: {
                
                throw new Error('未対応のraceTypeです');
            }
        }
    }

    
    @Logger
    public async getPlaceDataHtml(
        raceType: RaceType,
        date: Date,
    ): Promise<string> {
        
        const testHtmlUrl = this.buildUrl(raceType, date);
        
        const htmlFilePath = path.join(__dirname, testHtmlUrl);

        const htmlContent = await fs.promises.readFile(htmlFilePath, 'utf8');
        return htmlContent;
    }
}
