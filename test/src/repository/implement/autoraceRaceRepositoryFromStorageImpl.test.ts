import 'reflect-metadata';

import * as fs from 'node:fs';
import * as path from 'node:path';

import { format } from 'date-fns';
import { container } from 'tsyringe';

import { AutoraceRaceData } from '../../../../lib/src/domain/autoraceRaceData';
import type { IS3Gateway } from '../../../../lib/src/gateway/interface/iS3Gateway';
import type { AutoraceRacePlayerRecord } from '../../../../lib/src/gateway/record/autoraceRacePlayerRecord';
import type { AutoraceRaceRecord } from '../../../../lib/src/gateway/record/autoraceRaceRecord';
import type { AutoracePlaceEntity } from '../../../../lib/src/repository/entity/autoracePlaceEntity';
import { AutoraceRaceEntity } from '../../../../lib/src/repository/entity/autoraceRaceEntity';
import { SearchRaceFilterEntity } from '../../../../lib/src/repository/entity/searchRaceFilterEntity';
import { AutoraceRaceRepositoryFromStorageImpl } from '../../../../lib/src/repository/implement/autoraceRaceRepositoryFromStorageImpl';
import { getJSTDate } from '../../../../lib/src/utility/date';
import { baseAutoraceRacePlayerDataList } from '../../mock/common/baseAutoraceData';
import { mockS3Gateway } from '../../mock/gateway/mockS3Gateway';

describe('AutoraceRaceRepositoryFromStorageImpl', () => {
    let raceS3Gateway: jest.Mocked<IS3Gateway<AutoraceRaceRecord>>;
    let racePlayerS3Gateway: jest.Mocked<IS3Gateway<AutoraceRacePlayerRecord>>;
    let repository: AutoraceRaceRepositoryFromStorageImpl;

    beforeEach(() => {
        // S3Gatewayのモックを作成
        raceS3Gateway = mockS3Gateway<AutoraceRaceRecord>();
        racePlayerS3Gateway = mockS3Gateway<AutoraceRacePlayerRecord>();

        // DIコンテナにモックを登録
        container.registerInstance('AutoraceRaceS3Gateway', raceS3Gateway);
        container.registerInstance(
            'AutoraceRacePlayerS3Gateway',
            racePlayerS3Gateway,
        );

        // テスト対象のリポジトリを生成
        repository = container.resolve(AutoraceRaceRepositoryFromStorageImpl);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('fetchRaceList', () => {
        test('レース開催データを正常に取得できる', async () => {
            // モックの戻り値を設定
            const csvFilePath = path.resolve(
                __dirname,
                '../../mock/repository/csv/autorace/raceList.csv',
            );
            const csvData = fs.readFileSync(csvFilePath, 'utf-8');

            raceS3Gateway.fetchDataFromS3.mockResolvedValue(csvData);

            // モックの戻り値を設定
            racePlayerS3Gateway.fetchDataFromS3.mockResolvedValue(
                fs.readFileSync(
                    path.resolve(
                        __dirname,
                        '../../mock/repository/csv/autorace/racePlayerList.csv',
                    ),
                    'utf-8',
                ),
            );

            // リクエストの作成
            const searchFilter =
                new SearchRaceFilterEntity<AutoracePlaceEntity>(
                    new Date('2024-01-01'),
                    new Date('2024-02-01'),
                );
            // テスト実行
            const raceEntityList =
                await repository.fetchRaceEntityList(searchFilter);

            // レスポンスの検証
            expect(raceEntityList).toHaveLength(1);
        });
    });

    describe('registerRaceList', () => {
        test('DBが空データのところに、正しいレース開催データを登録できる', async () => {
            // 1年間のレース開催データを登録する
            const raceEntityList: AutoraceRaceEntity[] = Array.from(
                { length: 60 },
                (_, day) => {
                    const date = new Date('2024-01-01');
                    date.setDate(date.getDate() + day);
                    return Array.from({ length: 12 }, (__, j) =>
                        AutoraceRaceEntity.createWithoutId(
                            AutoraceRaceData.create(
                                `raceName${format(date, 'yyyyMMdd')}`,
                                `優勝戦`,
                                date,
                                '飯塚',
                                'GⅠ',
                                j + 1,
                            ),
                            baseAutoraceRacePlayerDataList,
                            getJSTDate(new Date()),
                        ),
                    );
                },
            ).flat();

            // テスト実行
            await repository.registerRaceEntityList(raceEntityList);

            // uploadDataToS3が1回呼ばれることを検証
            expect(raceS3Gateway.uploadDataToS3).toHaveBeenCalledTimes(1);
        });
    });

    test('DBにデータの存在するところに、正しいレース開催データを登録できる', async () => {
        // 1年間のレース開催データを登録する
        const raceEntityList: AutoraceRaceEntity[] = Array.from(
            { length: 60 },
            (_, day) => {
                const date = new Date('2024-01-01');
                date.setDate(date.getDate() + day);
                return Array.from({ length: 12 }, (__, j) =>
                    AutoraceRaceEntity.createWithoutId(
                        AutoraceRaceData.create(
                            `raceName${format(date, 'yyyyMMdd')}`,
                            `優勝戦`,
                            date,
                            '飯塚',
                            'GⅠ',
                            j + 1,
                        ),
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
        const csvData = fs.readFileSync(csvFilePath, 'utf-8');

        raceS3Gateway.fetchDataFromS3.mockResolvedValue(csvData);

        // モックの戻り値を設定
        racePlayerS3Gateway.fetchDataFromS3.mockResolvedValue(
            fs.readFileSync(
                path.resolve(
                    __dirname,
                    '../../mock/repository/csv/autorace/racePlayerList.csv',
                ),
                'utf-8',
            ),
        );

        // テスト実行
        await repository.registerRaceEntityList(raceEntityList);

        // uploadDataToS3が1回呼ばれることを検証
        expect(raceS3Gateway.uploadDataToS3).toHaveBeenCalledTimes(1);
    });
});
