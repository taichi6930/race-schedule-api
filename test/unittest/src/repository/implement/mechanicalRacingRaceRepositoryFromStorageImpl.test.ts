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
import { baseBoatraceRacePlayerDataList } from '../../mock/common/baseBoatraceData';
import { baseKeirinRacePlayerDataList } from '../../mock/common/baseKeirinData';

describe('MechanicalRacingRaceRepositoryFromStorageImpl', () => {
    let mechanicalRacingRaceS3Gateway: jest.Mocked<
        IS3Gateway<MechanicalRacingRaceRecord>
    >;
    let mechanicalRacingRacePlayerS3Gateway: jest.Mocked<
        IS3Gateway<RacePlayerRecord>
    >;
    let repository: IRaceRepository<
        MechanicalRacingRaceEntity,
        MechanicalRacingPlaceEntity
    >;

    beforeEach(() => {
        const setup: TestSetup = setupTestMock();
        ({
            mechanicalRacingRaceS3Gateway,
            mechanicalRacingRacePlayerS3Gateway,
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
            mechanicalRacingRaceS3Gateway.fetchDataFromS3.mockImplementation(
                async (bucketName, fileName) => {
                    return fs.readFileSync(
                        path.resolve(
                            __dirname,
                            `../../mock/repository/csv/${bucketName}${fileName}`,
                        ),
                        'utf8',
                    );
                },
            );

            // モックの戻り値を設定
            mechanicalRacingRacePlayerS3Gateway.fetchDataFromS3.mockImplementation(
                async (bucketName, fileName) => {
                    return fs.readFileSync(
                        path.resolve(
                            __dirname,
                            `../../mock/repository/csv/${bucketName}${fileName}`,
                        ),
                        'utf8',
                    );
                },
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
            for (const {
                raceType,
                location,
                grade,
                stage,
                racePlayerDataList,
            } of [
                {
                    raceType: RaceType.KEIRIN,
                    location: '立川',
                    grade: 'GⅠ',
                    stage: 'S級決勝',
                    racePlayerDataList: baseKeirinRacePlayerDataList,
                },
                {
                    raceType: RaceType.AUTORACE,
                    location: '飯塚',
                    grade: 'GⅠ',
                    stage: '優勝戦',
                    racePlayerDataList: baseAutoraceRacePlayerDataList,
                },
                {
                    raceType: RaceType.BOATRACE,
                    location: '平和島',
                    grade: 'GⅠ',
                    stage: '優勝戦',
                    racePlayerDataList: baseBoatraceRacePlayerDataList,
                },
            ]) {
                // 1年間のレース開催データを登録する
                const raceEntityList: MechanicalRacingRaceEntity[] = Array.from(
                    { length: 60 },
                    (_, day) => {
                        const date = new Date('2024-01-01');
                        date.setDate(date.getDate() + day);
                        return Array.from({ length: 12 }, (__, j) =>
                            MechanicalRacingRaceEntity.createWithoutId(
                                RaceData.create(
                                    raceType,
                                    `raceName${format(date, 'yyyyMMdd')}`,
                                    date,
                                    location,
                                    grade,
                                    j + 1,
                                ),
                                stage,
                                racePlayerDataList,
                                getJSTDate(new Date()),
                            ),
                        );
                    },
                ).flat();

                // テスト実行
                await repository.registerRaceEntityList(
                    raceType,
                    raceEntityList,
                );
            }
            expect(
                mechanicalRacingRaceS3Gateway.uploadDataToS3,
            ).toHaveBeenCalledTimes(3);
        });
    });

    test('DBにデータの存在するところに、正しいレース開催データを登録できる', async () => {
        for (const { raceType, location, grade, stage, racePlayerDataList } of [
            {
                raceType: RaceType.KEIRIN,
                location: '立川',
                grade: 'GⅠ',
                stage: 'S級決勝',
                racePlayerDataList: baseKeirinRacePlayerDataList,
            },
            {
                raceType: RaceType.AUTORACE,
                location: '飯塚',
                grade: 'GⅠ',
                stage: '優勝戦',
                racePlayerDataList: baseAutoraceRacePlayerDataList,
            },
            {
                raceType: RaceType.BOATRACE,
                location: '平和島',
                grade: 'GⅠ',
                stage: '優勝戦',
                racePlayerDataList: baseBoatraceRacePlayerDataList,
            },
        ]) {
            // 1年間のレース開催データを登録する
            const raceEntityList: MechanicalRacingRaceEntity[] = Array.from(
                { length: 60 },
                (_, day) => {
                    const date = new Date('2024-01-01');
                    date.setDate(date.getDate() + day);
                    return Array.from({ length: 12 }, (__, j) =>
                        MechanicalRacingRaceEntity.createWithoutId(
                            RaceData.create(
                                raceType,
                                `raceName${format(date, 'yyyyMMdd')}`,
                                date,
                                location,
                                grade,
                                j + 1,
                            ),
                            stage,
                            racePlayerDataList,
                            getJSTDate(new Date()),
                        ),
                    );
                },
            ).flat();

            // モックの戻り値を設定
            mechanicalRacingRaceS3Gateway.fetchDataFromS3.mockResolvedValue(
                fs.readFileSync(
                    path.resolve(
                        __dirname,
                        `../../mock/repository/csv/${raceType.toLowerCase()}/raceList.csv`,
                    ),
                    'utf8',
                ),
            );

            // モックの戻り値を設定
            mechanicalRacingRacePlayerS3Gateway.fetchDataFromS3.mockResolvedValue(
                fs.readFileSync(
                    path.resolve(
                        __dirname,
                        `../../mock/repository/csv/${raceType.toLowerCase()}/racePlayerList.csv`,
                    ),
                    'utf8',
                ),
            );

            // テスト実行
            await repository.registerRaceEntityList(raceType, raceEntityList);
        }
        expect(
            mechanicalRacingRaceS3Gateway.uploadDataToS3,
        ).toHaveBeenCalledTimes(3);
        expect(
            mechanicalRacingRacePlayerS3Gateway.uploadDataToS3,
        ).toHaveBeenCalledTimes(3);
    });
});
