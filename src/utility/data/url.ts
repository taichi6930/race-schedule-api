/**
 * @fileoverview URL関連のユーティリティ関数を提供するモジュール
 */

import { format } from 'date-fns';

import { CourseCodeType } from '../../../packages/shared/src/types/courseCodeType';
import { RaceType } from '../../../packages/shared/src/types/raceType';
import {
    formatDayDigits,
    formatMonthDigits,
} from '../../../packages/shared/src/utilities/format';
import type { RaceCourse } from '../validateAndType/raceCourse';
import { createPlaceCode } from '../validateAndType/raceCourse';

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
 * netkeibaのNARレース動画のURLを生成する関数
 */
export const createNetkeibaNarRaceVideoUrl = (raceId: string): string =>
    `https://nar.sp.netkeiba.com/race/race_movie.html?race_id=${raceId}`;

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

export const createRaceUrl = (
    raceType: RaceType,
    date: Date,
    place?: RaceCourse,
    number?: number,
): string => {
    switch (raceType) {
        case RaceType.JRA: {
            if (place === undefined) {
                throw new Error('JRAレースの開催場が指定されていません');
            }
            if (number === undefined || Number.isNaN(number)) {
                throw new Error('JRAの番号が指定されていません');
            }
            // yearの下2桁 2025 -> 25, 2001 -> 01
            const year = String(date.getFullYear()).slice(-2);
            const babaCode = createPlaceCode(
                raceType,
                CourseCodeType.NETKEIBA,
                place,
            );
            // numberを4桁にフォーマット（頭を0埋め 100 -> 0100, 2 -> 0002）
            const num = String(number).padStart(4, '0');
            return `https://sports.yahoo.co.jp/keiba/race/list/${year}${babaCode}${num}`;
        }
        case RaceType.NAR: {
            if (place === undefined) {
                throw new Error('NARレースの開催場が指定されていません');
            }
            const raceDate = `${date.getFullYear()}%2f${formatMonthDigits(date, 2)}%2f${formatDayDigits(date, 2)}`;
            return `https://www2.keiba.go.jp/KeibaWeb/TodayRaceInfo/RaceList?k_raceDate=${raceDate}&k_babaCode=${createPlaceCode(raceType, CourseCodeType.OFFICIAL, place)}`;
        }
        case RaceType.KEIRIN: {
            if (place === undefined) {
                throw new Error('競輪レースの開催場が指定されていません');
            }
            return `https://www.oddspark.com/keirin/AllRaceList.do?joCode=${createPlaceCode(raceType, CourseCodeType.OFFICIAL, place)}&kaisaiBi=${format(date, 'yyyyMMdd')}`;
        }
        case RaceType.AUTORACE: {
            if (place === undefined) {
                throw new Error('オートレースの開催場が指定されていません');
            }
            return `https://www.oddspark.com/autorace/OneDayRaceList.do?raceDy=${format(date, 'yyyyMMdd')}&placeCd=${createPlaceCode(raceType, CourseCodeType.OFFICIAL, place)}`;
        }
        case RaceType.BOATRACE: {
            if (place === undefined) {
                throw new Error('ボートレースの開催場が指定されていません');
            }
            if (number === undefined || Number.isNaN(number)) {
                throw new Error('ボートレースのレース番号が指定されていません');
            }
            return `https://www.boatrace.jp/owpc/pc/race/racelist?rno=${number}&hd=${format(date, 'yyyyMMdd')}&jcd=${createPlaceCode(raceType, CourseCodeType.OFFICIAL, place)}`;
        }
        case RaceType.OVERSEAS: {
            return `https://world.jra-van.jp/schedule/?year=${date.getFullYear()}&month=${formatMonthDigits(date, 2)}`;
        }
    }
};
