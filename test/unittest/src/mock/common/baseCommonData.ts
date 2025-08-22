import { CalendarData } from '../../../../../lib/src/domain/calendarData';
import { HeldDayData } from '../../../../../lib/src/domain/heldDayData';
import { HorseRaceConditionData } from '../../../../../lib/src/domain/houseRaceConditionData';
import { PlaceData } from '../../../../../lib/src/domain/placeData';
import { RaceData } from '../../../../../lib/src/domain/raceData';
import { RacePlayerData } from '../../../../../lib/src/domain/racePlayerData';
import { PlaceRecord } from '../../../../../lib/src/gateway/record/placeRecord';
import { PlaceEntity } from '../../../../../lib/src/repository/entity/placeEntity';
import { RaceEntity } from '../../../../../lib/src/repository/entity/raceEntity';
import { generatePlaceId } from '../../../../../lib/src/utility/data/common/placeId';
import { createMaxFrameNumber } from '../../../../../lib/src/utility/data/common/positionNumber';
import { getJSTDate } from '../../../../../lib/src/utility/date';
import {
    RACE_TYPE_LIST_ALL,
    RACE_TYPE_LIST_WITHOUT_OVERSEAS,
    RaceType,
} from '../../../../../lib/src/utility/raceType';

/**
 * 基本的なレースプレイヤーデータのリストを生成します。
 * @param raceType - レース種別
 */
