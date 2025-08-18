export const getGoogleCalendarColorId = (
    raceType: RaceType,
    gradeType: GradeType,
): GoogleCalendarColorIdType => {
    return (
        GoogleCalendarColorIdMap[raceType][gradeType] ??
        GoogleCalendarColorId.GRAPHITE
    );
};
import { format } from 'date-fns';
import type { calendar_v3 } from 'googleapis';

import { CalendarData } from '../domain/calendarData';
import { HorseRacingRaceEntity } from '../repository/entity/horseRacingRaceEntity';
import { JraRaceEntity } from '../repository/entity/jraRaceEntity';
import { MechanicalRacingRaceEntity } from '../repository/entity/mechanicalRacingRaceEntity';
import type { GradeType } from './data/common/gradeType';
import { createPlaceCodeMap } from './data/common/raceCourse';
import {
    ChihoKeibaYoutubeUserIdMap,
    getYoutubeLiveUrl,
    KeirinYoutubeUserIdMap,
} from './data/movie';
import { NetkeibaBabacodeMap } from './data/netkeiba';
import {
    createNetkeibaJraRaceVideoUrl,
    createNetkeibaJraShutubaUrl,
} from './data/url';
import { getJSTDate } from './date';
import { createAnchorTag, formatDate } from './format';
import { RaceType } from './raceType';




const GoogleCalendarColorId = {
    LAVENDER: '1', 
    SAGE: '2', 
    GRAPE: '3', 
    FLAMINGO: '4', 
    BANANA: '5', 
    TANGERINE: '6', 
    PEACOCK: '7', 
    GRAPHITE: '8', 
    BLUEBERRY: '9', 
    BASIL: '10', 
    TOMATO: '11', 
} as const;


type GoogleCalendarColorIdType =
    (typeof GoogleCalendarColorId)[keyof typeof GoogleCalendarColorId];





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

