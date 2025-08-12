import 'reflect-metadata';

import * as fs from 'node:fs';
import path from 'node:path';

import { container } from 'tsyringe';

import { HeldDayData } from '../../../../../lib/src/domain/heldDayData';
import { PlaceData } from '../../../../../lib/src/domain/placeData';
import type { IS3Gateway } from '../../../../../lib/src/gateway/interface/iS3Gateway';
import type { JraPlaceRecord } from '../../../../../lib/src/gateway/record/jraPlaceRecord';
import { JraPlaceEntity } from '../../../../../lib/src/repository/entity/jraPlaceEntity';
import { SearchPlaceFilterEntity } from '../../../../../lib/src/repository/entity/searchPlaceFilterEntity';
import { JraPlaceRepositoryFromStorageImpl } from '../../../../../lib/src/repository/implement/jraPlaceRepositoryFromStorageImpl';
import { getJSTDate } from '../../../../../lib/src/utility/date';
import { RaceType } from '../../../../../lib/src/utility/raceType';
import { mockS3Gateway } from '../../mock/gateway/mockS3Gateway';

describe('JraPlaceRepositoryFromStorageImpl', () => {
    let s3Gateway: jest.Mocked<IS3Gateway<JraPlaceRecord>>;
    let repository: JraPlaceRepositoryFromStorageImpl;

    beforeEach(() => {
        // S3Gatewayのモックを作成
        s3Gateway = mockS3Gateway<JraPlaceRecord>();

        // DIコンテナにモックを登録
        container.registerInstance('JraPlaceS3Gateway', s3Gateway);

        // テスト対象のリポジトリを生成
        repository = container.resolve(JraPlaceRepositoryFromStorageImpl);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('fetchPlaceList', () => {
        test('正しい開催場データを取得できる', async () => {
            // モックの戻り値を設定
            const csvFilePath = path.resolve(
                __dirname,
                '../../mock/repository/csv/jra/placeList.csv',
            );
            const csvData = fs.readFileSync(csvFilePath, 'utf8');

            s3Gateway.fetchDataFromS3.mockResolvedValue(csvData);

            // テスト実行
            const placeEntityList = await repository.fetchPlaceEntityList(
                new SearchPlaceFilterEntity(
                    new Date('2024-01-01'),
                    new Date('2024-02-01'),
                    RaceType.JRA,
                ),
            );

            // レスポンスの検証
            expect(placeEntityList).toHaveLength(1);
        });
    });

    describe('registerPlaceList', () => {
        test('正しい開催場データを登録できる', async () => {
            // テスト実行
            await repository.registerPlaceEntityList(
                RaceType.JRA,
                placeEntityList,
            );

            // uploadDataToS3が12回呼ばれることを検証
            expect(s3Gateway.uploadDataToS3).toHaveBeenCalledTimes(1);
        });
    });

    // 1年間の開催場データを登録する
    const placeEntityList: JraPlaceEntity[] = Array.from(
        { length: 60 },
        (_, day) => {
            const date = new Date('2024-01-01');
            date.setDate(date.getDate() + day);
            return Array.from({ length: 12 }, () =>
                JraPlaceEntity.createWithoutId(
                    PlaceData.create(RaceType.JRA, date, '東京'),
                    HeldDayData.create(1, 1),
                    getJSTDate(new Date()),
                ),
            );
        },
    ).flat();
});
