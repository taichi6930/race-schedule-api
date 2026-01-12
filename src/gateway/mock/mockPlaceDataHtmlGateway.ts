import * as fs from 'node:fs';
import path from 'node:path';

import { format } from 'date-fns';

import type { IPlaceDataHtmlGateway } from '../../../packages/scraping/src/gateway/interface/iPlaceDataHtmlGateway';
import { RaceType } from '../../../packages/shared/src/types/raceType';
/**
 * MockPlaceDataHtmlGatewayは、IPlaceDataHtmlGatewayのモック実装です。
 * 実際のHTML取得を行わず、モックデータを返します。
 * 主にテストや開発環境で使用されます。
 */
export class MockPlaceDataHtmlGateway implements IPlaceDataHtmlGateway {
    /**
     * raceTypeとdateからURLを生成
     * @param raceType - レース種別
     * @param date
     */
    private buildUrl(raceType: RaceType, date: Date): string {
        switch (raceType) {
            case RaceType.JRA:
            case RaceType.NAR:
            case RaceType.KEIRIN:
            case RaceType.AUTORACE:
            case RaceType.BOATRACE: {
                return `../mockData/html/${raceType.toLowerCase()}/place/${this.makeDate(raceType, date)}.html`;
            }
            case RaceType.OVERSEAS: {
                // OVERSEASでは未対応
                throw new Error('未対応のraceTypeです');
            }
        }
    }

    /**
     * 開催データのHTMLを取得する
     * @param raceType - レース種別
     * @param date - 取得する年月
     * @returns Promise<string> - 開催データのHTML
     */

    public async fetch(raceType: RaceType, date: Date): Promise<string> {
        // mockDataフォルダにあるhtmlを取得
        const testHtmlUrl = this.buildUrl(raceType, date);
        // lib/src/gateway/mockData/html/autorace/placeの中にあるhtmlを取得
        const htmlFilePath = path.join(__dirname, testHtmlUrl);

        const htmlContent = await fs.promises.readFile(htmlFilePath, 'utf8');
        return htmlContent;
    }

    private makeDate(raceType: RaceType, date: Date): string {
        switch (raceType) {
            case RaceType.JRA: {
                return format(date, 'yyyy');
            }
            case RaceType.NAR:
            case RaceType.KEIRIN:
            case RaceType.AUTORACE: {
                return format(date, 'yyyyMM');
            }
            case RaceType.BOATRACE: {
                // 1~3月は1、4月~6月は2、7月~9月は3、10月~12月は4
                const quarter = Math.ceil((date.getMonth() + 1) / 3).toString();
                // ボートレースのURLはquarterを使って生成
                return `${format(date, 'yyyy')}${quarter}`;
            }
            case RaceType.OVERSEAS: {
                // OVERSEASでは未対応
                throw new Error('未対応のraceTypeです');
            }
        }
    }
}
