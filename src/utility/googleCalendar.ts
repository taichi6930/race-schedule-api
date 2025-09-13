import { format } from 'date-fns';
import type { calendar_v3 } from 'googleapis';

import {
    createYoutubeLiveUrl,
    KeirinYoutubeUserIdMap,
    NarYoutubeUserIdMap,
} from '../../lib/src/utility/data/movie';
import { NetkeibaBabacodeMap } from '../../lib/src/utility/data/netkeiba';
import {
    createNetkeibaNarShutubaUrl,
    createNetkeibaRedirectUrl,
    createNetkeirinRaceShutubaUrl,
    createNetkeirinRedirectUrl,
} from '../../lib/src/utility/data/url';
import { getJSTDate } from '../../lib/src/utility/date';
import { createAnchorTag, formatDate } from '../../lib/src/utility/format';
import type { GradeType } from '../../lib/src/utility/validateAndType/gradeType';
import { CalendarData } from '../domain/calendarData';
import type { RaceEntity } from '../repository/entity/raceEntity';
import { RaceType } from './raceType';
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
 * Googleカレンダーで使用可能な色IDの定義
 *
 * 各色はカレンダーイベントの視認性と重要度を表現するために
 * 慎重に選択されています：
 *
 * 基本的な色使いの方針：
 * - 高グレード（GI/GP等）: 濃い青系（視認性重視）
 * - 中グレード（GⅡ等）: 赤系（重要イベント）
 * - 低グレード：緑系や灰色（通常イベント）
 */
const GoogleCalendarColorId = {
    LAVENDER: '1', // #7986CB
    SAGE: '2', // #33B679
    GRAPE: '3', // #8E24AA
    FLAMINGO: '4', // #E67C73
    BANANA: '5', // #F6BF26
    TANGERINE: '6', // #F4511E
    PEACOCK: '7', // #039BE5
    GRAPHITE: '8', // #616161
    BLUEBERRY: '9', // #3F51B5
    BASIL: '10', // #0B8043
    TOMATO: '11', // #D50000
} as const;

/**
 * Google Calendar APIの色IDの型
 */
type GoogleCalendarColorIdType =
    (typeof GoogleCalendarColorId)[keyof typeof GoogleCalendarColorId];

/**
 * 中央競馬（JRA）のグレードごとの色設定
 *
 * 中央競馬の特徴的なグレード体系に対応
 */

/**
 * 各競技ごとのグレード→色IDマップをRaceTypeでまとめる
 */
// ...existing code...
const GoogleCalendarColorIdMap = {
    JRA: {
        'GⅠ': GoogleCalendarColorId.BLUEBERRY,
        'GⅡ': GoogleCalendarColorId.TOMATO,
        'GⅢ': GoogleCalendarColorId.BASIL,
        'J.GⅠ': GoogleCalendarColorId.BLUEBERRY,
        'J.GⅡ': GoogleCalendarColorId.TOMATO,
        'J.GⅢ': GoogleCalendarColorId.BASIL,
        'JpnⅠ': GoogleCalendarColorId.LAVENDER,
        'JpnⅡ': GoogleCalendarColorId.FLAMINGO,
        'JpnⅢ': GoogleCalendarColorId.SAGE,
        '重賞': GoogleCalendarColorId.BANANA,
        'Listed': GoogleCalendarColorId.BANANA,
        'オープン': GoogleCalendarColorId.TANGERINE,
        'オープン特別': GoogleCalendarColorId.TANGERINE,
    },
    NAR: {
        GⅠ: GoogleCalendarColorId.BLUEBERRY,
        GⅡ: GoogleCalendarColorId.TOMATO,
        GⅢ: GoogleCalendarColorId.BASIL,
        JpnⅠ: GoogleCalendarColorId.LAVENDER,
        JpnⅡ: GoogleCalendarColorId.FLAMINGO,
        JpnⅢ: GoogleCalendarColorId.SAGE,
        重賞: GoogleCalendarColorId.BANANA,
        Listed: GoogleCalendarColorId.BANANA,
        オープン: GoogleCalendarColorId.TANGERINE,
        オープン特別: GoogleCalendarColorId.TANGERINE,
        地方重賞: GoogleCalendarColorId.GRAPE,
    },
    OVERSEAS: {
        GⅠ: GoogleCalendarColorId.BLUEBERRY,
        GⅡ: GoogleCalendarColorId.TOMATO,
        GⅢ: GoogleCalendarColorId.BASIL,
        Listed: GoogleCalendarColorId.BANANA,
        格付けなし: GoogleCalendarColorId.GRAPHITE,
    },
    KEIRIN: {
        GP: GoogleCalendarColorId.BLUEBERRY,
        GⅠ: GoogleCalendarColorId.BLUEBERRY,
        GⅡ: GoogleCalendarColorId.TOMATO,
        GⅢ: GoogleCalendarColorId.BASIL,
        FⅠ: GoogleCalendarColorId.GRAPHITE,
        FⅡ: GoogleCalendarColorId.GRAPHITE,
    },
    BOATRACE: {
        SG: GoogleCalendarColorId.BLUEBERRY,
        GⅠ: GoogleCalendarColorId.BLUEBERRY,
        GⅡ: GoogleCalendarColorId.TOMATO,
        GⅢ: GoogleCalendarColorId.BASIL,
        一般: GoogleCalendarColorId.GRAPHITE,
    },
    AUTORACE: {
        SG: GoogleCalendarColorId.BLUEBERRY,
        特GⅠ: GoogleCalendarColorId.BLUEBERRY,
        GⅠ: GoogleCalendarColorId.BLUEBERRY,
        GⅡ: GoogleCalendarColorId.TOMATO,
        開催: GoogleCalendarColorId.GRAPHITE,
    },
} as Record<RaceType, Record<GradeType, GoogleCalendarColorIdType>>;

export const getGoogleCalendarColorId = (
    raceType: RaceType,
    gradeType: GradeType,
): GoogleCalendarColorIdType => {
    return (
        GoogleCalendarColorIdMap[raceType][gradeType] ??
        GoogleCalendarColorId.GRAPHITE
    );
};

export const toGoogleCalendarData = (
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
                throw new Error('Not implemented');
                // return raceEntity.stage;
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
                throw new Error('Not implemented');
                // const raceIdForNetkeiba = `${raceEntity.raceData.dateTime.getFullYear().toString()}${NetkeibaBabacodeMap[raceEntity.raceData.location]}${raceEntity.heldDayData.heldTimes.toXDigits(2)}${raceEntity.heldDayData.heldDayTimes.toXDigits(2)}${raceEntity.raceData.number.toXDigits(2)}`;
                // return `距離: ${raceEntity.conditionData.surfaceType}${raceEntity.conditionData.distance.toString()}m
                // ${raceTimeStr}
                // ${createAnchorTag(
                //     'レース情報',
                //     createNetkeibaRedirectUrl(
                //         createNetkeibaJraShutubaUrl(raceIdForNetkeiba),
                //     ),
                // )}
                // ${createAnchorTag(
                //     'レース動画',
                //     createNetkeibaRedirectUrl(
                //         createNetkeibaJraRaceVideoUrl(raceIdForNetkeiba),
                //     ),
                // )}
                // ${updateStr}
                // `.replace(/\n\s+/g, '\n');
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

export const fromGoogleCalendarDataToCalendarData = (
    raceType: RaceType,
    event: calendar_v3.Schema$Event,
): CalendarData =>
    CalendarData.create(
        event.id,
        raceType,
        event.summary,
        event.start?.dateTime,
        event.end?.dateTime,
        event.location,
        event.description,
    );
