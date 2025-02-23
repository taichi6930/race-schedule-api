import 'reflect-metadata';

import * as fs from 'fs';
import * as path from 'path';
import { container } from 'tsyringe';

import { NarPlaceData } from '../../../../lib/src/domain/narPlaceData';
import type { IS3Gateway } from '../../../../lib/src/gateway/interface/iS3Gateway';
import type { NarPlaceRecord } from '../../../../lib/src/gateway/record/narPlaceRecord';
import { NarPlaceEntity } from '../../../../lib/src/repository/entity/narPlaceEntity';
import { SearchPlaceFilterEntity } from '../../../../lib/src/repository/entity/searchPlaceFilterEntity';
import { NarPlaceRepositoryFromStorageImpl } from '../../../../lib/src/repository/implement/narPlaceRepositoryFromStorageImpl';
import { getJSTDate } from '../../../../lib/src/utility/date';
import { mockS3Gateway } from '../../mock/gateway/mockS3Gateway';

describe('NarPlaceRepositoryFromStorageImpl', () => {
    let s3Gateway: jest.Mocked<IS3Gateway<NarPlaceRecord>>;
    let repository: NarPlaceRepositoryFromStorageImpl;

    beforeEach(() => {
        // S3Gatewayのモックを作成
        s3Gateway = mockS3Gateway<NarPlaceRecord>();

        // DIコンテナにモックを登録
        container.register('NarPlaceS3Gateway', { useValue: s3Gateway });

        // テスト対象のリポジトリを生成
        repository = container.resolve(NarPlaceRepositoryFromStorageImpl);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('fetchPlaceList', () => {
        test('正しい開催場データを取得できる', async () => {
            // モックの戻り値を設定
            const csvFilePath = path.resolve(
                __dirname,
                '../../mock/repository/csv/nar/placeList.csv',
            );
            const csvData = fs.readFileSync(csvFilePath, 'utf-8');

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

            // uploadDataToS3が12回呼ばれることを検証
            expect(s3Gateway.uploadDataToS3).toHaveBeenCalledTimes(1);
        });
    });

    // 1年間の開催場データを登録する
    const placeEntityList: NarPlaceEntity[] = Array.from(
        { length: 366 },
        (_, day) => {
            const date = new Date('2024-01-01');
            date.setDate(date.getDate() + day);
            return Array.from({ length: 12 }, () =>
                NarPlaceEntity.createWithoutId(
                    NarPlaceData.create(date, '大井'),
                    getJSTDate(new Date()),
                ),
            );
        },
    ).flat();
});
