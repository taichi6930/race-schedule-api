import { format } from 'date-fns';
import type { calendar_v3 } from 'googleapis';

import type { RaceEntity } from '../../../src/repository/entity/raceEntity';
import { getGoogleCalendarColorId } from '../../../src/utility/googleCalendar';
import { RaceType } from '../../../src/utility/raceType';
import {
    createYoutubeLiveUrl,
    KeirinYoutubeUserIdMap,
    NarYoutubeUserIdMap,
} from './data/movie';
import { NetkeibaBabacodeMap } from './data/netkeiba';
import {
    createNetkeibaJraRaceVideoUrl,
    createNetkeibaJraShutubaUrl,
    createNetkeibaNarShutubaUrl,
    createNetkeibaRedirectUrl,
    createNetkeirinRaceShutubaUrl,
    createNetkeirinRedirectUrl,
} from './data/url';
import { getJSTDate } from './date';
import { createAnchorTag, formatDate } from './format';
import { createPlaceCode } from './validateAndType/raceCourse';

/**
 * Googleカレンダーのイベント表示をカスタマイズするためのユーティリティモジュール
 *
 * このモジュールは、各種レース競技のイベントを視覚的に区別するための
 * 色分け機能を提供します。主な機能：
 * - レースのグレードに応じた色の割り当て
 * - 競技種目ごとの一貫した色使い
 * - 重要度に基づく視認性の調整
 */

/**
 * 中央競馬（JRA）のグレードごとの色設定
 *
 * 中央競馬の特徴的なグレード体系に対応
 */

