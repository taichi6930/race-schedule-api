import 'reflect-metadata';

import * as fs from 'node:fs';
import path from 'node:path';

import { container } from 'tsyringe';

import { PlaceData } from '../../../../lib/src/domain/placeData';
import type { IS3Gateway } from '../../../../lib/src/gateway/interface/iS3Gateway';
import type { BoatracePlaceRecord } from '../../../../lib/src/gateway/record/boatracePlaceRecord';
import { PlaceEntity } from '../../../../lib/src/repository/entity/placeEntity';
import { SearchPlaceFilterEntity } from '../../../../lib/src/repository/entity/searchPlaceFilterEntity';
import { BoatracePlaceRepositoryFromStorageImpl } from '../../../../lib/src/repository/implement/boatracePlaceRepositoryFromStorageImpl';
import { getJSTDate } from '../../../../lib/src/utility/date';
import { RaceType } from '../../../../lib/src/utility/raceType';
import { mockS3Gateway } from '../../mock/gateway/mockS3Gateway';

describe('BoatracePlaceRepositoryFromStorageImpl', () => {
    let s3Gateway: jest.Mocked<IS3Gateway<BoatracePlaceRecord>>;
    let repository: BoatracePlaceRepositoryFromStorageImpl;

    beforeEach(() => {
        // S3Gatewayのモックを作成
        s3Gateway = mockS3Gateway<BoatracePlaceRecord>();

        // DIコンテナにモックを登録
        container.registerInstance('BoatracePlaceS3Gateway', s3Gateway);

        // テスト対象のリポジトリを生成
        repository = container.resolve(BoatracePlaceRepositoryFromStorageImpl);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('fetchPlaceList', () => {
        test('正しい開催場データを取得できる', async () => {
            // モックの戻り値を設定
            const csvFilePath = path.resolve(
                __dirname,
                '../../mock/repository/csv/boatrace/placeList.csv',
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
    const placeEntityList: PlaceEntity[] = Array.from(
        { length: 10 },
        (_, day) => {
            const date = new Date('2024-01-01');
            date.setDate(date.getDate() + day);
            return Array.from({ length: 12 }, () =>
                PlaceEntity.createWithoutId(
                    RaceType.BOATRACE,
                    PlaceData.create(RaceType.BOATRACE, date, '平和島', 'SG'),
                    getJSTDate(new Date()),
                ),
            );
        },
    ).flat();
});
