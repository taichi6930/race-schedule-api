import 'reflect-metadata';

import * as fs from 'node:fs';
import path from 'node:path';

import { format } from 'date-fns';
import { container } from 'tsyringe';

import { RaceData } from '../../../../../lib/src/domain/raceData';
import type { IS3Gateway } from '../../../../../lib/src/gateway/interface/iS3Gateway';
import { RaceEntity } from '../../../../../lib/src/repository/entity/raceEntity';
import { SearchRaceFilterEntity } from '../../../../../lib/src/repository/entity/searchRaceFilterEntity';
import { MechanicalRacingRaceRepositoryFromStorage } from '../../../../../lib/src/repository/implement/mechanicalRacingRaceRepositoryFromStorage';
import { RaceRepositoryFromStorage } from '../../../../../lib/src/repository/implement/raceRepositoryFromStorage';
import type { IRaceRepository } from '../../../../../lib/src/repository/interface/IRaceRepository';
import { CSV_FILE_NAME } from '../../../../../lib/src/utility/constants';
import { getJSTDate } from '../../../../../lib/src/utility/date';
import {
    RACE_TYPE_LIST_HORSE_RACING,
    RACE_TYPE_LIST_MECHANICAL_RACING,
    RaceType,
} from '../../../../../lib/src/utility/raceType';
import type { TestSetup } from '../../../../utility/testSetupHelper';
import { setupTestMock } from '../../../../utility/testSetupHelper';
import {
    baseConditionData,
    baseRacePlayerDataList,
    defaultHeldDayData,
    defaultLocation,
    defaultRaceGrade,
    defaultStage,
} from '../../mock/common/baseCommonData';
import { RACE_TYPE_LIST_ALL } from './../../../../../lib/src/utility/raceType';

