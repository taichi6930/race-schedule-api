import 'reflect-metadata';

import { container } from 'tsyringe';

import { RaceUseCase } from '../../../../../lib/src/usecase/implement/raceUseCase';
import type { IRaceUseCaseForAWS } from '../../../../../lib/src/usecase/interface/IRaceUseCase';
import { RaceType } from '../../../../../lib/src/utility/raceType';
import type { TestServiceSetup } from '../../../../utility/testSetupHelper';
import {
    clearMocks,
    setupTestServiceMock,
} from '../../../../utility/testSetupHelper';
import {
    baseRaceEntityList,
    mockPlaceEntityList,
    mockRaceEntityList,
    testRaceTypeListAll,
    testRaceTypeListWithoutOverseas,
} from '../../mock/common/baseCommonData';

describe('RaceUseCase', () => {
    let serviceSetup: TestServiceSetup;
    let useCase: IRaceUseCaseForAWS;

    beforeEach(() => {
        serviceSetup = setupTestServiceMock();
        useCase = container.resolve(RaceUseCase);
        jest.spyOn(console, 'log').mockImplementation();
    });

    afterEach(() => {
        clearMocks();
    });

    const testCases = {
        [RaceType.NAR]: [
            {
                raceTypeList: [RaceType.NAR],
                searchConditions: { [RaceType.NAR]: { gradeList: ['GⅠ'] } },
                descriptions: 'gradeを検索条件に入れて',
                expectedLength: 2,
                returnedRaceList: baseRaceEntityList(RaceType.NAR),
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
                returnedRaceList: baseRaceEntityList(RaceType.NAR),
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
                returnedRaceList: baseRaceEntityList(RaceType.NAR),
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
                returnedRaceList: baseRaceEntityList(RaceType.NAR),
            },
            {
                raceTypeList: [RaceType.NAR],
                searchConditions: {},
                descriptions: '検索条件なし',
                expectedLength: 24,
                returnedRaceList: baseRaceEntityList(RaceType.NAR),
            },
        ],
        [RaceType.OVERSEAS]: [
            {
                raceTypeList: [RaceType.OVERSEAS],
                searchConditions: {
                    [RaceType.OVERSEAS]: { gradeList: ['GⅠ'] },
                },
                descriptions: 'gradeを検索条件に入れて',
                expectedLength: 2,
                returnedRaceList: baseRaceEntityList(RaceType.OVERSEAS),
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
                returnedRaceList: baseRaceEntityList(RaceType.OVERSEAS),
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
                returnedRaceList: baseRaceEntityList(RaceType.OVERSEAS),
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
                returnedRaceList: baseRaceEntityList(RaceType.OVERSEAS),
            },
            {
                raceTypeList: [RaceType.OVERSEAS],
                searchConditions: {},
                descriptions: '検索条件なし',
                expectedLength: 24,
                returnedRaceList: baseRaceEntityList(RaceType.OVERSEAS),
            },
        ],
        [RaceType.KEIRIN]: [
            {
                raceTypeList: [RaceType.KEIRIN],
                searchConditions: {
                    [RaceType.KEIRIN]: { gradeList: ['GP'] },
                },
                descriptions: 'gradeを検索条件に入れて',
                expectedLength: 12,
                returnedRaceList: baseRaceEntityList(RaceType.KEIRIN),
            },
            {
                raceTypeList: [RaceType.KEIRIN],
                searchConditions: {
                    [RaceType.KEIRIN]: { locationList: ['平塚'] },
                },
                descriptions: 'locationを検索条件に入れて',
                expectedLength: 12,
                returnedRaceList: baseRaceEntityList(RaceType.KEIRIN),
            },
            {
                raceTypeList: [RaceType.KEIRIN],
                searchConditions: {
                    [RaceType.KEIRIN]: { stageList: ['S級決勝'] },
                },
                descriptions: 'stageを検索条件に入れて',
                expectedLength: 6,
                returnedRaceList: baseRaceEntityList(RaceType.KEIRIN),
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
                returnedRaceList: baseRaceEntityList(RaceType.KEIRIN),
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
                returnedRaceList: baseRaceEntityList(RaceType.KEIRIN),
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
                returnedRaceList: baseRaceEntityList(RaceType.KEIRIN),
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
                returnedRaceList: baseRaceEntityList(RaceType.KEIRIN),
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
                returnedRaceList: baseRaceEntityList(RaceType.KEIRIN),
            },
            {
                raceTypeList: [RaceType.KEIRIN],
                searchConditions: { [RaceType.KEIRIN]: {} },
                descriptions: '検索条件なし',
                expectedLength: 72,
                returnedRaceList: baseRaceEntityList(RaceType.KEIRIN),
            },
        ],
        [RaceType.JRA]: [
            {
                raceTypeList: [RaceType.JRA],
                searchConditions: { [RaceType.JRA]: { gradeList: ['GⅠ'] } },
                descriptions: 'gradeを検索条件に入れて',
                expectedLength: 2,
                returnedRaceList: baseRaceEntityList(RaceType.JRA),
            },
            {
                raceTypeList: [RaceType.JRA],
                searchConditions: {
                    [RaceType.JRA]: { locationList: ['東京'] },
                },
                descriptions: 'locationを検索条件に入れて',
                expectedLength: 12,
                returnedRaceList: baseRaceEntityList(RaceType.JRA),
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
                returnedRaceList: baseRaceEntityList(RaceType.JRA),
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
                returnedRaceList: baseRaceEntityList(RaceType.JRA),
            },
            {
                raceTypeList: [RaceType.JRA],
                searchConditions: { [RaceType.JRA]: {} },
                descriptions: '検索条件なし',
                expectedLength: 24,
                returnedRaceList: baseRaceEntityList(RaceType.JRA),
            },
        ],
        [RaceType.BOATRACE]: [
            {
                raceTypeList: [RaceType.BOATRACE],
                searchConditions: {
                    [RaceType.BOATRACE]: { gradeList: ['SG'] },
                },
                descriptions: 'gradeを検索条件に入れて',
                expectedLength: 12,
                returnedRaceList: baseRaceEntityList(RaceType.BOATRACE),
            },
            {
                raceTypeList: [RaceType.BOATRACE],
                searchConditions: {
                    [RaceType.BOATRACE]: { locationList: ['平和島'] },
                },
                descriptions: 'locationを検索条件に入れて',
                expectedLength: 12,
                returnedRaceList: baseRaceEntityList(RaceType.BOATRACE),
            },
            {
                raceTypeList: [RaceType.BOATRACE],
                searchConditions: {
                    [RaceType.BOATRACE]: { stageList: ['優勝戦'] },
                },
                descriptions: 'stageを検索条件に入れて',
                expectedLength: 5,
                returnedRaceList: baseRaceEntityList(RaceType.BOATRACE),
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
                returnedRaceList: baseRaceEntityList(RaceType.BOATRACE),
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
                returnedRaceList: baseRaceEntityList(RaceType.BOATRACE),
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
                returnedRaceList: baseRaceEntityList(RaceType.BOATRACE),
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
                returnedRaceList: baseRaceEntityList(RaceType.BOATRACE),
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
                returnedRaceList: baseRaceEntityList(RaceType.BOATRACE),
            },
            {
                raceTypeList: [RaceType.BOATRACE],
                searchConditions: { [RaceType.BOATRACE]: {} },
                descriptions: '検索条件なし',
                expectedLength: 60,
                returnedRaceList: baseRaceEntityList(RaceType.BOATRACE),
            },
        ],
        [RaceType.AUTORACE]: [
            {
                raceTypeList: [RaceType.AUTORACE],
                searchConditions: {
                    [RaceType.AUTORACE]: { gradeList: ['SG'] },
                },
                descriptions: 'gradeを検索条件に入れて',
                expectedLength: 12,
                returnedRaceList: baseRaceEntityList(RaceType.AUTORACE),
            },
            {
                raceTypeList: [RaceType.AUTORACE],
                searchConditions: {
                    [RaceType.AUTORACE]: { locationList: ['飯塚'] },
                },
                descriptions: 'locationを検索条件に入れて',
                expectedLength: 12,
                returnedRaceList: baseRaceEntityList(RaceType.AUTORACE),
            },
            {
                raceTypeList: [RaceType.AUTORACE],
                searchConditions: {
                    [RaceType.AUTORACE]: { stageList: ['優勝戦'] },
                },
                descriptions: 'stageを検索条件に入れて',
                expectedLength: 5,
                returnedRaceList: baseRaceEntityList(RaceType.AUTORACE),
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
                returnedRaceList: baseRaceEntityList(RaceType.AUTORACE),
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
                returnedRaceList: baseRaceEntityList(RaceType.AUTORACE),
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
                returnedRaceList: baseRaceEntityList(RaceType.AUTORACE),
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
                returnedRaceList: baseRaceEntityList(RaceType.AUTORACE),
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
                returnedRaceList: baseRaceEntityList(RaceType.AUTORACE),
            },
            {
                raceTypeList: [RaceType.AUTORACE],
                searchConditions: { [RaceType.AUTORACE]: {} },
                descriptions: '検索条件なし',
                expectedLength: 60,
                returnedRaceList: baseRaceEntityList(RaceType.AUTORACE),
            },
        ],
    };

    describe.each(testRaceTypeListAll)(
        'fetchRaceEntityList(%s)',
        (raceType) => {
            for (const {
                raceTypeList,
                searchConditions,
                descriptions,
                expectedLength,
                returnedRaceList,
            } of testCases[raceType]) {
                it(`(${raceTypeList.join(',')})正常にレース開催データが取得できること（${descriptions}${expectedLength.toString()}件になる）`, async () => {
                    // モックの戻り値を設定
                    serviceSetup.raceService.fetchRaceEntityList.mockResolvedValue(
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

                    expect(result).toHaveLength(expectedLength);
                });
            }
        },
    );

    describe('updateRaceEntityList', () => {
        it('正常にレース開催データが更新されること', async () => {
            const startDate = new Date('2024-06-01');
            const finishDate = new Date('2024-06-30');

            serviceSetup.placeService.fetchPlaceEntityList.mockResolvedValue(
                mockPlaceEntityList,
            );

            // モックの戻り値を設定
            serviceSetup.raceService.fetchRaceEntityList.mockResolvedValue(
                mockRaceEntityList,
            );

            await useCase.updateRaceEntityList(
                startDate,
                finishDate,
                testRaceTypeListAll,
            );

            expect(
                serviceSetup.placeService.fetchPlaceEntityList,
            ).toHaveBeenCalled();
            expect(
                serviceSetup.raceService.fetchRaceEntityList,
            ).toHaveBeenCalled();
            expect(
                serviceSetup.raceService.updateRaceEntityList,
            ).toHaveBeenCalled();
        });

        it('placeEntityListが空の場合は処理を終了する', async () => {
            const startDate = new Date('2024-06-01');
            const finishDate = new Date('2024-06-30');

            serviceSetup.placeService.fetchPlaceEntityList.mockResolvedValue(
                [],
            );

            // モックの戻り値を設定
            serviceSetup.raceService.fetchRaceEntityList.mockResolvedValue(
                mockRaceEntityList,
            );

            await useCase.updateRaceEntityList(
                startDate,
                finishDate,
                testRaceTypeListWithoutOverseas,
            );

            expect(
                serviceSetup.placeService.fetchPlaceEntityList,
            ).toHaveBeenCalled();
            //raceService.fetchRaceEntityListは呼ばれていないことを確認
            expect(
                serviceSetup.raceService.fetchRaceEntityList,
            ).not.toHaveBeenCalled();
            expect(
                serviceSetup.raceService.updateRaceEntityList,
            ).not.toHaveBeenCalled();

            expect(console.log).toHaveBeenCalledWith(
                '指定された条件に合致する開催場所が存在しません。レースデータの更新をスキップします。',
            );
        });
    });
});
