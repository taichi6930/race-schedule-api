import 'reflect-metadata';

import * as fs from 'node:fs';
import * as path from 'node:path';

import { format } from 'date-fns';
import { container } from 'tsyringe';

import { WorldRaceData } from '../../../../lib/src/domain/worldRaceData';
import type { IS3Gateway } from '../../../../lib/src/gateway/interface/iS3Gateway';
import type { WorldRaceRecord } from '../../../../lib/src/gateway/record/worldRaceRecord';
import { SearchRaceFilterEntity } from '../../../../lib/src/repository/entity/searchRaceFilterEntity';
import type { WorldPlaceEntity } from '../../../../lib/src/repository/entity/worldPlaceEntity';
import { WorldRaceEntity } from '../../../../lib/src/repository/entity/worldRaceEntity';
import { WorldRaceRepositoryFromStorageImpl } from '../../../../lib/src/repository/implement/worldRaceRepositoryFromStorageImpl';
import { getJSTDate } from '../../../../lib/src/utility/date';
import { mockS3Gateway } from '../../mock/gateway/mockS3Gateway';

describe('WorldRaceRepositoryFromStorageImpl', () => {
    let s3Gateway: jest.Mocked<IS3Gateway<WorldRaceRecord>>;
    let repository: WorldRaceRepositoryFromStorageImpl;

    beforeEach(() => {
        // S3Gatewayのモックを作成
        s3Gateway = mockS3Gateway<WorldRaceRecord>();

        // DIコンテナにモックを登録
        container.registerInstance('WorldRaceS3Gateway', s3Gateway);

        // テスト対象のリポジトリを生成
        repository = container.resolve(WorldRaceRepositoryFromStorageImpl);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('fetchRaceList', () => {
        test('正しいレース開催データを取得できる', async () => {
            // モックの戻り値を設定
            const csvFilePath = path.resolve(
                __dirname,
                '../../mock/repository/csv/world/raceList.csv',
            );
            const csvData = fs.readFileSync(csvFilePath, 'utf8');

            s3Gateway.fetchDataFromS3.mockResolvedValue(csvData);

            // リクエストの作成
            const searchFilter = new SearchRaceFilterEntity<WorldPlaceEntity>(
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
        test('正しいレース開催データを登録できる（既存データあり）', async () => {
            // モックの戻り値を設定
            const csvFilePath = path.resolve(
                __dirname,
                '../../mock/repository/csv/world/raceList.csv',
            );
            const csvData = fs.readFileSync(csvFilePath, 'utf8');

            s3Gateway.fetchDataFromS3.mockResolvedValue(csvData);

            // テスト実行
            await repository.registerRaceEntityList(raceEntityList);

            // uploadDataToS3が1回呼ばれることを検証
            expect(s3Gateway.uploadDataToS3).toHaveBeenCalledTimes(1);
        });

        test('正しいレース開催データを登録できる（既存データなし）', async () => {
            // テスト実行
            await repository.registerRaceEntityList(raceEntityList);

            // uploadDataToS3が1回呼ばれることを検証
            expect(s3Gateway.uploadDataToS3).toHaveBeenCalledTimes(1);
        });
    });

    // 1年間のレース開催データを登録する
    const raceEntityList: WorldRaceEntity[] = Array.from(
        { length: 60 },
        (_, day) => {
            const date = new Date('2024-01-01');
            date.setDate(date.getDate() + day);
            return Array.from({ length: 12 }, (__, j) =>
                WorldRaceEntity.createWithoutId(
                    WorldRaceData.create(
                        `raceName${format(date, 'yyyyMMdd')}`,
                        date,
                        'パリロンシャン',
                        '芝',
                        2400,
                        'GⅠ',
                        j + 1,
                    ),
                    getJSTDate(new Date()),
                ),
            );
        },
    ).flat();
});
