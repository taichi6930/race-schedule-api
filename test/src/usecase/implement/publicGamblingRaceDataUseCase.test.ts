import 'reflect-metadata'; // reflect-metadataをインポート

import { container } from 'tsyringe';

import type { IPlaceDataService } from '../../../../lib/src/service/interface/IPlaceDataService';
import type { IRaceDataService } from '../../../../lib/src/service/interface/IRaceDataService';
import { PublicGamblingRaceDataUseCase } from '../../../../lib/src/usecase/implement/publicGamblingRaceDataUseCase';
import { RaceType } from '../../../../lib/src/utility/raceType';
import {
    baseAutoracePlaceEntity,
    baseAutoraceRaceDataList,
    baseAutoraceRaceEntityList,
} from '../../mock/common/baseAutoraceData';
import {
    baseBoatracePlaceEntity,
    baseBoatraceRaceDataList,
    baseBoatraceRaceEntityList,
} from '../../mock/common/baseBoatraceData';
import {
    baseJraPlaceEntity,
    baseJraRaceDataList,
    baseJraRaceEntityList,
} from '../../mock/common/baseJraData';
import {
    baseKeirinPlaceEntity,
    baseKeirinRaceDataList,
    baseKeirinRaceEntityList,
} from '../../mock/common/baseKeirinData';
import {
    baseNarPlaceEntity,
    baseNarRaceDataList,
    baseNarRaceEntityList,
} from '../../mock/common/baseNarData';
import {
    baseWorldRaceDataList,
    baseWorldRaceEntityList,
} from '../../mock/common/baseWorldData';
import { placeDataServiceMock } from '../../mock/service/placeDataServiceMock';
import { raceDataServiceMock } from '../../mock/service/raceDataServiceMock';

