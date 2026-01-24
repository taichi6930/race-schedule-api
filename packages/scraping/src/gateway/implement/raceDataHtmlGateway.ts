import { RaceType } from '@race-schedule/shared/src/types/raceType';
import { createRaceUrl } from '@race-schedule/shared/src/utilities/createRaceUrl';
import { Logger } from '@race-schedule/shared/src/utilities/logger';
import { injectable } from 'tsyringe';

import { IRaceDataHtmlGateway } from '../interface/iRaceDataHtmlGateway';

@injectable()
export class RaceDataHtmlGateway implements IRaceDataHtmlGateway {
    /**
     * レースデータのHTMLを取得する
     * @param raceType - レース種別
     * @param date - 取得する日付
     * @param location - 開催場所（文字列）
     * @param number - レース番号（JRA/BOATRACEのみ使用）
     */
    @Logger
    public async fetch(
        raceType: RaceType,
        date: Date,
        location?: string,
        number?: number,
    ): Promise<string> {
        // ローカル環境では外部アクセスを禁止
        if (process.env.NODE_ENV === 'development') {
            throw new Error(
                'ローカル環境では外部HTMLの取得はできません。R2キャッシュのみ使用してください。',
            );
        }

        const url = createRaceUrl(raceType, date, location, number);
        console.debug('HTML取得URL:', url);
        // 1秒待機（過負荷防止）
        await new Promise((resolve) => setTimeout(resolve, 1000));
        try {
            const response = await fetch(url);
            return await response.text();
        } catch (error) {
            console.error('HTML取得失敗:', error);
            throw new Error('HTMLの取得に失敗しました');
        }
    }
}
