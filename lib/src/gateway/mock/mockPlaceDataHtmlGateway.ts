import * as fs from 'node:fs';
import path from 'node:path';

import { format } from 'date-fns';

import { Logger } from '../../utility/logger';
import { RaceType } from '../../utility/raceType';
import { IPlaceDataHtmlGateway } from '../interface/iPlaceDataHtmlGateway';
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
            case RaceType.JRA: {
                return `../mockData/html/jra/place/${format(date, 'yyyy')}.html`;
            }
            case RaceType.NAR: {
                return `../mockData/html/nar/place/${format(date, 'yyyyMM')}.html`;
            }
            case RaceType.KEIRIN: {
                return `../mockData/html/keirin/place/${format(date, 'yyyyMM')}.html`;
            }
            case RaceType.AUTORACE: {
                return `../mockData/html/autorace/place/${format(date, 'yyyyMM')}.html`;
            }
            case RaceType.BOATRACE: {
                // 1~3月は1、4月~6月は2、7月~9月は3、10月~12月は4
                const quarter = Math.ceil((date.getMonth() + 1) / 3).toString();
                // ボートレースのURLはquarterを使って生成
                return `../mockData/html/boatrace/place/${format(date, 'yyyy')}${quarter}.html`;
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
    @Logger
    public async getPlaceDataHtml(
        raceType: RaceType,
        date: Date,
    ): Promise<string> {
        // mockDataフォルダにあるhtmlを取得
        const testHtmlUrl = this.buildUrl(raceType, date);
        // lib/src/gateway/mockData/html/autorace/placeの中にあるhtmlを取得
        const htmlFilePath = path.join(__dirname, testHtmlUrl);

        const htmlContent = await fs.promises.readFile(htmlFilePath, 'utf8');
        return htmlContent;
    }
}
