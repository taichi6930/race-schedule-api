import { CalendarData } from '../../../../../lib/src/domain/calendarData';
import { HeldDayData } from '../../../../../lib/src/domain/heldDayData';
import { HorseRaceConditionData } from '../../../../../lib/src/domain/houseRaceConditionData';
import { PlaceData } from '../../../../../lib/src/domain/placeData';
import { RaceData } from '../../../../../lib/src/domain/raceData';
import { RacePlayerData } from '../../../../../lib/src/domain/racePlayerData';
import { MechanicalRacingRaceRecord } from '../../../../../lib/src/gateway/record/mechanicalRacingRaceRecord';
import { PlaceRecord } from '../../../../../lib/src/gateway/record/placeRecord';
import { PlaceEntity } from '../../../../../lib/src/repository/entity/placeEntity';
import { RaceEntity } from '../../../../../lib/src/repository/entity/raceEntity';
import { generatePlaceId } from '../../../../../lib/src/utility/data/common/placeId';
import { createMaxFrameNumber } from '../../../../../lib/src/utility/data/common/positionNumber';
import { generateRaceId } from '../../../../../lib/src/utility/data/common/raceId';
import { getJSTDate } from '../../../../../lib/src/utility/date';
import { RaceType } from '../../../../../lib/src/utility/raceType';

/**
 * 基本的なレースプレイヤーデータのリストを生成します。
 * @param raceType - レース種別
 */
export const baseRacePlayerDataList = (
    raceType: RaceType,
): RacePlayerData[] | undefined => {
    try {
        if (
            raceType !== RaceType.KEIRIN &&
            raceType !== RaceType.AUTORACE &&
            raceType !== RaceType.BOATRACE
        ) {
            throw new Error('Invalid race type');
        }
        return Array.from(
            { length: createMaxFrameNumber(raceType) },
            (_, i) => {
                return RacePlayerData.create(raceType, i + 1, i + 1);
            },
        );
    } catch (error) {
        console.error('Error creating baseRacePlayerDataList:', error);
        return undefined;
    }
};

export const basePlaceData = (raceType: RaceType): PlaceData =>
    PlaceData.create(raceType, basePlaceDateTime, defaultLocation[raceType]);

export const basePlaceEntity = (raceType: RaceType): PlaceEntity =>
    PlaceEntity.createWithoutId(
        basePlaceData(raceType),
        defaultHeldDayData[raceType],
        defaultPlaceGrade[raceType],
        baseRaceUpdateDate,
    );

export const baseRaceData = (raceType: RaceType): RaceData =>
    RaceData.create(
        raceType,
        defaultRaceName[raceType],
        baseRaceDateTime,
        defaultLocation[raceType],
        defaultRaceGrade[raceType],
        baseRaceNumber,
    );

export const basePlaceRecord = (raceType: RaceType): PlaceRecord =>
    PlaceRecord.create(
        generatePlaceId(raceType, basePlaceDateTime, defaultLocation[raceType]),
        raceType,
        basePlaceDateTime,
        defaultLocation[raceType],
        baseRaceUpdateDate,
    );

export const baseConditionData = (
    raceType: RaceType,
): HorseRaceConditionData | undefined => {
    try {
        if (
            defaultRaceSurfaceType[raceType] == undefined ||
            defaultRaceDistance[raceType] == undefined
        ) {
            throw new Error('Invalid race type');
        }
        return HorseRaceConditionData.create(
            defaultRaceSurfaceType[raceType],
            defaultRaceDistance[raceType],
        );
    } catch (error) {
        console.error('Error creating baseConditionData:', error);
        return undefined;
    }
};

export const baseRaceEntity = (raceType: RaceType): RaceEntity =>
    RaceEntity.createWithoutId(
        baseRaceData(raceType),
        defaultHeldDayData[raceType],
        baseConditionData(raceType),
        defaultStage[raceType],
        baseRacePlayerDataList(raceType),
        baseRaceUpdateDate,
    );

export const baseMechanicalRacingRaceRecord = (
    raceType: RaceType,
): MechanicalRacingRaceRecord => {
    try {
        if (
            raceType !== RaceType.KEIRIN &&
            raceType !== RaceType.AUTORACE &&
            raceType !== RaceType.BOATRACE
        ) {
            throw new Error('Invalid race type');
        }
        return MechanicalRacingRaceRecord.create(
            generateRaceId(
                raceType,
                basePlaceDateTime,
                defaultLocation[raceType],
                baseRaceNumber,
            ),
            raceType,
            defaultRaceName[raceType],
            defaultStage[raceType],
            baseRaceDateTime,
            defaultLocation[raceType],
            defaultRaceGrade[raceType],
            baseRaceNumber,
            baseRaceUpdateDate,
        );
    } catch (error) {
        console.error('Error creating baseMechanicalRacingRaceRecord:', error);
        throw error;
    }
};