export const baseRacePlayerDataList = (
    raceType: RaceType,
): RacePlayerData[] | undefined => {
    // Only mechanical races have race players; return undefined for others.
    if (
        raceType !== RaceType.KEIRIN &&
        raceType !== RaceType.AUTORACE &&
        raceType !== RaceType.BOATRACE
    ) {
        return undefined;
    }

    return Array.from({ length: createMaxFrameNumber(raceType) }, (_, i) =>
        RacePlayerData.create(raceType, i + 1, i + 1),
    );
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
    // Only horse races have surface/distance information. Return undefined for others.
    if (
        defaultRaceSurfaceType[raceType] == undefined ||
        defaultRaceDistance[raceType] == undefined
    ) {
        return undefined;
    }

    return HorseRaceConditionData.create(
        defaultRaceSurfaceType[raceType],
        defaultRaceDistance[raceType],
    );
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

export const baseRaceEntityList = (raceType: RaceType): RaceEntity[] => {
    switch (raceType) {
        case RaceType.JRA:
        case RaceType.NAR:
        case RaceType.OVERSEAS: {
            return baseHorseRacingRaceEntityList(raceType);
        }
        case RaceType.KEIRIN:
        case RaceType.AUTORACE:
        case RaceType.BOATRACE: {
            return baseMechanicalRacingRaceEntityList(raceType);
        }
    }
};

const baseMechanicalRacingRaceEntityList = (
    _raceType: RaceType,
): RaceEntity[] =>
    [
        { raceType: RaceType.KEIRIN, location: '平塚', grade: 'GP' },
        { raceType: RaceType.KEIRIN, location: '立川', grade: 'GⅠ' },
        { raceType: RaceType.KEIRIN, location: '函館', grade: 'GⅡ' },
        { raceType: RaceType.KEIRIN, location: '小倉', grade: 'GⅢ' },
        { raceType: RaceType.KEIRIN, location: '久留米', grade: 'FⅠ' },
        { raceType: RaceType.KEIRIN, location: '名古屋', grade: 'FⅡ' },
        { raceType: RaceType.AUTORACE, location: '飯塚', grade: 'SG' },
        { raceType: RaceType.AUTORACE, location: '川口', grade: 'GⅠ' },
        { raceType: RaceType.AUTORACE, location: '山陽', grade: '特GⅠ' },
        { raceType: RaceType.AUTORACE, location: '伊勢崎', grade: 'GⅡ' },
        { raceType: RaceType.AUTORACE, location: '浜松', grade: '開催' },
        { raceType: RaceType.BOATRACE, location: '平和島', grade: 'SG' },
        { raceType: RaceType.BOATRACE, location: '戸田', grade: 'GⅠ' },
        { raceType: RaceType.BOATRACE, location: '江戸川', grade: 'GⅡ' },
        { raceType: RaceType.BOATRACE, location: '桐生', grade: 'GⅢ' },
        { raceType: RaceType.BOATRACE, location: '多摩川', grade: '一般' },
    ]
        .flatMap((value) => {
            const { raceType, location, grade } = value;
            return defaultStageList[raceType].map((stage, index) => {
                if (raceType !== _raceType) return 'undefined';
                const raceData = RaceData.create(
                    raceType,
                    `テスト${location}${grade}${stage}${(index + 1).toString()}レース`,
                    new Date(2025, 12 - 1, 30, 7 + index, 0),
                    location,
                    grade,
                    index + 1,
                );
                return RaceEntity.createWithoutId(
                    raceData,
                    defaultHeldDayData[raceType],
                    baseConditionData(raceType),
                    stage,
                    baseRacePlayerDataList(raceType),
                    baseRaceUpdateDate,
                );
            });
        })
        .filter((entity) => entity !== 'undefined');

const baseHorseRacingRaceEntityList = (_raceType: RaceType): RaceEntity[] =>
    [
        {
            raceType: RaceType.JRA,
            location: '東京',
            gradeList: [
                '新馬',
                '未勝利',
                '未勝利',
                '1勝クラス',
                '2勝クラス',
                '3勝クラス',
                'オープン特別',
                'Listed',
                'GⅢ',
                'GⅡ',
                'GⅠ',
                '2勝クラス',
            ],
        },
        {
            raceType: RaceType.JRA,
            location: '京都',
            gradeList: [
                '新馬',
                '未勝利',
                '未勝利',
                '1勝クラス',
                '2勝クラス',
                '3勝クラス',
                'オープン特別',
                'Listed',
                'GⅢ',
                'GⅡ',
                'GⅠ',
                '2勝クラス',
            ],
        },
        {
            raceType: RaceType.NAR,
            location: '大井',
            gradeList: [
                '一般',
                '一般',
                '一般',
                'オープン特別',
                'Listed',
                'JpnⅢ',
                'JpnⅡ',
                'JpnⅠ',
                'GⅢ',
                'GⅡ',
                'GⅠ',
                '地方重賞',
            ],
        },
        {
            raceType: RaceType.NAR,
            location: '高知',
            gradeList: [
                '一般',
                '一般',
                '一般',
                'オープン特別',
                'Listed',
                'JpnⅢ',
                'JpnⅡ',
                'JpnⅠ',
                'GⅢ',
                'GⅡ',
                'GⅠ',
                '地方重賞',
            ],
        },
        {
            raceType: RaceType.OVERSEAS,
            location: 'パリロンシャン',
            gradeList: [
                '格付けなし',
                '格付けなし',
                '格付けなし',
                '格付けなし',
                '格付けなし',
                '格付けなし',
                '格付けなし',
                'Listed',
                'GⅢ',
                'GⅡ',
                'GⅠ',
                '格付けなし',
            ],
        },
        {
            raceType: RaceType.OVERSEAS,
            location: 'ロンシャン',
            gradeList: [
                '格付けなし',
                '格付けなし',
                '格付けなし',
                '格付けなし',
                '格付けなし',
                '格付けなし',
                '格付けなし',
                'Listed',
                'GⅢ',
                'GⅡ',
                'GⅠ',
                '格付けなし',
            ],
        },
    ]
        .flatMap(({ raceType, location, gradeList }) => {
            return gradeList.map((grade, index) => {
                if (raceType !== _raceType) return 'undefined';
                return RaceEntity.createWithoutId(
                    RaceData.create(
                        raceType,
                        `テスト${location}${grade}${(index + 1).toString()}レース`,
                        new Date(2024, 6 - 1, 1, 7 + index, 0),
                        location,
                        grade,
                        index + 1,
                    ),
                    defaultHeldDayData[raceType],
                    baseConditionData(raceType),
                    undefined, // stage は未指定
                    baseRacePlayerDataList(raceType),
                    baseRaceUpdateDate,
                );
            });
        })
        .filter((entity): entity is RaceEntity => entity !== 'undefined');

const createLocationString = (raceType: RaceType, location: string): string => {
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
const baseRaceNumber = 12;

const baseRaceUpdateDate = getJSTDate(new Date('2025-10-01 16:30'));

const basePlaceDateTime = new Date('2024-12-29');
const baseRaceDateTime = new Date('2024-12-29 16:30');

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
    [RaceType.JRA]: HeldDayData.create(1, 1),
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

const defaultStageList = {
    [RaceType.KEIRIN]: [
        'S級一般',
        'S級一般',
        'S級一般',
        'S級一般',
        'S級一般',
        'S級一般',
        'S級一般',
        'S級一般',
        'S級一般',
        'S級一般',
        'S級特別優秀',
        'S級決勝',
    ],
    [RaceType.AUTORACE]: [
        '一般戦',
        '一般戦',
        '一般戦',
        '一般戦',
        '一般戦',
        '一般戦',
        '一般戦',
        '一般戦',
        '一般戦',
        '一般戦',
        '一般戦',
        '優勝戦',
    ],
    [RaceType.BOATRACE]: [
        '一般戦',
        '一般戦',
        '一般戦',
        '一般戦',
        '一般戦',
        '一般戦',
        '一般戦',
        '一般戦',
        '一般戦',
        '一般戦',
        '一般戦',
        '優勝戦',
    ],
};

export const mockCalendarDataList = RACE_TYPE_LIST_ALL.map((raceType) =>
    baseCalendarData(raceType),
);

export const mockRaceEntityList = RACE_TYPE_LIST_ALL.flatMap((raceType) =>
    baseRaceEntityList(raceType),
);

export const mockPlaceEntityList = RACE_TYPE_LIST_WITHOUT_OVERSEAS.map(
    (raceType) => basePlaceEntity(raceType),
);
