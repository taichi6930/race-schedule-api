import 'reflect-metadata';

import * as fs from 'node:fs';
import path from 'node:path';

import { container } from 'tsyringe';

import { PlaceData } from '../../../../../lib/src/domain/placeData';
import type { IS3Gateway } from '../../../../../lib/src/gateway/interface/iS3Gateway';
import type { HorseRacingPlaceRecord } from '../../../../../lib/src/gateway/record/horseRacingPlaceRecord';
import { HorseRacingPlaceEntity } from '../../../../../lib/src/repository/entity/horseRacingPlaceEntity';
import { SearchPlaceFilterEntity } from '../../../../../lib/src/repository/entity/searchPlaceFilterEntity';
import { HorseRacingPlaceRepositoryFromStorageImpl } from '../../../../../lib/src/repository/implement/horseRacingPlaceRepositoryFromStorageImpl';
import type { IPlaceRepository } from '../../../../../lib/src/repository/interface/IPlaceRepository';
import { getJSTDate } from '../../../../../lib/src/utility/date';
import { RaceType } from '../../../../../lib/src/utility/raceType';
import { mockS3Gateway } from '../../mock/gateway/mockS3Gateway';

describe('HorseRacingPlaceRepositoryFromStorageImpl', () => {
    let placeS3Gateway: jest.Mocked<IS3Gateway<HorseRacingPlaceRecord>>;
    let repository: IPlaceRepository<HorseRacingPlaceEntity>;

    const raceType: RaceType = RaceType.NAR;

    beforeEach(() => {
        // S3Gatewayのモックを作成
        placeS3Gateway = mockS3Gateway<HorseRacingPlaceRecord>();

        // DIコンテナにモックを登録
        container.registerInstance('NarPlaceS3Gateway', placeS3Gateway);

        // テスト対象のリポジトリを生成
        repository = container.resolve(
            HorseRacingPlaceRepositoryFromStorageImpl,
        );
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('fetchPlaceList', () => {
        test('正しい開催場データを取得できる', async () => {
            placeS3Gateway.fetchDataFromS3.mockResolvedValue(
                fs.readFileSync(
                    path.resolve(
                        __dirname,
                        '../../mock/repository/csv/nar/placeList.csv',
                    ),
                    'utf8',
                ),
            );

            // テスト実行
            const placeEntityList = await repository.fetchPlaceEntityList(
                new SearchPlaceFilterEntity(
                    new Date('2024-01-01'),
                    new Date('2024-02-01'),
                    raceType,
                ),
            );

            // レスポンスの検証
            expect(placeEntityList).toHaveLength(1);
        });
    });

    describe('registerPlaceList', () => {
        test('正しい開催場データを登録できる', async () => {
            // テスト実行
            await expect(
                repository.registerPlaceEntityList(raceType, placeEntityList),
            ).resolves.toEqual({
                code: 200,
                message: 'データの保存に成功しました',
                successData: placeEntityList,
                failureData: [],
            });

            // uploadDataToS3が1回呼ばれることを検証
            expect(placeS3Gateway.uploadDataToS3).toHaveBeenCalledTimes(1);
        });
    });

    // 1年間の開催場データを登録する
    const placeEntityList: HorseRacingPlaceEntity[] = Array.from(
        { length: 60 },
        (_, day) => {
            const date = new Date('2024-01-01');
            date.setDate(date.getDate() + day);
            return Array.from({ length: 12 }, () =>
                HorseRacingPlaceEntity.createWithoutId(
                    PlaceData.create(raceType, date, '大井'),
                    getJSTDate(new Date()),
                ),
            );
        },
    ).flat();
});
