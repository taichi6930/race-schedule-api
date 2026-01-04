import { RaceType } from '../../../../../packages/shared/src/types/raceType';
import { CalendarData } from '../../../../../src/domain/calendarData';
import { HeldDayData } from '../../../../../src/domain/heldDayData';
import { HorseRaceConditionData } from '../../../../../src/domain/houseRaceConditionData';
import { PlaceData } from '../../../../../src/domain/placeData';
import { RaceData } from '../../../../../src/domain/raceData';
import { RacePlayerData } from '../../../../../src/domain/racePlayerData';
import { PlaceEntity } from '../../../../../src/repository/entity/placeEntity';
import { PlayerEntity } from '../../../../../src/repository/entity/playerEntity';
import { RaceEntity } from '../../../../../src/repository/entity/raceEntity';
import { IS_SHORT_TEST } from '../../../../../src/utility/env';
import {
    isIncludedRaceType,
    RACE_TYPE_LIST_ALL,
    RACE_TYPE_LIST_HORSE_RACING,
    RACE_TYPE_LIST_MECHANICAL_RACING,
} from '../../../../../src/utility/raceType';
import { maxFrameNumber } from '../../../../../src/utility/validateAndType/positionNumber';

/**
 * 基本的なレースプレイヤーデータのリストを生成します。
 * @param raceType - レース種別
 */
export const baseRacePlayerDataList = (
    raceType: RaceType,
): RacePlayerData[] | undefined => {
    // Only mechanical races have race players; return undefined for others.
    if (!isIncludedRaceType(raceType, RACE_TYPE_LIST_MECHANICAL_RACING)) {
        return undefined;
    }

    return Array.from({ length: maxFrameNumber[raceType] }, (_, i) =>
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
    );

export const basePlayerEntity = (raceType: RaceType): PlayerEntity =>
    PlayerEntity.create(raceType, '1', 'テスト選手名', 1);

export const baseRaceData = (raceType: RaceType): RaceData =>
    RaceData.create(
        raceType,
        defaultRaceName[raceType],
        baseRaceDateTime,
        defaultLocation[raceType],
        defaultRaceGrade[raceType],
        baseRaceNumber,
    );

const baseConditionData = (
    raceType: RaceType,
): HorseRaceConditionData | undefined => {
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
                    [],
                    // baseRacePlayerDataList(raceType),
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

const defaultStage = {
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

const defaultRaceGrade = {
    [RaceType.JRA]: 'GⅠ',
    [RaceType.NAR]: 'GⅠ',
    [RaceType.OVERSEAS]: 'GⅠ',
    [RaceType.KEIRIN]: 'GP',
    [RaceType.AUTORACE]: 'SG',
    [RaceType.BOATRACE]: 'SG',
};

const defaultRaceName = {
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

/**
 * テスト用のレースタイプ一覧を取得します。
 * IS_SHORT_TEST が true の場合は JRA のみを返し、false の場合は全レースタイプを返します。
 * TODO: 出来ればこの関数をリファクタリングして、いろんなRaceTypeに対応できるようにしたいです。
 */
export const testRaceTypeListAll = IS_SHORT_TEST
    ? [RaceType.JRA]
    : RACE_TYPE_LIST_ALL;

export const testRaceTypeListHorseRacing = IS_SHORT_TEST
    ? [RaceType.JRA]
    : RACE_TYPE_LIST_HORSE_RACING;

export const testRaceTypeListMechanicalRacing = IS_SHORT_TEST
    ? [RaceType.KEIRIN]
    : RACE_TYPE_LIST_MECHANICAL_RACING;

export const mockCalendarDataList = testRaceTypeListAll.map((raceType) =>
    baseCalendarData(raceType),
);

export const mockRaceEntityList = testRaceTypeListAll.flatMap((raceType) =>
    baseRaceEntityList(raceType),
);

export const mockPlaceEntityList = testRaceTypeListAll.map((raceType) =>
    basePlaceEntity(raceType),
);

export const mockPlayerEntityList = testRaceTypeListMechanicalRacing.map(
    (raceType) => basePlayerEntity(raceType),
);
