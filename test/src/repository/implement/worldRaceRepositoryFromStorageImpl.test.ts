import 'reflect-metadata';

import { format } from 'date-fns';
import * as fs from 'fs';
import * as path from 'path';
import { container } from 'tsyringe';

import { WorldRaceData } from '../../../../lib/src/domain/worldRaceData';
import type { IS3Gateway } from '../../../../lib/src/gateway/interface/iS3Gateway';
import type { WorldRaceRecord } from '../../../../lib/src/gateway/record/worldRaceRecord';
import type { WorldPlaceEntity } from '../../../../lib/src/repository/entity/worldPlaceEntity';
import { WorldRaceEntity } from '../../../../lib/src/repository/entity/worldRaceEntity';
import { WorldRaceRepositoryFromStorageImpl } from '../../../../lib/src/repository/implement/worldRaceRepositoryFromStorageImpl';
import { FetchRaceListRequest } from '../../../../lib/src/repository/request/fetchRaceListRequest';
import { RegisterRaceListRequest } from '../../../../lib/src/repository/request/registerRaceListRequest';
import { getJSTDate } from '../../../../lib/src/utility/date';
import { mockS3Gateway } from '../../mock/gateway/s3GatewayMock';

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

    describe('fetchRaceList', () => {
        test('正しいレースデータを取得できる', async () => {
            // モックの戻り値を設定
            const csvFilePath = path.resolve(
                __dirname,
                '../../mock/repository/csv/world/raceList.csv',
            );
            const csvData = fs.readFileSync(csvFilePath, 'utf-8');

            s3Gateway.fetchDataFromS3.mockResolvedValue(csvData);

            // リクエストの作成
            const request = new FetchRaceListRequest<WorldPlaceEntity>(
                new Date('2024-01-01'),
                new Date('2024-02-01'),
            );
            // テスト実行
            const response = await repository.fetchRaceEntityList(request);

            // レスポンスの検証
            expect(response.raceEntityList).toHaveLength(1);
        });
    });

    describe('registerRaceList', () => {
        test('正しいレースデータを登録できる（既存データあり）', async () => {
            // モックの戻り値を設定
            const csvFilePath = path.resolve(
                __dirname,
                '../../mock/repository/csv/world/raceList.csv',
            );
            const csvData = fs.readFileSync(csvFilePath, 'utf-8');

            s3Gateway.fetchDataFromS3.mockResolvedValue(csvData);

            // リクエストの作成
            const request = new RegisterRaceListRequest<WorldRaceEntity>(
                raceEntityList,
            );
            // テスト実行
            await repository.registerRaceEntityList(request);

            // uploadDataToS3が1回呼ばれることを検証
            expect(s3Gateway.uploadDataToS3).toHaveBeenCalledTimes(1);
        });

        test('正しいレースデータを登録できる（既存データなし）', async () => {
            // リクエストの作成
            const request = new RegisterRaceListRequest<WorldRaceEntity>(
                raceEntityList,
            );
            // テスト実行
            await repository.registerRaceEntityList(request);

            // uploadDataToS3が1回呼ばれることを検証
            expect(s3Gateway.uploadDataToS3).toHaveBeenCalledTimes(1);
        });
    });

    // 1年間のレースデータを登録する
    const raceEntityList: WorldRaceEntity[] = Array.from(
        { length: 366 },
        (_, day) => {
            const date = new Date('2024-01-01');
            date.setDate(date.getDate() + day);
            return Array.from(
                { length: 12 },
                (__, j) =>
                    new WorldRaceEntity(
                        null,
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
