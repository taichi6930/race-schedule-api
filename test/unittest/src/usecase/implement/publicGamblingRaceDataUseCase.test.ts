import 'reflect-metadata';

import { container } from 'tsyringe';

import type { IPlaceDataService } from '../../../../../lib/src/service/interface/IPlaceDataService';
import type { IRaceDataService } from '../../../../../lib/src/service/interface/IRaceDataService';
import { PublicGamblingRaceDataUseCase } from '../../../../../lib/src/usecase/implement/publicGamblingRaceDataUseCase';
import type { IRaceDataUseCase } from '../../../../../lib/src/usecase/interface/IRaceDataUseCase';
import {
    ALL_RACE_TYPE_LIST,
    RaceType,
} from '../../../../../lib/src/utility/raceType';
import {
    clearMocks,
    setupTestMock,
    type TestSetup,
} from '../../../../utility/testSetupHelper';
import {
    baseAutoracePlaceEntity,
    baseAutoraceRaceEntityList,
} from '../../mock/common/baseAutoraceData';
import {
    baseBoatracePlaceEntity,
    baseBoatraceRaceEntityList,
} from '../../mock/common/baseBoatraceData';
import {
    baseJraPlaceEntity,
    baseJraRaceEntityList,
} from '../../mock/common/baseJraData';
import {
    baseKeirinPlaceEntity,
    baseKeirinRaceEntityList,
} from '../../mock/common/baseKeirinData';
import {
    baseNarPlaceEntity,
    baseNarRaceEntityList,
} from '../../mock/common/baseNarData';
import { baseOverseasRaceEntityList } from '../../mock/common/baseOverseasData';

