import '../../utility/format';

import { format } from 'date-fns';

import { AutoracePlaceCodeMap } from '../../utility/data/autorace/autoraceRaceCourse';
import { RaceCourse } from '../../utility/data/base';
import { BoatracePlaceCodeMap } from '../../utility/data/boatrace/boatraceRaceCourse';
import { KeirinPlaceCodeMap } from '../../utility/data/common/raceCourse';
import { NarBabacodeMap } from '../../utility/data/nar/narRaceCourse';
import { Logger } from '../../utility/logger';
import { RaceType } from '../../utility/raceType';
import { IRaceDataHtmlGateway } from '../interface/iRaceDataHtmlGateway';
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
                return this.buildJraUrl(date);
            }
            case RaceType.NAR: {
                return this.buildNarUrl(date, place);
            }
            case RaceType.WORLD: {
                return this.buildWorldUrl(date);
            }
            case RaceType.KEIRIN: {
                return this.buildKeirinUrl(date, place);
            }
            case RaceType.AUTORACE: {
                return this.buildAutoraceUrl(date, place);
            }
            case RaceType.BOATRACE: {
                return this.buildBoatraceUrl(date, place, number);
            }
            default: {
                throw new Error('未対応のraceTypeです');
            }
        }
    }

    private buildJraUrl(date: Date): string {
        const raceId = format(date, 'yyyyMMdd');
        return `https://www.keibalab.jp/db/race/${raceId}/`;
    }

    private buildNarUrl(date: Date, place?: RaceCourse): string {
        if (place === undefined) {
            throw new Error('NARレースの開催場が指定されていません');
        }
        const raceDate = `${date.getFullYear()}%2f${date.getXDigitMonth(2)}%2f${date.getXDigitDays(2)}`;
        const babacode = NarBabacodeMap[place];
        return `https://www2.keiba.go.jp/KeibaWeb/TodayRaceInfo/RaceList?k_raceDate=${raceDate}&k_babaCode=${babacode}`;
    }

    private buildWorldUrl(date: Date): string {
        return `https://world.jra-van.jp/schedule/?year=${date.getFullYear()}&month=${date.getMonth() + 1}`;
    }

    private buildKeirinUrl(date: Date, place?: RaceCourse): string {
        if (place === undefined) {
            throw new Error('競輪レースの開催場が指定されていません');
        }
        const raceDate = format(date, 'yyyyMMdd');
        const babacode = KeirinPlaceCodeMap[place];
        return `https://www.oddspark.com/keirin/AllRaceList.do?joCode=${babacode}&kaisaiBi=${raceDate}`;
    }

    private buildAutoraceUrl(date: Date, place?: RaceCourse): string {
        if (place === undefined) {
            throw new Error('オートレースの開催場が指定されていません');
        }
        const raceDate = format(date, 'yyyyMMdd');
        const babacode = AutoracePlaceCodeMap[place];
        return `https://www.oddspark.com/autorace/OneDayRaceList.do?raceDy=${raceDate}&placeCd=${babacode}`;
    }

    private buildBoatraceUrl(
        date: Date,
        place?: RaceCourse,
        number?: number,
    ): string {
        if (place === undefined) {
            throw new Error('ボートレースの開催場が指定されていません');
        }
        if (number === undefined || Number.isNaN(number)) {
            throw new Error('ボートレースのレース番号が指定されていません');
        }
        const raceDate = format(date, 'yyyyMMdd');
        const babacode = BoatracePlaceCodeMap[place];
        return `https://www.boatrace.jp/owpc/pc/race/racelist?rno=${number}&hd=${raceDate}&jcd=${babacode}`;
    }

    /**
     * レースデータのHTMLを取得する
     * @param raceType
     * @param date - 取得する年月
     * @param place - 開催場
     * @param number
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
            const html = await fetch(url);
            const htmlText = await html.text();
            return htmlText;
        } catch (error) {
            console.debug('htmlを取得できませんでした', error);
            throw new Error('htmlを取得できませんでした');
        }
    }
}
