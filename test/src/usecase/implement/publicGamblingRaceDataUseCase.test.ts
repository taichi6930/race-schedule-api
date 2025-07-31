import 'reflect-metadata'; // reflect-metadataをインポート

import { container } from 'tsyringe';

import type { IPlaceDataService } from '../../../../lib/src/service/interface/IPlaceDataService';
import type { IRaceDataService } from '../../../../lib/src/service/interface/IRaceDataService';
import { PublicGamblingRaceDataUseCase } from '../../../../lib/src/usecase/implement/publicGamblingRaceDataUseCase';
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
import { baseWorldRaceEntityList } from '../../mock/common/baseWorldData';
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
                raceTypeList: ['nar'],
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
                raceTypeList: ['nar'],
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
                raceTypeList: ['nar'],
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
                raceTypeList: ['nar'],
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
                raceTypeList: ['nar'],
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
                raceTypeList: ['world'],
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
                raceTypeList: ['world'],
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
                raceTypeList: ['world'],
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
                raceTypeList: ['world'],
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
                raceTypeList: ['world'],
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
                raceTypeList: ['keirin'],
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
                raceTypeList: ['keirin'],
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
                raceTypeList: ['keirin'],
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
                raceTypeList: ['keirin'],
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
                raceTypeList: ['keirin'],
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
                raceTypeList: ['keirin'],
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
                raceTypeList: ['keirin'],
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
                raceTypeList: ['keirin'],
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
                raceTypeList: ['keirin'],
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
                raceTypeList: ['jra'],
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
                raceTypeList: ['jra'],
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
                raceTypeList: ['jra'],
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
                raceTypeList: ['jra'],
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
                raceTypeList: ['jra'],
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
                raceTypeList: ['boatrace'],
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
                raceTypeList: ['boatrace'],
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
                raceTypeList: ['boatrace'],
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
                raceTypeList: ['boatrace'],
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
                raceTypeList: ['boatrace'],
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
                raceTypeList: ['boatrace'],
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
                raceTypeList: ['boatrace'],
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
                raceTypeList: ['boatrace'],
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
                raceTypeList: ['boatrace'],
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
                raceTypeList: ['autorace'],
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
                raceTypeList: ['autorace'],
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
                raceTypeList: ['autorace'],
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
                raceTypeList: ['autorace'],
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
                raceTypeList: ['autorace'],
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
                raceTypeList: ['autorace'],
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
                raceTypeList: ['autorace'],
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
                raceTypeList: ['autorace'],
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
                raceTypeList: ['autorace'],
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
            // --- autorace用テストケースここまで ---
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
                'jra',
                'nar',
                'world',
                'keirin',
                'autorace',
                'boatrace',
            ]);

            expect(placeDataService.fetchPlaceEntityList).toHaveBeenCalled();
            expect(raceDataService.fetchRaceEntityList).toHaveBeenCalled();
            expect(raceDataService.updateRaceEntityList).toHaveBeenCalled();
        });
    });
});
