import 'reflect-metadata';

import * as fs from 'node:fs';
import path from 'node:path';

import { format } from 'date-fns';
import { container } from 'tsyringe';

import { RaceData } from '../../../../../lib/src/domain/raceData';
import type { IS3Gateway } from '../../../../../lib/src/gateway/interface/iS3Gateway';
import type { MechanicalRacingRaceRecord } from '../../../../../lib/src/gateway/record/mechanicalRacingRaceRecord';
import type { RacePlayerRecord } from '../../../../../lib/src/gateway/record/racePlayerRecord';
import type { MechanicalRacingPlaceEntity } from '../../../../../lib/src/repository/entity/mechanicalRacingPlaceEntity';
import { MechanicalRacingRaceEntity } from '../../../../../lib/src/repository/entity/mechanicalRacingRaceEntity';
import { SearchRaceFilterEntity } from '../../../../../lib/src/repository/entity/searchRaceFilterEntity';
import { MechanicalRacingRaceRepositoryFromStorageImpl } from '../../../../../lib/src/repository/implement/mechanicalRacingRaceRepositoryFromStorageImpl';
import type { IRaceRepository } from '../../../../../lib/src/repository/interface/IRaceRepository';
import { getJSTDate } from '../../../../../lib/src/utility/date';
import { RaceType } from '../../../../../lib/src/utility/raceType';
import type { TestSetup } from '../../../../utility/testSetupHelper';
import { setupTestMock } from '../../../../utility/testSetupHelper';
import { baseAutoraceRacePlayerDataList } from '../../mock/common/baseAutoraceData';