describe('PublicGamblingRaceDataUseCase', () => {
    let raceDataService: jest.Mocked<IRaceDataService>;
    let placeDataService: jest.Mocked<IPlaceDataService>;
    let useCase: PublicGamblingRaceDataUseCase;

    beforeEach(() => {
        raceDataService = raceDataServiceMock();
        container.registerInstance<IRaceDataService>(
            'PublicGamblingRaceDataService',
            raceDataService,
        );
        placeDataService = placeDataServiceMock();
        container.registerInstance<IPlaceDataService>(
            'PublicGamblingPlaceDataService',
            placeDataService,
        );

        useCase = container.resolve(PublicGamblingRaceDataUseCase);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('fetchRaceDataList', () => {
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
                    world: [],
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
                    world: [],
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
                    world: [],
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
                    world: [],
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
                    world: [],
                    keirin: [],
                    autorace: [],
                    boatrace: [],
                },
            },
            {
                raceTypeList: [RaceType.WORLD],
                searchConditions: { world: { gradeList: ['GⅠ'] } },
                descriptions: 'gradeを検索条件に入れて',
                expectedLength: 2,
                returnedRaceList: {
                    jra: [],
                    nar: [],
                    world: baseWorldRaceEntityList,
                    keirin: [],
                    autorace: [],
                    boatrace: [],
                },
            },
            {
                raceTypeList: [RaceType.WORLD],
                searchConditions: {
                    world: {
                        locationList: ['パリロンシャン'],
                    },
                },
                descriptions: 'locationを検索条件に入れて',
                expectedLength: 12,
                returnedRaceList: {
                    jra: [],
                    nar: [],
                    world: baseWorldRaceEntityList,
                    keirin: [],
                    autorace: [],
                    boatrace: [],
                },
            },
            {
                raceTypeList: [RaceType.WORLD],
                searchConditions: {
                    world: {
                        gradeList: ['GⅠ'],
                        locationList: ['パリロンシャン'],
                    },
                },
                descriptions: 'gradeとlocationを検索条件に入れて',
                expectedLength: 1,
                returnedRaceList: {
                    jra: [],
                    nar: [],
                    world: baseWorldRaceEntityList,
                    keirin: [],
                    autorace: [],
                    boatrace: [],
                },
            },
            {
                raceTypeList: [RaceType.WORLD],
                searchConditions: {
                    world: {
                        gradeList: ['GⅠ'],
                        locationList: ['サンクルー'],
                    },
                },
                descriptions: 'gradeとlocationを検索条件に入れて',
                expectedLength: 0,
                returnedRaceList: {
                    jra: [],
                    nar: [],
                    world: baseWorldRaceEntityList,
                    keirin: [],
                    autorace: [],
                    boatrace: [],
                },
            },
            {
                raceTypeList: [RaceType.WORLD],
                searchConditions: {},
                descriptions: '検索条件なし',
                expectedLength: 24,
                returnedRaceList: {
                    jra: [],
                    nar: [],
                    world: baseWorldRaceEntityList,
                    keirin: [],
                    autorace: [],
                    boatrace: [],
                },
            },
            // --- keirin用テストケースここから ---
            {
                raceTypeList: [RaceType.KEIRIN],
                searchConditions: { keirin: { gradeList: ['GP'] } },
                descriptions: 'gradeを検索条件に入れて',
                expectedLength: 12,
                returnedRaceList: {
                    jra: [],
                    nar: [],
                    world: [],
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
                    world: [],
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
                    world: [],
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
                    world: [],
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
                    world: [],
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
                    world: [],
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
                    world: [],
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
                    world: [],
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
                    world: [],
                    keirin: baseKeirinRaceEntityList,
                    autorace: [],
                    boatrace: [],
                },
            },
            // --- keirin用テストケースここまで ---
            // --- jra用テストケースここから ---
            {
                raceTypeList: [RaceType.JRA],
                searchConditions: { jra: { gradeList: ['GⅠ'] } },
                descriptions: 'gradeを検索条件に入れて',
                expectedLength: 2,
                returnedRaceList: {
                    jra: baseJraRaceEntityList,
                    nar: [],
                    world: [],
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
                    world: [],
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
                    world: [],
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
                    world: [],
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
                    world: [],
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
                    world: [],
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
                    world: [],
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
                    world: [],
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
                    world: [],
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
                    world: [],
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
                    world: [],
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
                    world: [],
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
                    world: [],
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
                    world: [],
                    keirin: [],
                    autorace: [],
                },
            },

            // --- autorace用テストケースここから ---
            {
                raceTypeList: [RaceType.AUTORACE],
                searchConditions: { autorace: { gradeList: ['SG'] } },
                descriptions: 'gradeを検索条件に入れて',
                expectedLength: 12,
                returnedRaceList: {
                    autorace: baseAutoraceRaceEntityList,
                    jra: [],
                    nar: [],
                    world: [],
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
                    world: [],
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
                    world: [],
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
                    world: [],
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
                    world: [],
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
                    world: [],
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
                    world: [],
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
                    world: [],
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
                    world: [],
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

                const result = await useCase.fetchRaceDataList(
                    startDate,
                    finishDate,
                    raceTypeList,
                    searchConditions,
                );

                const [key] = raceTypeList;
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

    describe('updateRaceDataList', () => {
        it('正常にレース開催データが更新されること', async () => {
            const startDate = new Date('2024-06-01');
            const finishDate = new Date('2024-06-30');

            placeDataService.fetchPlaceEntityList.mockResolvedValue({
                jra: [baseJraPlaceEntity],
                nar: [baseNarPlaceEntity],
                keirin: [baseKeirinPlaceEntity],
                autorace: [baseAutoracePlaceEntity],
                boatrace: [baseBoatracePlaceEntity],
            });

            // モックの戻り値を設定
            raceDataService.fetchRaceEntityList.mockResolvedValue({
                jra: baseJraRaceEntityList,
                nar: baseNarRaceEntityList,
                world: baseWorldRaceEntityList,
                keirin: baseKeirinRaceEntityList,
                autorace: baseAutoraceRaceEntityList,
                boatrace: baseBoatraceRaceEntityList,
            });

            await useCase.updateRaceEntityList(startDate, finishDate, [
                RaceType.JRA,
                RaceType.NAR,
                RaceType.WORLD,
                RaceType.KEIRIN,
                RaceType.AUTORACE,
                RaceType.BOATRACE,
            ]);

            expect(placeDataService.fetchPlaceEntityList).toHaveBeenCalled();
            expect(raceDataService.fetchRaceEntityList).toHaveBeenCalled();
            expect(raceDataService.updateRaceEntityList).toHaveBeenCalled();
        });
    });

    describe('upsertRaceDataList', () => {
        it('正常にレース開催データが更新されること', async () => {
            await useCase.upsertRaceDataList({
                jra: baseJraRaceDataList,
                nar: baseNarRaceDataList,
                world: baseWorldRaceDataList,
                keirin: baseKeirinRaceDataList,
                autorace: baseAutoraceRaceDataList,
                boatrace: baseBoatraceRaceDataList,
            });

            expect(raceDataService.updateRaceEntityList).toHaveBeenCalled();
        });
    });
});
