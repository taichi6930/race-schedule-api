import 'reflect-metadata';

import * as fs from 'node:fs';
import path from 'node:path';

import { format } from 'date-fns';
import { container } from 'tsyringe';

import { RaceData } from '../../../../../lib/src/domain/raceData';
import type { IS3Gateway } from '../../../../../lib/src/gateway/interface/iS3Gateway';
import type { PlaceEntity } from '../../../../../lib/src/repository/entity/placeEntity';
import { RaceEntity } from '../../../../../lib/src/repository/entity/raceEntity';
import { SearchRaceFilterEntity } from '../../../../../lib/src/repository/entity/searchRaceFilterEntity';
import { MechanicalRacingRaceRepositoryFromStorageImpl } from '../../../../../lib/src/repository/implement/mechanicalRacingRaceRepositoryFromStorageImpl';
import type { IRaceRepository } from '../../../../../lib/src/repository/interface/IRaceRepository';
import { CSV_FILE_NAME } from '../../../../../lib/src/utility/constants';
import { getJSTDate } from '../../../../../lib/src/utility/date';
import { RaceType } from '../../../../../lib/src/utility/raceType';
import type { TestSetup } from '../../../../utility/testSetupHelper';
import { setupTestMock } from '../../../../utility/testSetupHelper';
import { baseRacePlayerDataList } from '../../mock/common/baseCommonData';

describe('MechanicalRacingRaceRepositoryFromStorageImpl', () => {
    let s3Gateway: jest.Mocked<IS3Gateway>;
    let repository: IRaceRepository<RaceEntity, PlaceEntity>;

    beforeEach(() => {
        const setup: TestSetup = setupTestMock();
        ({ s3Gateway } = setup);

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

            // テスト実行
            for (const raceType of [
                RaceType.KEIRIN,
                RaceType.AUTORACE,
                RaceType.BOATRACE,
            ]) {
                const raceEntityList = await repository.fetchRaceEntityList(
                    new SearchRaceFilterEntity<PlaceEntity>(
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
                    racePlayerDataList: baseRacePlayerDataList(RaceType.KEIRIN),
                },
                {
                    raceType: RaceType.AUTORACE,
                    location: '飯塚',
                    grade: 'GⅠ',
                    stage: '優勝戦',
                    racePlayerDataList: baseRacePlayerDataList(
                        RaceType.AUTORACE,
                    ),
                },
                {
                    raceType: RaceType.BOATRACE,
                    location: '平和島',
                    grade: 'GⅠ',
                    stage: '優勝戦',
                    racePlayerDataList: baseRacePlayerDataList(
                        RaceType.BOATRACE,
                    ),
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
                                    location,
                                    grade,
                                    j + 1,
                                ),
                                undefined, // heldDayDataは未設定
                                undefined, // conditionDataは未設定
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
            expect(s3Gateway.uploadDataToS3).toHaveBeenCalledTimes(6);
        });
    });

    test('DBにデータの存在するところに、正しいレース開催データを登録できる', async () => {
        for (const { raceType, location, grade, stage, racePlayerDataList } of [
            {
                raceType: RaceType.KEIRIN,
                location: '立川',
                grade: 'GⅠ',
                stage: 'S級決勝',
                racePlayerDataList: baseRacePlayerDataList(RaceType.KEIRIN),
            },
            {
                raceType: RaceType.AUTORACE,
                location: '飯塚',
                grade: 'GⅠ',
                stage: '優勝戦',
                racePlayerDataList: baseRacePlayerDataList(RaceType.AUTORACE),
            },
            {
                raceType: RaceType.BOATRACE,
                location: '平和島',
                grade: 'GⅠ',
                stage: '優勝戦',
                racePlayerDataList: baseRacePlayerDataList(RaceType.BOATRACE),
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
                                location,
                                grade,
                                j + 1,
                            ),
                            undefined, // heldDayDataは未設定
                            undefined, // conditionDataは未設定
                            stage,
                            racePlayerDataList,
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
            await repository.registerRaceEntityList(raceType, raceEntityList);
        }
        expect(s3Gateway.uploadDataToS3).toHaveBeenCalledTimes(6);
    });
});
