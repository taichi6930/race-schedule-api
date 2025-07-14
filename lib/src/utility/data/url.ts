/**
 * @module lib/src/utility/data/url
 * @fileoverview URL関連のユーティリティ関数を提供するモジュール
 */

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
