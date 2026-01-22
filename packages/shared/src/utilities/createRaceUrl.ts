import { format } from 'date-fns';

import { CourseCodeType } from '../types/courseCodeType';
import { RaceType } from '../types/raceType';
import { RaceCourseMasterList } from './course';
import { formatDayDigits, formatMonthDigits } from './format';

/**
 * レース種別とコードタイプから場所コードを取得
 * @param raceType - レース種別
 * @param courseCodeType - コードタイプ
 * @param locationName - 場所名（文字列）
 * @returns 場所コード
 */
const getPlaceCode = (
    raceType: RaceType,
    courseCodeType: CourseCodeType,
    locationName: string,
): string => {
    const course = RaceCourseMasterList.find(
        (c) =>
            c.raceType === raceType &&
            c.courseCodeType === courseCodeType &&
            c.placeName === locationName,
    );
    return course?.placeCode ?? '';
};

/**
 * レースデータ取得用のURLを生成
 * @param raceType - レース種別
 * @param date - 日付
 * @param location - 開催場所（文字列、オプション）
 * @param number - レース番号（オプション）
 * @returns レースデータURL
 */
export const createRaceUrl = (
    raceType: RaceType,
    date: Date,
    location?: string,
    number?: number,
): string => {
    switch (raceType) {
        case RaceType.JRA: {
            if (!location) {
                throw new Error('JRAレースの開催場が指定されていません');
            }
            if (number === undefined || Number.isNaN(number)) {
                throw new Error('JRAの番号が指定されていません');
            }
            // yearの下2桁 2025 -> 25, 2001 -> 01
            const year = String(date.getFullYear()).slice(-2);
            const babaCode = getPlaceCode(
                raceType,
                CourseCodeType.NETKEIBA,
                location,
            );
            // numberを4桁にフォーマット（頭を0埋め 100 -> 0100, 2 -> 0002）
            const num = String(number).padStart(4, '0');
            return `https://sports.yahoo.co.jp/keiba/race/list/${year}${babaCode}${num}`;
        }
        case RaceType.NAR: {
            if (!location) {
                throw new Error('NARレースの開催場が指定されていません');
            }
            const raceDate = `${date.getFullYear()}%2f${formatMonthDigits(date, 2)}%2f${formatDayDigits(date, 2)}`;
            const babaCode = getPlaceCode(
                raceType,
                CourseCodeType.OFFICIAL,
                location,
            );
            return `https://www2.keiba.go.jp/KeibaWeb/TodayRaceInfo/RaceList?k_raceDate=${raceDate}&k_babaCode=${babaCode}`;
        }
        case RaceType.KEIRIN: {
            if (!location) {
                throw new Error('競輪レースの開催場が指定されていません');
            }
            const joCode = getPlaceCode(
                raceType,
                CourseCodeType.OFFICIAL,
                location,
            );
            return `https://www.oddspark.com/keirin/AllRaceList.do?joCode=${joCode}&kaisaiBi=${format(date, 'yyyyMMdd')}`;
        }
        case RaceType.AUTORACE: {
            if (!location) {
                throw new Error('オートレースの開催場が指定されていません');
            }
            const placeCd = getPlaceCode(
                raceType,
                CourseCodeType.OFFICIAL,
                location,
            );
            return `https://www.oddspark.com/autorace/OneDayRaceList.do?raceDy=${format(date, 'yyyyMMdd')}&placeCd=${placeCd}`;
        }
        case RaceType.BOATRACE: {
            if (!location) {
                throw new Error('ボートレースの開催場が指定されていません');
            }
            if (number === undefined || Number.isNaN(number)) {
                throw new Error('ボートレースのレース番号が指定されていません');
            }
            const jcd = getPlaceCode(
                raceType,
                CourseCodeType.OFFICIAL,
                location,
            );
            return `https://www.boatrace.jp/owpc/pc/race/racelist?rno=${number}&hd=${format(date, 'yyyyMMdd')}&jcd=${jcd}`;
        }
        case RaceType.OVERSEAS: {
            return `https://world.jra-van.jp/schedule/?year=${date.getFullYear()}&month=${formatMonthDigits(date, 2)}`;
        }
    }
};
