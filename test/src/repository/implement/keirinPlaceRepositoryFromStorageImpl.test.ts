import 'reflect-metadata';

import * as fs from 'node:fs';
import path from 'node:path';

import { container } from 'tsyringe';

import { KeirinPlaceData } from '../../../../lib/src/domain/keirinPlaceData';
import type { IS3Gateway } from '../../../../lib/src/gateway/interface/iS3Gateway';
import type { KeirinPlaceRecord } from '../../../../lib/src/gateway/record/keirinPlaceRecord';
import { KeirinPlaceEntity } from '../../../../lib/src/repository/entity/keirinPlaceEntity';
import { SearchPlaceFilterEntity } from '../../../../lib/src/repository/entity/searchPlaceFilterEntity';
import { KeirinPlaceRepositoryFromStorageImpl } from '../../../../lib/src/repository/implement/keirinPlaceRepositoryFromStorageImpl';
import { getJSTDate } from '../../../../lib/src/utility/date';
import { mockS3Gateway } from '../../mock/gateway/mockS3Gateway';

describe('KeirinPlaceRepositoryFromStorageImpl', () => {
    let s3Gateway: jest.Mocked<IS3Gateway<KeirinPlaceRecord>>;
    let repository: KeirinPlaceRepositoryFromStorageImpl;

    beforeEach(() => {
        // S3Gatewayのモックを作成
        s3Gateway = mockS3Gateway<KeirinPlaceRecord>();

        // DIコンテナにモックを登録
        container.registerInstance('KeirinPlaceS3Gateway', s3Gateway);

        // テスト対象のリポジトリを生成
        repository = container.resolve(KeirinPlaceRepositoryFromStorageImpl);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('fetchPlaceList', () => {
        test('正しい開催場データを取得できる', async () => {
            // モックの戻り値を設定
            const csvFilePath = path.resolve(
                __dirname,
                '../../mock/repository/csv/keirin/placeList.csv',
            );
            const csvData = fs.readFileSync(csvFilePath, 'utf8');

            s3Gateway.fetchDataFromS3.mockResolvedValue(csvData);

            // テスト実行
            const placeEntityList = await repository.fetchPlaceEntityList(
                new SearchPlaceFilterEntity(
                    new Date('2024-01-01'),
                    new Date('2024-02-01'),
                ),
            );

            // レスポンスの検証
            expect(placeEntityList).toHaveLength(1);
        });
    });

    describe('registerPlaceList', () => {
        test('正しい開催場データを登録できる', async () => {
            // テスト実行
            await repository.registerPlaceEntityList(placeEntityList);

            // uploadDataToS3が1回呼ばれることを検証
            expect(s3Gateway.uploadDataToS3).toHaveBeenCalledTimes(1);
        });
    });

    // 1年間の開催場データを登録する
    const placeEntityList: KeirinPlaceEntity[] = Array.from(
        { length: 60 },
        (_, day) => {
            const date = new Date('2024-01-01');
            date.setDate(date.getDate() + day);
            return Array.from({ length: 12 }, () =>
                KeirinPlaceEntity.createWithoutId(
                    KeirinPlaceData.create(date, '平塚', 'GP'),
                    getJSTDate(new Date()),
                ),
            );
        },
    ).flat();
});