export const toGoogleCalendarDataForAWS = (
    raceEntity: RaceEntity,

    updateDate: Date = new Date(),
): calendar_v3.Schema$Event => {
    const createSummary = (): string =>
        `${createStage()} ${raceEntity.raceData.name}`;

    const createLocation = (): string => {
        switch (raceEntity.raceData.raceType) {
            case RaceType.JRA:
            case RaceType.NAR:
            case RaceType.OVERSEAS: {
                return `${raceEntity.raceData.location}競馬場`;
            }
            case RaceType.KEIRIN: {
                return `${raceEntity.raceData.location}競輪場`;
            }
            case RaceType.AUTORACE: {
                return `${raceEntity.raceData.location}オートレース場`;
            }
            case RaceType.BOATRACE: {
                return `${raceEntity.raceData.location}ボートレース場`;
            }
        }
    };

    const createStage = (): string => {
        switch (raceEntity.raceData.raceType) {
            case RaceType.JRA:
            case RaceType.NAR:
            case RaceType.OVERSEAS: {
                return ``;
            }
            case RaceType.KEIRIN:
            case RaceType.AUTORACE:
            case RaceType.BOATRACE: {
                return raceEntity.stage;
            }
        }
    };

    /**
     * レースデータをGoogleカレンダーのイベントに変換する
     * @param raceEntity
     * @param updateDate - 更新日時
     */
    const createDescription = (): string => {
        const raceTimeStr = `発走: ${raceEntity.raceData.dateTime.getXDigitHours(2)}:${raceEntity.raceData.dateTime.getXDigitMinutes(2)}`;
        const updateStr = `更新日時: ${format(getJSTDate(updateDate), 'yyyy/MM/dd HH:mm:ss')}`;
        switch (raceEntity.raceData.raceType) {
            case RaceType.AUTORACE:
            case RaceType.BOATRACE: {
                {
                    return `${raceTimeStr}
                    ${updateStr}
                    `.replace(/\n\s+/g, '\n');
                }
            }
            case RaceType.KEIRIN: {
                const raceIdForNetkeirin = `${format(
                    raceEntity.raceData.dateTime,
                    'yyyyMMdd',
                )}${createPlaceCode(RaceType.KEIRIN, raceEntity.raceData.location)}
            ${raceEntity.raceData.number.toXDigits(2)}`;
                return `${raceTimeStr}
                    ${createAnchorTag(
                        'レース情報（netkeirin）',
                        createNetkeirinRedirectUrl(
                            createNetkeirinRaceShutubaUrl(raceIdForNetkeirin),
                        ),
                    )}
                    ${createAnchorTag('レース映像（YouTube）', createYoutubeLiveUrl(KeirinYoutubeUserIdMap[raceEntity.raceData.location]))}
                    ${updateStr}
                    `.replace(/\n\s+/g, '\n');
            }
            case RaceType.JRA: {
                const raceIdForNetkeiba = `${raceEntity.raceData.dateTime.getFullYear().toString()}${NetkeibaBabacodeMap[raceEntity.raceData.location]}${raceEntity.heldDayData.heldTimes.toXDigits(2)}${raceEntity.heldDayData.heldDayTimes.toXDigits(2)}${raceEntity.raceData.number.toXDigits(2)}`;
                return `距離: ${raceEntity.conditionData.surfaceType}${raceEntity.conditionData.distance.toString()}m
                ${raceTimeStr}
                ${createAnchorTag(
                    'レース情報',
                    createNetkeibaRedirectUrl(
                        createNetkeibaJraShutubaUrl(raceIdForNetkeiba),
                    ),
                )}
                ${createAnchorTag(
                    'レース動画',
                    createNetkeibaRedirectUrl(
                        createNetkeibaJraRaceVideoUrl(raceIdForNetkeiba),
                    ),
                )}
                ${updateStr}
                `.replace(/\n\s+/g, '\n');
            }
            case RaceType.NAR: {
                const raceIdForNetkeiba = `${raceEntity.raceData.dateTime.getFullYear().toString()}${NetkeibaBabacodeMap[raceEntity.raceData.location]}${raceEntity.raceData.dateTime.getXDigitMonth(2)}${raceEntity.raceData.dateTime.getDate().toXDigits(2)}${raceEntity.raceData.number.toXDigits(2)}`;
                return `距離: ${raceEntity.conditionData.surfaceType}${raceEntity.conditionData.distance.toString()}m
                ${raceTimeStr}
                ${createAnchorTag('レース映像（YouTube）', createYoutubeLiveUrl(NarYoutubeUserIdMap[raceEntity.raceData.location]))}
                ${createAnchorTag('レース情報（netkeiba）', createNetkeibaRedirectUrl(createNetkeibaNarShutubaUrl(raceIdForNetkeiba)))}
                ${updateStr}
                `.replace(/\n\s+/g, '\n');
            }
            case RaceType.OVERSEAS: {
                return `距離: ${raceEntity.conditionData.surfaceType}${raceEntity.conditionData.distance.toString()}m
                ${raceTimeStr}
                ${updateStr}
                `.replace(/\n\s+/g, '\n');
            }
        }
    };

    return {
        id: raceEntity.id,
        summary: createSummary(),
        location: createLocation(),
        start: {
            dateTime: formatDate(raceEntity.raceData.dateTime),
            timeZone: 'Asia/Tokyo',
        },
        end: {
            // 終了時刻は発走時刻から10分後とする
            dateTime: formatDate(
                new Date(
                    raceEntity.raceData.dateTime.getTime() + 10 * 60 * 1000,
                ),
            ),
            timeZone: 'Asia/Tokyo',
        },
        colorId: getGoogleCalendarColorId(
            raceEntity.raceData.raceType,
            raceEntity.raceData.grade,
        ),
        description: createDescription(),
        extendedProperties: {
            private: {
                raceId: raceEntity.id,
                name: raceEntity.raceData.name,
                stage: createStage(),
                dateTime: formatDate(raceEntity.raceData.dateTime),
                location: raceEntity.raceData.location,
                grade: raceEntity.raceData.grade,
                number: raceEntity.raceData.number.toString(),
                updateDate: formatDate(updateDate),
            },
        },
    };
};
