/**
 * @module lib/src/utility/data/url
 * @fileoverview URL関連のユーティリティ関数を提供するモジュール
 */

import '../format';

import { format } from 'date-fns';

import { RaceType } from '../../../../src/utility/raceType';
import type { RaceCourse } from '../../../../src/utility/validateAndType/raceCourse';
import { createPlaceCode } from '../../../../src/utility/validateAndType/raceCourse';

/**
 * netkeibaのJRA出馬表のURLを生成する関数
 * @param raceId
 */
export const createNetkeibaJraShutubaUrl = (raceId: string): string =>
    `https://race.sp.netkeiba.com/race/shutuba.html?race_id=${raceId}`;

/**
 * netkeibaのJRAレース動画のURLを生成する関数
 * @param raceId
 */
export const createNetkeibaJraRaceVideoUrl = (raceId: string): string =>
    `https://race.sp.netkeiba.com/?pid=race_movie&race_id=${raceId}`;

/**
 * netkeibaのNAR出馬表のURLを生成する関数
 * @param raceId
 */
export const createNetkeibaNarShutubaUrl = (raceId: string): string =>
    `https://nar.sp.netkeiba.com/race/shutuba.html?race_id=${raceId}`;

/**
 * netkeirinの出馬表のURLを生成する関数
 * @param raceId
 */
export const createNetkeirinRaceShutubaUrl = (raceId: string): string =>
    `https://keirin.netkeiba.com/race/entry/?race_id=${raceId}`;

/**
 * netkeibaのリダイレクトURLを生成する関数
 * @param url
 */
export const createNetkeibaRedirectUrl = (url: string): string =>
    `https://netkeiba.page.link/?link=${encodeURIComponent(url)}`;

/**
 * netkeirinのリダイレクトURLを生成する関数
 * @param url
 */
export const createNetkeirinRedirectUrl = (url: string): string =>
    `https://netkeirin.page.link/?link=${encodeURIComponent(url)}`;

/**
 * JRAレースのURLを生成する関数
 * @param date
 */
export const createJraRaceUrl = (date: Date): string => {
    return `https://www.keibalab.jp/db/race/${format(date, 'yyyyMMdd')}/`;
};

export const createNarRaceUrl = (date: Date, place?: RaceCourse): string => {
    if (place === undefined) {
        throw new Error('NARレースの開催場が指定されていません');
    }
    const raceDate = `${date.getFullYear()}%2f${date.getXDigitMonth(2)}%2f${date.getXDigitDays(2)}`;
    return `https://www2.keiba.go.jp/KeibaWeb/TodayRaceInfo/RaceList?k_raceDate=${raceDate}&k_babaCode=${createPlaceCode(RaceType.NAR, place)}`;
};

export const createOverseasRaceUrl = (date: Date): string => {
    return `https://world.jra-van.jp/schedule/?year=${date.getFullYear()}&month=${date.getXDigitMonth(2)}`;
};

export const createKeirinRaceUrl = (date: Date, place?: RaceCourse): string => {
    if (place === undefined) {
        throw new Error('競輪レースの開催場が指定されていません');
    }
    return `https://www.oddspark.com/keirin/AllRaceList.do?joCode=${createPlaceCode(RaceType.KEIRIN, place)}&kaisaiBi=${format(date, 'yyyyMMdd')}`;
};

export const createAutoraceRaceUrl = (
    date: Date,
    place?: RaceCourse,
): string => {
    if (place === undefined) {
        throw new Error('オートレースの開催場が指定されていません');
    }
    return `https://www.oddspark.com/autorace/OneDayRaceList.do?raceDy=${format(date, 'yyyyMMdd')}&placeCd=${createPlaceCode(RaceType.AUTORACE, place)}`;
};

export const createBoatraceRaceUrl = (
    date: Date,
    place?: RaceCourse,
    number?: number,
): string => {
    if (place === undefined) {
        throw new Error('ボートレースの開催場が指定されていません');
    }
    if (number === undefined || Number.isNaN(number)) {
        throw new Error('ボートレースのレース番号が指定されていません');
    }
    return `https://www.boatrace.jp/owpc/pc/race/racelist?rno=${number}&hd=${format(date, 'yyyyMMdd')}&jcd=${createPlaceCode(RaceType.BOATRACE, place)}`;
};

export const createPlaceUrl = (raceType: RaceType, date: Date): string => {
    switch (raceType) {
        case RaceType.JRA: {
            return `https://prc.jp/jraracingviewer/contents/seiseki/${date.getFullYear().toString()}/`;
        }
        case RaceType.NAR: {
            return `https://www.keiba.go.jp/KeibaWeb/MonthlyConveneInfo/MonthlyConveneInfoTop?k_year=${date.getFullYear()}&k_month=${date.getXDigitMonth(2)}`;
        }
        case RaceType.KEIRIN: {
            return `https://www.oddspark.com/keirin/KaisaiCalendar.do?target=${format(date, 'yyyyMM')}`;
        }
        case RaceType.AUTORACE: {
            return `https://www.oddspark.com/autorace/KaisaiCalendar.do?target=${format(date, 'yyyyMM')}`;
        }
        case RaceType.BOATRACE: {
            // 1~3月は1、4月~6月は2、7月~9月は3、10月~12月は4
            const quarter = Math.ceil((date.getMonth() + 1) / 3).toString();
            // ボートレースのURLはquarterを使って生成
            return `https://sports.yahoo.co.jp/boatrace/schedule/?quarter=${quarter}`;
        }
        case RaceType.OVERSEAS: {
            // OVERSEASは未対応
            throw new Error('未対応のraceTypeです');
        }
    }
};