describe('PublicGamblingRaceDataUseCase', () => {
    let raceDataService: jest.Mocked<IRaceDataService>;
    let placeDataService: jest.Mocked<IPlaceDataService>;
    let useCase: IRaceDataUseCase;

    beforeEach(() => {
        const setup: TestSetup = setupTestMock();
        ({ raceDataService, placeDataService } = setup);
        useCase = container.resolve(PublicGamblingRaceDataUseCase);
        jest.spyOn(console, 'log').mockImplementation();
    });

    afterEach(() => {
        clearMocks();
        jest.restoreAllMocks();
    });

    describe('fetchRaceEntityList', () => {
        for (const {
            raceTypeList,
            searchConditions,
            descriptions,
            expectedLength,
            returnedRaceList,
        } of [
            {
                raceTypeList: [RaceType.NAR],
                searchConditions: { [RaceType.NAR]: { gradeList: ['GⅠ'] } },
                descriptions: 'gradeを検索条件に入れて',
                expectedLength: 2,
                returnedRaceList: baseNarRaceEntityList,
            },
            {
                raceTypeList: [RaceType.NAR],
                searchConditions: {
                    [RaceType.NAR]: {
                        locationList: ['大井'],
                    },
                },
                descriptions: 'locationを検索条件に入れて',
                expectedLength: 12,
                returnedRaceList: baseNarRaceEntityList,
            },
            {
                raceTypeList: [RaceType.NAR],
                searchConditions: {
                    [RaceType.NAR]: {
                        gradeList: ['GⅠ'],
                        locationList: ['大井'],
                    },
                },
                descriptions: 'gradeとlocationを検索条件に入れて',
                expectedLength: 1,
                returnedRaceList: baseNarRaceEntityList,
            },
            {
                raceTypeList: [RaceType.NAR],
                searchConditions: {
                    [RaceType.NAR]: {
                        gradeList: ['GⅠ'],
                        locationList: ['佐賀'],
                    },
                },
                descriptions: 'gradeとlocationを検索条件に入れて',
                expectedLength: 0,
                returnedRaceList: baseNarRaceEntityList,
            },
            {
                raceTypeList: [RaceType.NAR],
                searchConditions: {},
                descriptions: '検索条件なし',
                expectedLength: 24,
                returnedRaceList: baseNarRaceEntityList,
            },
            {
                raceTypeList: [RaceType.OVERSEAS],
                searchConditions: {
                    [RaceType.OVERSEAS]: { gradeList: ['GⅠ'] },
                },
                descriptions: 'gradeを検索条件に入れて',
                expectedLength: 2,
                returnedRaceList: baseOverseasRaceEntityList,
            },
            {
                raceTypeList: [RaceType.OVERSEAS],
                searchConditions: {
                    [RaceType.OVERSEAS]: {
                        locationList: ['パリロンシャン'],
                    },
                },
                descriptions: 'locationを検索条件に入れて',
                expectedLength: 12,
                returnedRaceList: baseOverseasRaceEntityList,
            },
            {
                raceTypeList: [RaceType.OVERSEAS],
                searchConditions: {
                    [RaceType.OVERSEAS]: {
                        gradeList: ['GⅠ'],
                        locationList: ['パリロンシャン'],
                    },
                },
                descriptions: 'gradeとlocationを検索条件に入れて',
                expectedLength: 1,
                returnedRaceList: baseOverseasRaceEntityList,
            },
            {
                raceTypeList: [RaceType.OVERSEAS],
                searchConditions: {
                    [RaceType.OVERSEAS]: {
                        gradeList: ['GⅠ'],
                        locationList: ['サンクルー'],
                    },
                },
                descriptions: 'gradeとlocationを検索条件に入れて',
                expectedLength: 0,
                returnedRaceList: baseOverseasRaceEntityList,
            },
            {
                raceTypeList: [RaceType.OVERSEAS],
                searchConditions: {},
                descriptions: '検索条件なし',
                expectedLength: 24,
                returnedRaceList: baseOverseasRaceEntityList,
            },
            {
                raceTypeList: [RaceType.KEIRIN],
                searchConditions: { [RaceType.KEIRIN]: { gradeList: ['GP'] } },
                descriptions: 'gradeを検索条件に入れて',
                expectedLength: 12,
                returnedRaceList: baseKeirinRaceEntityList,
            },
            {
                raceTypeList: [RaceType.KEIRIN],
                searchConditions: {
                    [RaceType.KEIRIN]: { locationList: ['平塚'] },
                },
                descriptions: 'locationを検索条件に入れて',
                expectedLength: 12,
                returnedRaceList: baseKeirinRaceEntityList,
            },
            {
                raceTypeList: [RaceType.KEIRIN],
                searchConditions: {
                    [RaceType.KEIRIN]: { stageList: ['S級決勝'] },
                },
                descriptions: 'stageを検索条件に入れて',
                expectedLength: 6,
                returnedRaceList: baseKeirinRaceEntityList,
            },
            {
                raceTypeList: [RaceType.KEIRIN],
                searchConditions: {
                    [RaceType.KEIRIN]: {
                        gradeList: ['GP'],
                        locationList: ['平塚'],
                    },
                },
                descriptions: 'gradeとlocationを検索条件に入れて',
                expectedLength: 12,
                returnedRaceList: baseKeirinRaceEntityList,
            },
            {
                raceTypeList: [RaceType.KEIRIN],
                searchConditions: {
                    [RaceType.KEIRIN]: {
                        gradeList: ['GP'],
                        locationList: ['小倉'],
                    },
                },
                descriptions: 'gradeとlocationを検索条件に入れて',
                expectedLength: 0,
                returnedRaceList: baseKeirinRaceEntityList,
            },
            {
                raceTypeList: [RaceType.KEIRIN],
                searchConditions: {
                    [RaceType.KEIRIN]: {
                        gradeList: ['GP'],
                        stageList: ['S級決勝'],
                    },
                },
                descriptions: 'gradeとstageを検索条件に入れて',
                expectedLength: 1,
                returnedRaceList: baseKeirinRaceEntityList,
            },
            {
                raceTypeList: [RaceType.KEIRIN],
                searchConditions: {
                    [RaceType.KEIRIN]: {
                        locationList: ['平塚'],
                        stageList: ['S級決勝'],
                    },
                },
                descriptions: 'locationとstageを検索条件に入れて',
                expectedLength: 1,
                returnedRaceList: baseKeirinRaceEntityList,
            },
            {
                raceTypeList: [RaceType.KEIRIN],
                searchConditions: {
                    [RaceType.KEIRIN]: {
                        gradeList: ['GP'],
                        locationList: ['平塚'],
                        stageList: ['S級決勝'],
                    },
                },
                descriptions: 'gradeとlocation、stageを検索条件に入れて',
                expectedLength: 1,
                returnedRaceList: baseKeirinRaceEntityList,
            },
            {
                raceTypeList: [RaceType.KEIRIN],
                searchConditions: { [RaceType.KEIRIN]: {} },
                descriptions: '検索条件なし',
                expectedLength: 72,
                returnedRaceList: baseKeirinRaceEntityList,
            },
            {
                raceTypeList: [RaceType.JRA],
                searchConditions: { [RaceType.JRA]: { gradeList: ['GⅠ'] } },
                descriptions: 'gradeを検索条件に入れて',
                expectedLength: 2,
                returnedRaceList: baseJraRaceEntityList,
            },
            {
                raceTypeList: [RaceType.JRA],
                searchConditions: {
                    [RaceType.JRA]: { locationList: ['東京'] },
                },
                descriptions: 'locationを検索条件に入れて',
                expectedLength: 12,
                returnedRaceList: baseJraRaceEntityList,
            },
            {
                raceTypeList: [RaceType.JRA],
                searchConditions: {
                    [RaceType.JRA]: {
                        gradeList: ['GⅠ'],
                        locationList: ['東京'],
                    },
                },
                descriptions: 'gradeとlocationを検索条件に入れて',
                expectedLength: 1,
                returnedRaceList: baseJraRaceEntityList,
            },
            {
                raceTypeList: [RaceType.JRA],
                searchConditions: {
                    [RaceType.JRA]: {
                        gradeList: ['GⅠ'],
                        locationList: ['阪神'],
                    },
                },
                descriptions: 'gradeとlocationを検索条件に入れて',
                expectedLength: 0,
                returnedRaceList: baseJraRaceEntityList,
            },
            {
                raceTypeList: [RaceType.JRA],
                searchConditions: { [RaceType.JRA]: {} },
                descriptions: '検索条件なし',
                expectedLength: 24,
                returnedRaceList: baseJraRaceEntityList,
            },
            {
                raceTypeList: [RaceType.BOATRACE],
                searchConditions: {
                    [RaceType.BOATRACE]: { gradeList: ['SG'] },
                },
                descriptions: 'gradeを検索条件に入れて',
                expectedLength: 12,
                returnedRaceList: baseBoatraceRaceEntityList,
            },
            {
                raceTypeList: [RaceType.BOATRACE],
                searchConditions: {
                    [RaceType.BOATRACE]: { locationList: ['平和島'] },
                },
                descriptions: 'locationを検索条件に入れて',
                expectedLength: 12,
                returnedRaceList: baseBoatraceRaceEntityList,
            },
            {
                raceTypeList: [RaceType.BOATRACE],
                searchConditions: {
                    [RaceType.BOATRACE]: { stageList: ['優勝戦'] },
                },
                descriptions: 'stageを検索条件に入れて',
                expectedLength: 5,
                returnedRaceList: baseBoatraceRaceEntityList,
            },
            {
                raceTypeList: [RaceType.BOATRACE],
                searchConditions: {
                    [RaceType.BOATRACE]: {
                        gradeList: ['SG'],
                        locationList: ['平和島'],
                    },
                },
                descriptions: 'gradeとlocationを検索条件に入れて',
                expectedLength: 12,
                returnedRaceList: baseBoatraceRaceEntityList,
            },
            {
                raceTypeList: [RaceType.BOATRACE],
                searchConditions: {
                    [RaceType.BOATRACE]: {
                        gradeList: ['SG'],
                        locationList: ['桐生'],
                    },
                },
                descriptions: 'gradeとlocationを検索条件に入れて',
                expectedLength: 0,
                returnedRaceList: baseBoatraceRaceEntityList,
            },
            {
                raceTypeList: [RaceType.BOATRACE],
                searchConditions: {
                    [RaceType.BOATRACE]: {
                        gradeList: ['SG'],
                        stageList: ['優勝戦'],
                    },
                },
                descriptions: 'gradeとstageを検索条件に入れて',
                expectedLength: 1,
                returnedRaceList: baseBoatraceRaceEntityList,
            },
            {
                raceTypeList: [RaceType.BOATRACE],
                searchConditions: {
                    [RaceType.BOATRACE]: {
                        locationList: ['平和島'],
                        stageList: ['優勝戦'],
                    },
                },
                descriptions: 'locationとstageを検索条件に入れて',
                expectedLength: 1,
                returnedRaceList: baseBoatraceRaceEntityList,
            },
            {
                raceTypeList: [RaceType.BOATRACE],
                searchConditions: {
                    [RaceType.BOATRACE]: {
                        gradeList: ['SG'],
                        locationList: ['平和島'],
                        stageList: ['優勝戦'],
                    },
                },
                descriptions: 'gradeとlocation、stageを検索条件に入れて',
                expectedLength: 1,
                returnedRaceList: baseBoatraceRaceEntityList,
            },
            {
                raceTypeList: [RaceType.BOATRACE],
                searchConditions: { [RaceType.BOATRACE]: {} },
                descriptions: '検索条件なし',
                expectedLength: 60,
                returnedRaceList: baseBoatraceRaceEntityList,
            },
            {
                raceTypeList: [RaceType.AUTORACE],
                searchConditions: {
                    [RaceType.AUTORACE]: { gradeList: ['SG'] },
                },
                descriptions: 'gradeを検索条件に入れて',
                expectedLength: 12,
                returnedRaceList: baseAutoraceRaceEntityList,
            },
            {
                raceTypeList: [RaceType.AUTORACE],
                searchConditions: {
                    [RaceType.AUTORACE]: { locationList: ['飯塚'] },
                },
                descriptions: 'locationを検索条件に入れて',
                expectedLength: 12,
                returnedRaceList: baseAutoraceRaceEntityList,
            },
            {
                raceTypeList: [RaceType.AUTORACE],
                searchConditions: {
                    [RaceType.AUTORACE]: { stageList: ['優勝戦'] },
                },
                descriptions: 'stageを検索条件に入れて',
                expectedLength: 5,
                returnedRaceList: baseAutoraceRaceEntityList,
            },
            {
                raceTypeList: [RaceType.AUTORACE],
                searchConditions: {
                    [RaceType.AUTORACE]: {
                        gradeList: ['SG'],
                        locationList: ['飯塚'],
                    },
                },
                descriptions: 'gradeとlocationを検索条件に入れて',
                expectedLength: 12,
                returnedRaceList: baseAutoraceRaceEntityList,
            },
            {
                raceTypeList: [RaceType.AUTORACE],
                searchConditions: {
                    [RaceType.AUTORACE]: {
                        gradeList: ['SG'],
                        locationList: ['川口'],
                    },
                },
                descriptions: 'gradeとlocationを検索条件に入れて',
                expectedLength: 0,
                returnedRaceList: baseAutoraceRaceEntityList,
            },
            {
                raceTypeList: [RaceType.AUTORACE],
                searchConditions: {
                    [RaceType.AUTORACE]: {
                        gradeList: ['SG'],
                        stageList: ['優勝戦'],
                    },
                },
                descriptions: 'gradeとstageを検索条件に入れて',
                expectedLength: 1,
                returnedRaceList: baseAutoraceRaceEntityList,
            },
            {
                raceTypeList: [RaceType.AUTORACE],
                searchConditions: {
                    [RaceType.AUTORACE]: {
                        locationList: ['飯塚'],
                        stageList: ['優勝戦'],
                    },
                },
                descriptions: 'locationとstageを検索条件に入れて',
                expectedLength: 1,
                returnedRaceList: baseAutoraceRaceEntityList,
            },
            {
                raceTypeList: [RaceType.AUTORACE],
                searchConditions: {
                    [RaceType.AUTORACE]: {
                        gradeList: ['SG'],
                        locationList: ['飯塚'],
                        stageList: ['優勝戦'],
                    },
                },
                descriptions: 'gradeとlocation、stageを検索条件に入れて',
                expectedLength: 1,
                returnedRaceList: baseAutoraceRaceEntityList,
            },
            {
                raceTypeList: [RaceType.AUTORACE],
                searchConditions: { [RaceType.AUTORACE]: {} },
                descriptions: '検索条件なし',
                expectedLength: 60,
                returnedRaceList: baseAutoraceRaceEntityList,
            },
        ]) {
            it(`(${raceTypeList.join(',')})正常にレース開催データが取得できること（${descriptions}${expectedLength.toString()}件になる）`, async () => {
                // モックの戻り値を設定
                raceDataService.fetchRaceEntityList.mockResolvedValue(
                    returnedRaceList,
                );

                const startDate = new Date('2025-12-01');
                const finishDate = new Date('2025-12-31');

                const result = await useCase.fetchRaceEntityList(
                    startDate,
                    finishDate,
                    raceTypeList,
                    searchConditions,
                );

                const [key] = raceTypeList;
                if (key in result) {
                    expect(
                        (result as Record<string, unknown>)[key],
                    ).toHaveLength(expectedLength);
                } else {
                    throw new Error(`Unexpected raceType: ${key}`);
                }
            });
        }
    });

    describe('updateRaceEntityList', () => {
        it('正常にレース開催データが更新されること', async () => {
            const startDate = new Date('2024-06-01');
            const finishDate = new Date('2024-06-30');

            placeDataService.fetchPlaceEntityList.mockResolvedValue([
                baseJraPlaceEntity,
                baseNarPlaceEntity,
                baseKeirinPlaceEntity,
                baseAutoracePlaceEntity,
                baseBoatracePlaceEntity,
            ]);

            // モックの戻り値を設定
            raceDataService.fetchRaceEntityList.mockResolvedValue([
                ...baseJraRaceEntityList,
                ...baseNarRaceEntityList,
                ...baseOverseasRaceEntityList,
                ...baseKeirinRaceEntityList,
                ...baseAutoraceRaceEntityList,
                ...baseBoatraceRaceEntityList,
            ]);

            await useCase.updateRaceEntityList(
                startDate,
                finishDate,
                ALL_RACE_TYPE_LIST,
            );

            expect(placeDataService.fetchPlaceEntityList).toHaveBeenCalled();
            expect(raceDataService.fetchRaceEntityList).toHaveBeenCalled();
            expect(raceDataService.updateRaceEntityList).toHaveBeenCalled();
        });

        it('placeEntityListが空の場合は処理を終了する', async () => {
            const startDate = new Date('2024-06-01');
            const finishDate = new Date('2024-06-30');

            placeDataService.fetchPlaceEntityList.mockResolvedValue([]);

            // モックの戻り値を設定
            raceDataService.fetchRaceEntityList.mockResolvedValue([
                ...baseJraRaceEntityList,
                ...baseNarRaceEntityList,
                ...baseOverseasRaceEntityList,
                ...baseKeirinRaceEntityList,
                ...baseAutoraceRaceEntityList,
                ...baseBoatraceRaceEntityList,
            ]);

            await useCase.updateRaceEntityList(startDate, finishDate, [
                RaceType.JRA,
                RaceType.NAR,
                RaceType.KEIRIN,
                RaceType.BOATRACE,
                RaceType.AUTORACE,
            ]);

            expect(placeDataService.fetchPlaceEntityList).toHaveBeenCalled();
            //raceDataService.fetchRaceEntityListは呼ばれていないことを確認
            expect(raceDataService.fetchRaceEntityList).not.toHaveBeenCalled();
            expect(raceDataService.updateRaceEntityList).not.toHaveBeenCalled();

            expect(console.log).toHaveBeenCalledWith(
                '指定された条件に合致する開催場所が存在しません。レースデータの更新をスキップします。',
            );
        });
    });
});