describe('RaceRepositoryFromStorage', () => {
    let s3Gateway: jest.Mocked<IS3Gateway>;
    let horseRacingRaceRepository: IRaceRepository;
    let mechanicalRacingRaceRepository: IRaceRepository;

    beforeEach(() => {
        const setup: TestSetup = setupTestMock();
        ({ s3Gateway } = setup);

        // テスト対象のリポジトリを生成
        horseRacingRaceRepository = container.resolve(
            RaceRepositoryFromStorage,
        );
        mechanicalRacingRaceRepository = container.resolve(
            MechanicalRacingRaceRepositoryFromStorage,
        );
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('fetchRaceList', () => {
        test('レース開催データを正常に取得できる', async () => {
            // モックの戻り値を設定
            s3Gateway.fetchDataFromS3.mockImplementation(
                async (folderName, fileName) => {
                    return fs.readFileSync(
                        path.resolve(
                            __dirname,
                            '../../mock/repository/csv',
                            `${folderName}${fileName}`,
                        ),
                        'utf8',
                    );
                },
            );

            for (const raceType of RACE_TYPE_LIST_HORSE_RACING) {
                const raceEntityList =
                    await horseRacingRaceRepository.fetchRaceEntityList(
                        new SearchRaceFilterEntity(
                            new Date('2024-01-01'),
                            new Date('2024-02-01'),
                            raceType,
                            [],
                        ),
                    );

                // レスポンスの検証
                expect(raceEntityList).toHaveLength(1);
            }

            // テスト実行
            for (const raceType of RACE_TYPE_LIST_MECHANICAL_RACING) {
                const raceEntityList =
                    await mechanicalRacingRaceRepository.fetchRaceEntityList(
                        new SearchRaceFilterEntity(
                            new Date('2024-01-01'),
                            new Date('2024-02-01'),
                            raceType,
                            [],
                        ),
                    );

                // レスポンスの検証
                expect(raceEntityList).toHaveLength(1);
            }
        });
    });

    describe('registerRaceList', () => {
        test('DBが空データのところに、正しいレース開催データを登録できる', async () => {
            for (const raceType of RACE_TYPE_LIST_ALL) {
                // 1年間のレース開催データを登録する
                const raceEntityList: RaceEntity[] = Array.from(
                    { length: 60 },
                    (_, day) => {
                        const date = new Date('2024-01-01');
                        date.setDate(date.getDate() + day);
                        return Array.from({ length: 12 }, (__, j) =>
                            RaceEntity.createWithoutId(
                                RaceData.create(
                                    raceType,
                                    `raceName${format(date, 'yyyyMMdd')}`,
                                    date,
                                    defaultLocation[raceType],
                                    defaultRaceGrade[raceType],
                                    j + 1,
                                ),
                                defaultHeldDayData[raceType],
                                baseConditionData(raceType),
                                defaultStage[raceType],
                                baseRacePlayerDataList(raceType),
                                getJSTDate(new Date()),
                            ),
                        );
                    },
                ).flat();

                // テスト実行
                await (raceType === RaceType.JRA ||
                raceType === RaceType.NAR ||
                raceType === RaceType.OVERSEAS
                    ? horseRacingRaceRepository.registerRaceEntityList(
                          raceType,
                          raceEntityList,
                      )
                    : mechanicalRacingRaceRepository.registerRaceEntityList(
                          raceType,
                          raceEntityList,
                      ));
            }
            // S3へのアップロード回数とその引数を検証
            expect(s3Gateway.uploadDataToS3).toHaveBeenCalledTimes(9);
        });

        test('DBにデータの存在するところに、正しいレース開催データを登録できる', async () => {
            for (const { raceType, expectCallCount } of [
                {
                    raceType: RaceType.JRA,
                    expectCallCount: 1,
                },
                {
                    raceType: RaceType.NAR,
                    expectCallCount: 2,
                },
                {
                    raceType: RaceType.OVERSEAS,
                    expectCallCount: 3,
                },
                {
                    raceType: RaceType.KEIRIN,
                    expectCallCount: 5,
                },
                {
                    raceType: RaceType.AUTORACE,
                    expectCallCount: 7,
                },
                {
                    raceType: RaceType.BOATRACE,
                    expectCallCount: 9,
                },
            ]) {
                // 1年間のレース開催データを登録する
                const raceEntityList: RaceEntity[] = Array.from(
                    { length: 60 },
                    (_, day) => {
                        const date = new Date('2024-01-01');
                        date.setDate(date.getDate() + day);
                        return Array.from({ length: 12 }, (__, j) =>
                            RaceEntity.createWithoutId(
                                RaceData.create(
                                    raceType,
                                    `raceName${format(date, 'yyyyMMdd')}`,
                                    date,
                                    defaultLocation[raceType],
                                    defaultRaceGrade[raceType],
                                    j + 1,
                                ),
                                defaultHeldDayData[raceType],
                                baseConditionData(raceType),
                                defaultStage[raceType],
                                baseRacePlayerDataList(raceType),
                                getJSTDate(new Date()),
                            ),
                        );
                    },
                ).flat();

                // モックの戻り値を設定
                s3Gateway.fetchDataFromS3.mockResolvedValue(
                    fs.readFileSync(
                        path.resolve(
                            __dirname,
                            '../../mock/repository/csv',
                            raceType.toLowerCase(),
                            CSV_FILE_NAME.RACE_LIST,
                        ),
                        'utf8',
                    ),
                );

                // テスト実行
                await (raceType === RaceType.JRA ||
                raceType === RaceType.NAR ||
                raceType === RaceType.OVERSEAS
                    ? horseRacingRaceRepository.registerRaceEntityList(
                          raceType,
                          raceEntityList,
                      )
                    : mechanicalRacingRaceRepository.registerRaceEntityList(
                          raceType,
                          raceEntityList,
                      ));

                expect(s3Gateway.uploadDataToS3).toHaveBeenCalledTimes(
                    expectCallCount,
                );
            }
        });
    });
});