export function toGoogleCalendarData(
    raceEntity:
        | JraRaceEntity
        | HorseRacingRaceEntity
        | MechanicalRacingRaceEntity,

    updateDate: Date = new Date(),
): calendar_v3.Schema$Event {
    function createSummary(): string {
        return `${createStage()} ${raceEntity.raceData.name}`;
    }

    function createLocation(): string {
        if (raceEntity instanceof JraRaceEntity) {
            return `${raceEntity.raceData.location}競馬場`;
        }
        if (raceEntity instanceof HorseRacingRaceEntity) {
            return `${raceEntity.raceData.location}競馬場`;
        }
        if (raceEntity instanceof HorseRacingRaceEntity) {
            return `${raceEntity.raceData.location}競馬場`;
        }
        if (raceEntity instanceof MechanicalRacingRaceEntity) {
            if (raceEntity.raceData.raceType === RaceType.KEIRIN) {
                return `${raceEntity.raceData.location}競輪場`;
            }
            if (raceEntity.raceData.raceType === RaceType.AUTORACE) {
                return `${raceEntity.raceData.location}オートレース場`;
            }
            if (raceEntity.raceData.raceType === RaceType.BOATRACE) {
                return `${raceEntity.raceData.location}ボートレース場`;
            }
        }
        throw new Error(`Unknown race type`);
    }

    function createStage(): string {
        if (raceEntity instanceof JraRaceEntity) {
            return '';
        }
        if (raceEntity instanceof HorseRacingRaceEntity) {
            return '';
        }
        if (raceEntity instanceof HorseRacingRaceEntity) {
            return '';
        }
        if (raceEntity instanceof MechanicalRacingRaceEntity) {
            return raceEntity.stage;
        }
        throw new Error(`Unknown race type`);
    }

    
    function createDescription(): string {
        const raceTimeStr = `発走: ${raceEntity.raceData.dateTime.getXDigitHours(2)}:${raceEntity.raceData.dateTime.getXDigitMinutes(2)}`;
        const updateStr = `更新日時: ${format(getJSTDate(updateDate), 'yyyy/MM/dd HH:mm:ss')}`;
        if (
            raceEntity instanceof MechanicalRacingRaceEntity &&
            (raceEntity.raceData.raceType === RaceType.AUTORACE ||
                raceEntity.raceData.raceType === RaceType.BOATRACE)
        ) {
            return `${raceTimeStr}
                    ${updateStr}
                    `.replace(/\n\s+/g, '\n');
        }
        if (
            raceEntity instanceof MechanicalRacingRaceEntity &&
            raceEntity.raceData.raceType === RaceType.KEIRIN
        ) {
            return `${raceTimeStr}
                    ${createAnchorTag(
                        'レース情報（netkeirin）',
                        `https://netkeirin.page.link/?link=https%3A%2F%2Fkeirin.netkeiba.com%2Frace%2Fentry%2F%3Frace_id%3D${format(raceEntity.raceData.dateTime, 'yyyyMMdd')}${
                            createPlaceCodeMap(RaceType.KEIRIN)[
                                raceEntity.raceData.location
                            ]
                        }${raceEntity.raceData.number.toXDigits(2)}`,
                    )}
                    ${createAnchorTag('レース映像（YouTube）', getYoutubeLiveUrl(KeirinYoutubeUserIdMap[raceEntity.raceData.location]))}
                    ${updateStr}
                    `.replace(/\n\s+/g, '\n');
        }
        if (raceEntity instanceof JraRaceEntity) {
            const raceIdForNetkeiba = `${raceEntity.raceData.dateTime.getFullYear().toString()}${NetkeibaBabacodeMap[raceEntity.raceData.location]}${raceEntity.heldDayData.heldTimes.toXDigits(2)}${raceEntity.heldDayData.heldDayTimes.toXDigits(2)}${raceEntity.raceData.number.toXDigits(2)}`;
            return `距離: ${raceEntity.conditionData.surfaceType}${raceEntity.conditionData.distance.toString()}m
                    ${raceTimeStr}
                    ${createAnchorTag(
                        'レース情報',
                        `https://netkeiba.page.link/?link=${encodeURIComponent(
                            createNetkeibaJraShutubaUrl(raceIdForNetkeiba),
                        )}`,
                    )}
                    ${createAnchorTag(
                        'レース動画',
                        `https://netkeiba.page.link/?link=${encodeURIComponent(
                            createNetkeibaJraRaceVideoUrl(raceIdForNetkeiba),
                        )}`,
                    )}
                    ${updateStr}
                    `.replace(/\n\s+/g, '\n');
        }
        if (raceEntity instanceof HorseRacingRaceEntity) {
            return `距離: ${raceEntity.conditionData.surfaceType}${raceEntity.conditionData.distance.toString()}m
                    ${raceTimeStr}
                    ${createAnchorTag('レース映像（YouTube）', getYoutubeLiveUrl(ChihoKeibaYoutubeUserIdMap[raceEntity.raceData.location]))}
                    ${createAnchorTag('レース情報（netkeiba）', `https://netkeiba.page.link/?link=https%3A%2F%2Fnar.sp.netkeiba.com%2Frace%2Fshutuba.html%3Frace_id%3D${raceEntity.raceData.dateTime.getFullYear().toString()}${NetkeibaBabacodeMap[raceEntity.raceData.location]}${(raceEntity.raceData.dateTime.getMonth() + 1).toXDigits(2)}${raceEntity.raceData.dateTime.getDate().toXDigits(2)}${raceEntity.raceData.number.toXDigits(2)}`)}
                    ${updateStr}
                    `.replace(/\n\s+/g, '\n');
        }
        if (raceEntity instanceof HorseRacingRaceEntity) {
            return `距離: ${raceEntity.conditionData.surfaceType}${raceEntity.conditionData.distance.toString()}m
                    ${raceTimeStr}
                    ${updateStr}
                    `.replace(/\n\s+/g, '\n');
        }
        return '';
    }

    return {
        id: raceEntity.id,
        summary: createSummary(),
        location: createLocation(),
        start: {
            dateTime: formatDate(raceEntity.raceData.dateTime),
            timeZone: 'Asia/Tokyo',
        },
        end: {
            
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
}

export function fromGoogleCalendarDataToCalendarData(
    raceType: RaceType,
    event: calendar_v3.Schema$Event,
): CalendarData {
    return CalendarData.create(
        event.id,
        raceType,
        event.summary,
        event.start?.dateTime,
        event.end?.dateTime,
        event.location,
        event.description,
    );
}