describe('MechanicalRacingRaceRepositoryFromStorageImpl', () => {
    let raceS3GatewayForKeirin: jest.Mocked<
        IS3Gateway<MechanicalRacingRaceRecord>
    >;
    let racePlayerS3GatewayForKeirin: jest.Mocked<IS3Gateway<RacePlayerRecord>>;
    let raceS3GatewayForAutorace: jest.Mocked<
        IS3Gateway<MechanicalRacingRaceRecord>
    >;
    let racePlayerS3GatewayForAutorace: jest.Mocked<
        IS3Gateway<RacePlayerRecord>
    >;
    let raceS3GatewayForBoatrace: jest.Mocked<
        IS3Gateway<MechanicalRacingRaceRecord>
    >;
    let racePlayerS3GatewayForBoatrace: jest.Mocked<
        IS3Gateway<RacePlayerRecord>
    >;
    let repository: IRaceRepository<
        MechanicalRacingRaceEntity,
        MechanicalRacingPlaceEntity
    >;

    beforeEach(() => {
        const setup: TestSetup = setupTestMock();
        ({
            raceS3GatewayForKeirin,
            racePlayerS3GatewayForKeirin,
            raceS3GatewayForAutorace,
            racePlayerS3GatewayForAutorace,
            raceS3GatewayForBoatrace,
            racePlayerS3GatewayForBoatrace,
        } = setup);

        // テスト対象のリポジトリを生成
        repository = container.resolve(
            MechanicalRacingRaceRepositoryFromStorageImpl,
        );
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('fetchRaceList', () => {
        test('レース開催データを正常に取得できる', async () => {
            // モックの戻り値を設定
            raceS3GatewayForKeirin.fetchDataFromS3.mockResolvedValue(
                fs.readFileSync(
                    path.resolve(
                        __dirname,
                        '../../mock/repository/csv/keirin/raceList.csv',
                    ),
                    'utf8',
                ),
            );
            raceS3GatewayForAutorace.fetchDataFromS3.mockResolvedValue(
                fs.readFileSync(
                    path.resolve(
                        __dirname,
                        '../../mock/repository/csv/autorace/raceList.csv',
                    ),
                    'utf8',
                ),
            );
            raceS3GatewayForBoatrace.fetchDataFromS3.mockResolvedValue(
                fs.readFileSync(
                    path.resolve(
                        __dirname,
                        '../../mock/repository/csv/boatrace/raceList.csv',
                    ),
                    'utf8',
                ),
            );

            // モックの戻り値を設定
            racePlayerS3GatewayForKeirin.fetchDataFromS3.mockResolvedValue(
                fs.readFileSync(
                    path.resolve(
                        __dirname,
                        '../../mock/repository/csv/keirin/racePlayerList.csv',
                    ),
                    'utf8',
                ),
            );
            racePlayerS3GatewayForAutorace.fetchDataFromS3.mockResolvedValue(
                fs.readFileSync(
                    path.resolve(
                        __dirname,
                        '../../mock/repository/csv/autorace/racePlayerList.csv',
                    ),
                    'utf8',
                ),
            );
            racePlayerS3GatewayForBoatrace.fetchDataFromS3.mockResolvedValue(
                fs.readFileSync(
                    path.resolve(
                        __dirname,
                        '../../mock/repository/csv/boatrace/racePlayerList.csv',
                    ),
                    'utf8',
                ),
            );

            // テスト実行
            for (const raceType of [
                RaceType.KEIRIN,
                RaceType.AUTORACE,
                RaceType.BOATRACE,
            ]) {
                const raceEntityList = await repository.fetchRaceEntityList(
                    new SearchRaceFilterEntity<MechanicalRacingPlaceEntity>(
                        new Date('2024-01-01'),
                        new Date('2024-02-01'),
                        raceType,
                    ),
                );

                // レスポンスの検証
                expect(raceEntityList).toHaveLength(1);
            }
        });
    });

    describe('registerRaceList', () => {
        test('DBが空データのところに、正しいレース開催データを登録できる', async () => {
            // 1年間のレース開催データを登録する
            const raceEntityList: MechanicalRacingRaceEntity[] = Array.from(
                { length: 60 },
                (_, day) => {
                    const date = new Date('2024-01-01');
                    date.setDate(date.getDate() + day);
                    return Array.from({ length: 12 }, (__, j) =>
                        MechanicalRacingRaceEntity.createWithoutId(
                            RaceData.create(
                                RaceType.AUTORACE,
                                `raceName${format(date, 'yyyyMMdd')}`,
                                date,
                                '飯塚',
                                'GⅠ',
                                j + 1,
                            ),
                            '優勝戦',
                            baseAutoraceRacePlayerDataList,
                            getJSTDate(new Date()),
                        ),
                    );
                },
            ).flat();

            // テスト実行
            await repository.registerRaceEntityList(
                RaceType.AUTORACE,
                raceEntityList,
            );

            // uploadDataToS3が1回呼ばれることを検証
            expect(
                raceS3GatewayForAutorace.uploadDataToS3,
            ).toHaveBeenCalledTimes(1);
        });
    });

    test('DBにデータの存在するところに、正しいレース開催データを登録できる', async () => {
        // 1年間のレース開催データを登録する
        const raceEntityList: MechanicalRacingRaceEntity[] = Array.from(
            { length: 60 },
            (_, day) => {
                const date = new Date('2024-01-01');
                date.setDate(date.getDate() + day);
                return Array.from({ length: 12 }, (__, j) =>
                    MechanicalRacingRaceEntity.createWithoutId(
                        RaceData.create(
                            RaceType.AUTORACE,
                            `raceName${format(date, 'yyyyMMdd')}`,
                            date,
                            '飯塚',
                            'GⅠ',
                            j + 1,
                        ),
                        '優勝戦',
                        baseAutoraceRacePlayerDataList,
                        getJSTDate(new Date()),
                    ),
                );
            },
        ).flat();

        // モックの戻り値を設定
        const csvFilePath = path.resolve(
            __dirname,
            '../../mock/repository/csv/autorace/raceList.csv',
        );
        const csvData = fs.readFileSync(csvFilePath, 'utf8');

        raceS3GatewayForAutorace.fetchDataFromS3.mockResolvedValue(csvData);

        // モックの戻り値を設定
        racePlayerS3GatewayForAutorace.fetchDataFromS3.mockResolvedValue(
            fs.readFileSync(
                path.resolve(
                    __dirname,
                    '../../mock/repository/csv/autorace/racePlayerList.csv',
                ),
                'utf8',
            ),
        );

        // テスト実行
        await repository.registerRaceEntityList(
            RaceType.AUTORACE,
            raceEntityList,
        );

        // uploadDataToS3が1回呼ばれることを検証
        expect(raceS3GatewayForAutorace.uploadDataToS3).toHaveBeenCalledTimes(
            1,
        );
    });
});
