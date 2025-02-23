import 'reflect-metadata';

import { format } from 'date-fns';
import * as fs from 'fs';
import * as path from 'path';
import { container } from 'tsyringe';

import { NarRaceData } from '../../../../lib/src/domain/narRaceData';
import type { IS3Gateway } from '../../../../lib/src/gateway/interface/iS3Gateway';
import type { NarRaceRecord } from '../../../../lib/src/gateway/record/narRaceRecord';
import type { NarPlaceEntity } from '../../../../lib/src/repository/entity/narPlaceEntity';
import { NarRaceEntity } from '../../../../lib/src/repository/entity/narRaceEntity';
import { SearchRaceFilterEntity } from '../../../../lib/src/repository/entity/searchRaceFilterEntity';
import { NarRaceRepositoryFromStorageImpl } from '../../../../lib/src/repository/implement/narRaceRepositoryFromStorageImpl';
import { getJSTDate } from '../../../../lib/src/utility/date';
import { mockS3Gateway } from '../../mock/gateway/mockS3Gateway';

describe('NarRaceRepositoryFromStorageImpl', () => {
    let s3Gateway: jest.Mocked<IS3Gateway<NarRaceRecord>>;
    let repository: NarRaceRepositoryFromStorageImpl;

    beforeEach(() => {
        // S3Gatewayのモックを作成
        s3Gateway = mockS3Gateway<NarRaceRecord>();

        // DIコンテナにモックを登録
        container.registerInstance('NarRaceS3Gateway', s3Gateway);

        // テスト対象のリポジトリを生成
        repository = container.resolve(NarRaceRepositoryFromStorageImpl);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('fetchRaceList', () => {
        test('正しいレース開催データを取得できる', async () => {
            // モックの戻り値を設定
            const csvFilePath = path.resolve(
                __dirname,
                '../../mock/repository/csv/nar/raceList.csv',
            );
            const csvData = fs.readFileSync(csvFilePath, 'utf-8');

            s3Gateway.fetchDataFromS3.mockResolvedValue(csvData);

            // リクエストの作成
            const searchFilter = new SearchRaceFilterEntity<NarPlaceEntity>(
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
            // テスト実行
            await repository.registerRaceEntityList(raceEntityList);

            // uploadDataToS3が366回呼ばれることを検証
            expect(s3Gateway.uploadDataToS3).toHaveBeenCalledTimes(1);
        });
    });

    test('DBにデータの存在するところに、正しいレース開催データを登録できる', async () => {
        // モックの戻り値を設定
        const csvFilePath = path.resolve(
            __dirname,
            '../../mock/repository/csv/nar/raceList.csv',
        );
        const csvData = fs.readFileSync(csvFilePath, 'utf-8');

        s3Gateway.fetchDataFromS3.mockResolvedValue(csvData);

        // テスト実行
        await repository.registerRaceEntityList(raceEntityList);

        // uploadDataToS3が366回呼ばれることを検証
        expect(s3Gateway.uploadDataToS3).toHaveBeenCalledTimes(1);
    });

    // 1年間のレース開催データを登録する
    const raceEntityList: NarRaceEntity[] = Array.from(
        { length: 366 },
        (_, day) => {
            const date = new Date('2024-01-01');
            date.setDate(date.getDate() + day);
            return Array.from({ length: 12 }, (__, j) =>
                NarRaceEntity.createWithoutId(
                    NarRaceData.create(
                        `raceName${format(date, 'yyyyMMdd')}`,
                        date,
                        '大井',
                        'ダート',
                        1200,
                        'GⅠ',
                        j + 1,
                    ),
                    getJSTDate(new Date()),
                ),
            );
        },
    ).flat();
});