export const baseCalendarData = (raceType: RaceType): CalendarData =>
    CalendarData.create(
        'test202412220611',
        raceType,
        defaultRaceName[raceType],
        '2024-12-22T15:40:00Z',
        '2024-12-22T15:50:00Z',
        createLocationString(raceType, defaultLocation[raceType]),
        'テスト',
    );

export const baseCalendarDataFromGoogleCalendar = (
    raceType: RaceType,
): {
    id: string;
    summary: string;
    start: {
        dateTime: string;
    };
    end: {
        dateTime: string;
    };
    location: string;
    description: string;
} => {
    return {
        id: 'test202412220611',
        summary: defaultRaceName[raceType],
        start: {
            dateTime: '2024-12-22T15:40:00Z',
        },
        end: {
            dateTime: '2024-12-22T15:50:00Z',
        },
        location: createLocationString(raceType, defaultLocation[raceType]),
        description: 'テスト',
    };
};

export const createLocationString = (
    raceType: RaceType,
    location: string,
): string => {
    switch (raceType) {
        case RaceType.JRA:
        case RaceType.NAR:
        case RaceType.OVERSEAS: {
            return `${location}競馬場`;
        }
        case RaceType.KEIRIN: {
            return `${location}競輪場`;
        }
        case RaceType.AUTORACE: {
            return `${location}オートレース場`;
        }
        case RaceType.BOATRACE: {
            return `${location}ボートレース場`;
        }
    }
};

/**
 * 基本的なレース番号を定義します。
 */
export const baseRaceNumber = 12;

export const baseRaceUpdateDate = getJSTDate(new Date('2025-10-01 16:30'));

export const basePlaceDateTime = new Date('2024-12-29');
export const baseRaceDateTime = new Date('2024-12-29 16:30');

export const defaultLocation = {
    [RaceType.JRA]: '東京',
    [RaceType.NAR]: '大井',
    [RaceType.OVERSEAS]: 'パリロンシャン',
    [RaceType.KEIRIN]: '平塚',
    [RaceType.AUTORACE]: '川口',
    [RaceType.BOATRACE]: '浜名湖',
};

export const defaultStage = {
    [RaceType.JRA]: undefined,
    [RaceType.NAR]: undefined,
    [RaceType.OVERSEAS]: undefined,
    [RaceType.KEIRIN]: 'S級グランプリ',
    [RaceType.AUTORACE]: '優勝戦',
    [RaceType.BOATRACE]: '優勝戦',
};

export const defaultPlaceGrade = {
    [RaceType.JRA]: undefined,
    [RaceType.NAR]: undefined,
    [RaceType.OVERSEAS]: undefined,
    [RaceType.KEIRIN]: 'GP',
    [RaceType.AUTORACE]: 'SG',
    [RaceType.BOATRACE]: 'SG',
};

export const defaultRaceGrade = {
    [RaceType.JRA]: 'GⅠ',
    [RaceType.NAR]: 'GⅠ',
    [RaceType.OVERSEAS]: 'GⅠ',
    [RaceType.KEIRIN]: 'GP',
    [RaceType.AUTORACE]: 'SG',
    [RaceType.BOATRACE]: 'SG',
};

export const defaultRaceName = {
    [RaceType.JRA]: '有馬記念',
    [RaceType.NAR]: '東京大賞典',
    [RaceType.OVERSEAS]: '凱旋門賞',
    [RaceType.KEIRIN]: 'KEIRINグランプリ',
    [RaceType.AUTORACE]: 'スーパースター王座決定戦',
    [RaceType.BOATRACE]: 'グランプリ',
};

export const defaultHeldDayData = {
    [RaceType.JRA]: HeldDayData.create(5, 8),
    [RaceType.NAR]: undefined,
    [RaceType.OVERSEAS]: undefined,
    [RaceType.KEIRIN]: undefined,
    [RaceType.AUTORACE]: undefined,
    [RaceType.BOATRACE]: undefined,
};

export const defaultRaceSurfaceType = {
    [RaceType.JRA]: '芝',
    [RaceType.NAR]: 'ダート',
    [RaceType.OVERSEAS]: '芝',
    [RaceType.KEIRIN]: undefined,
    [RaceType.AUTORACE]: undefined,
    [RaceType.BOATRACE]: undefined,
};

export const defaultRaceDistance = {
    [RaceType.JRA]: 2500,
    [RaceType.NAR]: 2000,
    [RaceType.OVERSEAS]: 2400,
    [RaceType.KEIRIN]: undefined,
    [RaceType.AUTORACE]: undefined,
    [RaceType.BOATRACE]: undefined,
};
