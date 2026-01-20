import { RaceType } from '@race-schedule/shared/src/types/raceType';
import { createPlaceUrl } from '@race-schedule/shared/src/utilities/createPlaceUrl';
import { Logger } from '@race-schedule/shared/src/utilities/logger';
import { injectable } from 'tsyringe';

import { IPlaceDataHtmlGateway } from '../interface/iPlaceDataHtmlGateway';

@injectable()
export class PlaceDataHtmlGateway implements IPlaceDataHtmlGateway {
    /**
     * 開催場データのHTMLを取得する
     * @param raceType - レース種別
     * @param date - 取得する年月
     */
    @Logger
    public async fetch(raceType: RaceType, date: Date): Promise<string> {
        const url = this.getPlaceUrlByType(raceType, date);
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

    private getPlaceUrlByType(raceType: RaceType, date: Date): string {
        switch (raceType) {
            case 'JRA': {
                return createPlaceUrl(
                    raceType,
                    new Date(date.getFullYear(), 0, 1),
                );
            }
            case 'NAR':
            case 'OVERSEAS':
            case 'KEIRIN':
            case 'AUTORACE':
            case 'BOATRACE': {
                return createPlaceUrl(
                    raceType,
                    new Date(date.getFullYear(), date.getMonth(), 1),
                );
            }
            default: {
                // raceTypeが'UNKNOWN'や型外の場合もここでカバー
                // exhaustiveチェック抑制のためコメントを明示
                return createPlaceUrl(raceType, date);
            }
        }
    }
}
