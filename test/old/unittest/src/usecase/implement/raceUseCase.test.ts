import 'reflect-metadata';

import { container } from 'tsyringe';

import { RaceUseCaseForAWS } from '../../../../../../lib/src/usecase/implement/raceUseCaseForAWS';
import type { IRaceUseCaseForAWS } from '../../../../../../lib/src/usecase/interface/IRaceUseCaseForAWS';
import { RaceType } from '../../../../../../src/utility/raceType';
import {
    baseRaceEntityList,
    mockPlaceEntityList,
    mockRaceEntityList,
    testRaceTypeListAll,
    testRaceTypeListMechanicalRacing,
    testRaceTypeListWithoutOverseas,
} from '../../../../../unittest/src/mock/common/baseCommonData';
import type { TestServiceForAWSSetup } from '../../../../../utility/testSetupHelper';
import {
    clearMocks,
    setupTestServiceForAWSMock,
} from '../../../../../utility/testSetupHelper';

describe('RaceUseCase', () => {
    let serviceSetup: TestServiceForAWSSetup;
    let useCase: IRaceUseCaseForAWS;

    beforeEach(() => {
        serviceSetup = setupTestServiceForAWSMock();
        useCase = container.resolve(RaceUseCaseForAWS);
        jest.spyOn(console, 'log').mockImplementation();
    });

    afterEach(() => {
        clearMocks();
    });

    const testCases = {
        [RaceType.JRA]: [],
        [RaceType.NAR]: [],
        [RaceType.OVERSEAS]: [],
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
    };

    describe.each(testRaceTypeListMechanicalRacing)(
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
