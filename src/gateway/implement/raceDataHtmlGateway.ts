import {
    createAutoraceRaceUrl,
    createBoatraceRaceUrl,
    createJraRaceUrl,
    createKeirinRaceUrl,
    createNarRaceUrl,
    createOverseasRaceUrl,
} from '../../utility/data/url';
import { Logger } from '../../utility/logger';
import { RaceType } from '../../utility/raceType';
import type { RaceCourse } from '../../utility/validateAndType/raceCourse';
import type { IRaceDataHtmlGateway } from '../interface/iRaceDataHtmlGateway';

/**
 * レースデータのHTMLを取得するGateway
 */
export class RaceDataHtmlGateway implements IRaceDataHtmlGateway {
    private buildUrl(
        raceType: RaceType,
        date: Date,
        place?: RaceCourse,
        number?: number,
    ): string {
        switch (raceType) {
            case RaceType.JRA: {
                return createJraRaceUrl(date);
            }
            case RaceType.NAR: {
                return createNarRaceUrl(date, place);
            }
            case RaceType.OVERSEAS: {
                return createOverseasRaceUrl(date);
            }
            case RaceType.KEIRIN: {
                return createKeirinRaceUrl(date, place);
            }
            case RaceType.AUTORACE: {
                return createAutoraceRaceUrl(date, place);
            }
            case RaceType.BOATRACE: {
                return createBoatraceRaceUrl(date, place, number);
            }
        }
    }

    /**
     * レースデータのHTMLを取得する
     * @param raceType - レース種別
     * @param date - 取得する年月
     * @param place - 開催場
     * @param number - レース番号
     * @returns Promise<string> - レースデータのHTML
     */
    @Logger
    public async getRaceDataHtml(
        raceType: RaceType,
        date: Date,
        place?: RaceCourse,
        number?: number,
    ): Promise<string> {
        // gokeibaのURLからHTMLを取得する
        try {
            const url = this.buildUrl(raceType, date, place, number);
            const html = await fetch(url, {
                headers: {
                    'User-Agent': 'Mozilla/5.0',
                    'Accept': 'text/html',
                },
            });
            const htmlText = await html.text();
            return htmlText;
        } catch (error: unknown) {
            throw new TypeError(
                error instanceof Error
                    ? error.message
                    : 'HTMLの取得に失敗しました',
            );
        }
    }
}
