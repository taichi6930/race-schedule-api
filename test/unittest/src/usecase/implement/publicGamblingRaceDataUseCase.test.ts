import 'reflect-metadata';

import { container } from 'tsyringe';

import type { IPlaceDataService } from '../../../../../lib/src/service/interface/IPlaceDataService';
import type { IRaceDataService } from '../../../../../lib/src/service/interface/IRaceDataService';
import { PublicGamblingRaceDataUseCase } from '../../../../../lib/src/usecase/implement/publicGamblingRaceDataUseCase';
import type { IRaceDataUseCase } from '../../../../../lib/src/usecase/interface/IRaceDataUseCase';
import { RaceType } from '../../../../../lib/src/utility/raceType';
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
                searchConditions: { nar: { gradeList: ['GⅠ'] } },
                descriptions: 'gradeを検索条件に入れて',
                expectedLength: 2,
                returnedRaceList: {
                    jra: [],
                    nar: baseNarRaceEntityList,
                    overseas: [],
                    keirin: [],
                    autorace: [],
                    boatrace: [],
                },
            },
            {
                raceTypeList: [RaceType.NAR],
                searchConditions: {
                    nar: {
                        locationList: ['大井'],
                    },
                },
                descriptions: 'locationを検索条件に入れて',
                expectedLength: 12,
                returnedRaceList: {
                    jra: [],
                    nar: baseNarRaceEntityList,
                    overseas: [],
                    keirin: [],
                    autorace: [],
                    boatrace: [],
                },
            },
            {
                raceTypeList: [RaceType.NAR],
                searchConditions: {
                    nar: {
                        gradeList: ['GⅠ'],
                        locationList: ['大井'],
                    },
                },
                descriptions: 'gradeとlocationを検索条件に入れて',
                expectedLength: 1,
                returnedRaceList: {
                    jra: [],
                    nar: baseNarRaceEntityList,
                    overseas: [],
                    keirin: [],
                    autorace: [],
                    boatrace: [],
                },
            },
            {
                raceTypeList: [RaceType.NAR],
                searchConditions: {
                    nar: {
                        gradeList: ['GⅠ'],
                        locationList: ['佐賀'],
                    },
                },
                descriptions: 'gradeとlocationを検索条件に入れて',
                expectedLength: 0,
                returnedRaceList: {
                    jra: [],
                    nar: baseNarRaceEntityList,
                    overseas: [],
                    keirin: [],
                    autorace: [],
                    boatrace: [],
                },
            },
            {
                raceTypeList: [RaceType.NAR],
                searchConditions: {},
                descriptions: '検索条件なし',
                expectedLength: 24,
                returnedRaceList: {
                    jra: [],
                    nar: baseNarRaceEntityList,
                    overseas: [],
                    keirin: [],
                    autorace: [],
                    boatrace: [],
                },
            },
            {
                raceTypeList: [RaceType.OVERSEAS],
                searchConditions: { overseas: { gradeList: ['GⅠ'] } },
                descriptions: 'gradeを検索条件に入れて',
                expectedLength: 2,
                returnedRaceList: {
                    jra: [],
                    nar: [],
                    overseas: baseOverseasRaceEntityList,
                    keirin: [],
                    autorace: [],
                    boatrace: [],
                },
            },
            {
                raceTypeList: [RaceType.OVERSEAS],
                searchConditions: {
                    overseas: {
                        locationList: ['パリロンシャン'],
                    },
                },
                descriptions: 'locationを検索条件に入れて',
                expectedLength: 12,
                returnedRaceList: {
                    jra: [],
                    nar: [],
                    overseas: baseOverseasRaceEntityList,
                    keirin: [],
                    autorace: [],
                    boatrace: [],
                },
            },
            {
                raceTypeList: [RaceType.OVERSEAS],
                searchConditions: {
                    overseas: {
                        gradeList: ['GⅠ'],
                        locationList: ['パリロンシャン'],
                    },
                },
                descriptions: 'gradeとlocationを検索条件に入れて',
                expectedLength: 1,
                returnedRaceList: {
                    jra: [],
                    nar: [],
                    overseas: baseOverseasRaceEntityList,
                    keirin: [],
                    autorace: [],
                    boatrace: [],
                },
            },
            {
                raceTypeList: [RaceType.OVERSEAS],
                searchConditions: {
                    overseas: {
                        gradeList: ['GⅠ'],
                        locationList: ['サンクルー'],
                    },
                },
                descriptions: 'gradeとlocationを検索条件に入れて',
                expectedLength: 0,
                returnedRaceList: {
                    jra: [],
                    nar: [],
                    overseas: baseOverseasRaceEntityList,
                    keirin: [],
                    autorace: [],
                    boatrace: [],
                },
            },
            {
                raceTypeList: [RaceType.OVERSEAS],
                searchConditions: {},
                descriptions: '検索条件なし',
                expectedLength: 24,
                returnedRaceList: {
                    jra: [],
                    nar: [],
                    overseas: baseOverseasRaceEntityList,
                    keirin: [],
                    autorace: [],
                    boatrace: [],
                },
            },
            {
                raceTypeList: [RaceType.KEIRIN],
                searchConditions: { keirin: { gradeList: ['GP'] } },
                descriptions: 'gradeを検索条件に入れて',
                expectedLength: 12,
                returnedRaceList: {
                    jra: [],
                    nar: [],
                    overseas: [],
                    keirin: baseKeirinRaceEntityList,
                    autorace: [],
                    boatrace: [],
                },
            },
            {
                raceTypeList: [RaceType.KEIRIN],
                searchConditions: { keirin: { locationList: ['平塚'] } },
                descriptions: 'locationを検索条件に入れて',
                expectedLength: 12,
                returnedRaceList: {
                    jra: [],
                    nar: [],
                    overseas: [],
                    keirin: baseKeirinRaceEntityList,
                    autorace: [],
                    boatrace: [],
                },
            },
            {
                raceTypeList: [RaceType.KEIRIN],
                searchConditions: { keirin: { stageList: ['S級決勝'] } },
                descriptions: 'stageを検索条件に入れて',
                expectedLength: 6,
                returnedRaceList: {
                    jra: [],
                    nar: [],
                    overseas: [],
                    keirin: baseKeirinRaceEntityList,
                    autorace: [],
                    boatrace: [],
                },
            },
            {
                raceTypeList: [RaceType.KEIRIN],
                searchConditions: {
                    keirin: { gradeList: ['GP'], locationList: ['平塚'] },
                },
                descriptions: 'gradeとlocationを検索条件に入れて',
                expectedLength: 12,
                returnedRaceList: {
                    jra: [],
                    nar: [],
                    overseas: [],
                    keirin: baseKeirinRaceEntityList,
                    autorace: [],
                    boatrace: [],
                },
            },
            {
                raceTypeList: [RaceType.KEIRIN],
                searchConditions: {
                    keirin: { gradeList: ['GP'], locationList: ['小倉'] },
                },
                descriptions: 'gradeとlocationを検索条件に入れて',
                expectedLength: 0,
                returnedRaceList: {
                    jra: [],
                    nar: [],
                    overseas: [],
                    keirin: baseKeirinRaceEntityList,
                    autorace: [],
                    boatrace: [],
                },
            },
            {
                raceTypeList: [RaceType.KEIRIN],
                searchConditions: {
                    keirin: { gradeList: ['GP'], stageList: ['S級決勝'] },
                },
                descriptions: 'gradeとstageを検索条件に入れて',
                expectedLength: 1,
                returnedRaceList: {
                    jra: [],
                    nar: [],
                    overseas: [],
                    keirin: baseKeirinRaceEntityList,
                    autorace: [],
                    boatrace: [],
                },
            },
            {
                raceTypeList: [RaceType.KEIRIN],
                searchConditions: {
                    keirin: { locationList: ['平塚'], stageList: ['S級決勝'] },
                },
                descriptions: 'locationとstageを検索条件に入れて',
                expectedLength: 1,
                returnedRaceList: {
                    jra: [],
                    nar: [],
                    overseas: [],
                    keirin: baseKeirinRaceEntityList,
                    autorace: [],
                    boatrace: [],
                },
            },
            {
                raceTypeList: [RaceType.KEIRIN],
                searchConditions: {
                    keirin: {
                        gradeList: ['GP'],
                        locationList: ['平塚'],
                        stageList: ['S級決勝'],
                    },
                },
                descriptions: 'gradeとlocation、stageを検索条件に入れて',
                expectedLength: 1,
                returnedRaceList: {
                    jra: [],
                    nar: [],
                    overseas: [],
                    keirin: baseKeirinRaceEntityList,
                    autorace: [],
                    boatrace: [],
                },
            },
            {
                raceTypeList: [RaceType.KEIRIN],
                searchConditions: { keirin: {} },
                descriptions: '検索条件なし',
                expectedLength: 72,
                returnedRaceList: {
                    jra: [],
                    nar: [],
                    overseas: [],
                    keirin: baseKeirinRaceEntityList,
                    autorace: [],
                    boatrace: [],
                },
            },
            {
                raceTypeList: [RaceType.JRA],
                searchConditions: { jra: { gradeList: ['GⅠ'] } },
                descriptions: 'gradeを検索条件に入れて',
                expectedLength: 2,
                returnedRaceList: {
                    jra: baseJraRaceEntityList,
                    nar: [],
                    overseas: [],
                    keirin: [],
                    autorace: [],
                    boatrace: [],
                },
            },
            {
                raceTypeList: [RaceType.JRA],
                searchConditions: { jra: { locationList: ['東京'] } },
                descriptions: 'locationを検索条件に入れて',
                expectedLength: 12,
                returnedRaceList: {
                    jra: baseJraRaceEntityList,
                    nar: [],
                    overseas: [],
                    keirin: [],
                    autorace: [],
                    boatrace: [],
                },
            },
            {
                raceTypeList: [RaceType.JRA],
                searchConditions: {
                    jra: { gradeList: ['GⅠ'], locationList: ['東京'] },
                },
                descriptions: 'gradeとlocationを検索条件に入れて',
                expectedLength: 1,
                returnedRaceList: {
                    jra: baseJraRaceEntityList,
                    nar: [],
                    overseas: [],
                    keirin: [],
                    autorace: [],
                    boatrace: [],
                },
            },
            {
                raceTypeList: [RaceType.JRA],
                searchConditions: {
                    jra: { gradeList: ['GⅠ'], locationList: ['阪神'] },
                },
                descriptions: 'gradeとlocationを検索条件に入れて',
                expectedLength: 0,
                returnedRaceList: {
                    jra: baseJraRaceEntityList,
                    nar: [],
                    overseas: [],
                    keirin: [],
                    autorace: [],
                    boatrace: [],
                },
            },
            {
                raceTypeList: [RaceType.JRA],
                searchConditions: { jra: {} },
                descriptions: '検索条件なし',
                expectedLength: 24,
                returnedRaceList: {
                    jra: baseJraRaceEntityList,
                    nar: [],
                    overseas: [],
                    keirin: [],
                    autorace: [],
                    boatrace: [],
                },
            },
            {
                raceTypeList: [RaceType.BOATRACE],
                searchConditions: { boatrace: { gradeList: ['SG'] } },
                descriptions: 'gradeを検索条件に入れて',
                expectedLength: 12,
                returnedRaceList: {
                    boatrace: baseBoatraceRaceEntityList,
                    jra: [],
                    nar: [],
                    overseas: [],
                    keirin: [],
                    autorace: [],
                },
            },
            {
                raceTypeList: [RaceType.BOATRACE],
                searchConditions: { boatrace: { locationList: ['平和島'] } },
                descriptions: 'locationを検索条件に入れて',
                expectedLength: 12,
                returnedRaceList: {
                    boatrace: baseBoatraceRaceEntityList,
                    jra: [],
                    nar: [],
                    overseas: [],
                    keirin: [],
                    autorace: [],
                },
            },
            {
                raceTypeList: [RaceType.BOATRACE],
                searchConditions: { boatrace: { stageList: ['優勝戦'] } },
                descriptions: 'stageを検索条件に入れて',
                expectedLength: 5,
                returnedRaceList: {
                    boatrace: baseBoatraceRaceEntityList,
                    jra: [],
                    nar: [],
                    overseas: [],
                    keirin: [],
                    autorace: [],
                },
            },
            {
                raceTypeList: [RaceType.BOATRACE],
                searchConditions: {
                    boatrace: { gradeList: ['SG'], locationList: ['平和島'] },
                },
                descriptions: 'gradeとlocationを検索条件に入れて',
                expectedLength: 12,
                returnedRaceList: {
                    boatrace: baseBoatraceRaceEntityList,
                    jra: [],
                    nar: [],
                    overseas: [],
                    keirin: [],
                    autorace: [],
                },
            },
            {
                raceTypeList: [RaceType.BOATRACE],
                searchConditions: {
                    boatrace: { gradeList: ['SG'], locationList: ['桐生'] },
                },
                descriptions: 'gradeとlocationを検索条件に入れて',
                expectedLength: 0,
                returnedRaceList: {
                    boatrace: baseBoatraceRaceEntityList,
                    jra: [],
                    nar: [],
                    overseas: [],
                    keirin: [],
                    autorace: [],
                },
            },
            {
                raceTypeList: [RaceType.BOATRACE],
                searchConditions: {
                    boatrace: { gradeList: ['SG'], stageList: ['優勝戦'] },
                },
                descriptions: 'gradeとstageを検索条件に入れて',
                expectedLength: 1,
                returnedRaceList: {
                    boatrace: baseBoatraceRaceEntityList,
                    jra: [],
                    nar: [],
                    overseas: [],
                    keirin: [],
                    autorace: [],
                },
            },
            {
                raceTypeList: [RaceType.BOATRACE],
                searchConditions: {
                    boatrace: {
                        locationList: ['平和島'],
                        stageList: ['優勝戦'],
                    },
                },
                descriptions: 'locationとstageを検索条件に入れて',
                expectedLength: 1,
                returnedRaceList: {
                    boatrace: baseBoatraceRaceEntityList,
                    jra: [],
                    nar: [],
                    overseas: [],
                    keirin: [],
                    autorace: [],
                },
            },
            {
                raceTypeList: [RaceType.BOATRACE],
                searchConditions: {
                    boatrace: {
                        gradeList: ['SG'],
                        locationList: ['平和島'],
                        stageList: ['優勝戦'],
                    },
                },
                descriptions: 'gradeとlocation、stageを検索条件に入れて',
                expectedLength: 1,
                returnedRaceList: {
                    boatrace: baseBoatraceRaceEntityList,
                    jra: [],
                    nar: [],
                    overseas: [],
                    keirin: [],
                    autorace: [],
                },
            },
            {
                raceTypeList: [RaceType.BOATRACE],
                searchConditions: { boatrace: {} },
                descriptions: '検索条件なし',
                expectedLength: 60,
                returnedRaceList: {
                    boatrace: baseBoatraceRaceEntityList,
                    jra: [],
                    nar: [],
                    overseas: [],
                    keirin: [],
                    autorace: [],
                },
            },
            {
                raceTypeList: [RaceType.AUTORACE],
                searchConditions: { autorace: { gradeList: ['SG'] } },
                descriptions: 'gradeを検索条件に入れて',
                expectedLength: 12,
                returnedRaceList: {
                    autorace: baseAutoraceRaceEntityList,
                    jra: [],
                    nar: [],
                    overseas: [],
                    keirin: [],
                    boatrace: [],
                },
            },
            {
                raceTypeList: [RaceType.AUTORACE],
                searchConditions: { autorace: { locationList: ['飯塚'] } },
                descriptions: 'locationを検索条件に入れて',
                expectedLength: 12,
                returnedRaceList: {
                    autorace: baseAutoraceRaceEntityList,
                    jra: [],
                    nar: [],
                    overseas: [],
                    keirin: [],
                    boatrace: [],
                },
            },
            {
                raceTypeList: [RaceType.AUTORACE],
                searchConditions: { autorace: { stageList: ['優勝戦'] } },
                descriptions: 'stageを検索条件に入れて',
                expectedLength: 5,
                returnedRaceList: {
                    autorace: baseAutoraceRaceEntityList,
                    jra: [],
                    nar: [],
                    overseas: [],
                    keirin: [],
                    boatrace: [],
                },
            },
            {
                raceTypeList: [RaceType.AUTORACE],
                searchConditions: {
                    autorace: { gradeList: ['SG'], locationList: ['飯塚'] },
                },
                descriptions: 'gradeとlocationを検索条件に入れて',
                expectedLength: 12,
                returnedRaceList: {
                    autorace: baseAutoraceRaceEntityList,
                    jra: [],
                    nar: [],
                    overseas: [],
                    keirin: [],
                    boatrace: [],
                },
            },
            {
                raceTypeList: [RaceType.AUTORACE],
                searchConditions: {
                    autorace: { gradeList: ['SG'], locationList: ['川口'] },
                },
                descriptions: 'gradeとlocationを検索条件に入れて',
                expectedLength: 0,
                returnedRaceList: {
                    autorace: baseAutoraceRaceEntityList,
                    jra: [],
                    nar: [],
                    overseas: [],
                    keirin: [],
                    boatrace: [],
                },
            },
            {
                raceTypeList: [RaceType.AUTORACE],
                searchConditions: {
                    autorace: { gradeList: ['SG'], stageList: ['優勝戦'] },
                },
                descriptions: 'gradeとstageを検索条件に入れて',
                expectedLength: 1,
                returnedRaceList: {
                    autorace: baseAutoraceRaceEntityList,
                    jra: [],
                    nar: [],
                    overseas: [],
                    keirin: [],
                    boatrace: [],
                },
            },
            {
                raceTypeList: [RaceType.AUTORACE],
                searchConditions: {
                    autorace: { locationList: ['飯塚'], stageList: ['優勝戦'] },
                },
                descriptions: 'locationとstageを検索条件に入れて',
                expectedLength: 1,
                returnedRaceList: {
                    autorace: baseAutoraceRaceEntityList,
                    jra: [],
                    nar: [],
                    overseas: [],
                    keirin: [],
                    boatrace: [],
                },
            },
            {
                raceTypeList: [RaceType.AUTORACE],
                searchConditions: {
                    autorace: {
                        gradeList: ['SG'],
                        locationList: ['飯塚'],
                        stageList: ['優勝戦'],
                    },
                },
                descriptions: 'gradeとlocation、stageを検索条件に入れて',
                expectedLength: 1,
                returnedRaceList: {
                    autorace: baseAutoraceRaceEntityList,
                    jra: [],
                    nar: [],
                    overseas: [],
                    keirin: [],
                    boatrace: [],
                },
            },
            {
                raceTypeList: [RaceType.AUTORACE],
                searchConditions: { autorace: {} },
                descriptions: '検索条件なし',
                expectedLength: 60,
                returnedRaceList: {
                    autorace: baseAutoraceRaceEntityList,
                    jra: [],
                    nar: [],
                    overseas: [],
                    keirin: [],
                    boatrace: [],
                },
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
                console.log(result);
                if (key.toLowerCase() in result) {
                    expect(
                        (result as Record<string, unknown>)[key.toLowerCase()],
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

            placeDataService.fetchPlaceEntityList.mockResolvedValue({
                jra: [baseJraPlaceEntity],
                nar: [baseNarPlaceEntity],
                mechanicalRacing: [
                    baseKeirinPlaceEntity,
                    baseAutoracePlaceEntity,
                    baseBoatracePlaceEntity,
                ],
            });

            // モックの戻り値を設定
            raceDataService.fetchRaceEntityList.mockResolvedValue({
                jra: baseJraRaceEntityList,
                nar: baseNarRaceEntityList,
                overseas: baseOverseasRaceEntityList,
                keirin: baseKeirinRaceEntityList,
                autorace: baseAutoraceRaceEntityList,
                boatrace: baseBoatraceRaceEntityList,
            });

            await useCase.updateRaceEntityList(startDate, finishDate, [
                RaceType.JRA,
                RaceType.NAR,
                RaceType.OVERSEAS,
                RaceType.KEIRIN,
                RaceType.BOATRACE,
                RaceType.AUTORACE,
            ]);

            expect(placeDataService.fetchPlaceEntityList).toHaveBeenCalled();
            expect(raceDataService.fetchRaceEntityList).toHaveBeenCalled();
            expect(raceDataService.updateRaceEntityList).toHaveBeenCalled();
        });

        it('placeEntityListが空の場合は処理を終了する', async () => {
            const startDate = new Date('2024-06-01');
            const finishDate = new Date('2024-06-30');

            placeDataService.fetchPlaceEntityList.mockResolvedValue({
                jra: [],
                nar: [],
                mechanicalRacing: [],
            });

            // モックの戻り値を設定
            raceDataService.fetchRaceEntityList.mockResolvedValue({
                jra: baseJraRaceEntityList,
                nar: baseNarRaceEntityList,
                overseas: baseOverseasRaceEntityList,
                keirin: baseKeirinRaceEntityList,
                autorace: baseAutoraceRaceEntityList,
                boatrace: baseBoatraceRaceEntityList,
            });

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
