import 'reflect-metadata';

import * as fs from 'node:fs';
import path from 'node:path';

import { container } from 'tsyringe';

import { HeldDayData } from '../../../../../lib/src/domain/heldDayData';
import { PlaceData } from '../../../../../lib/src/domain/placeData';
import type { IS3Gateway } from '../../../../../lib/src/gateway/interface/iS3Gateway';
import type { heldDayRecord } from '../../../../../lib/src/gateway/record/heldDayRecord';
import type { HorseRacingPlaceRecord } from '../../../../../lib/src/gateway/record/horseRacingPlaceRecord';
import { JraPlaceEntity } from '../../../../../lib/src/repository/entity/jraPlaceEntity';
import { SearchPlaceFilterEntity } from '../../../../../lib/src/repository/entity/searchPlaceFilterEntity';
import { JraPlaceRepositoryFromStorageImpl } from '../../../../../lib/src/repository/implement/jraPlaceRepositoryFromStorageImpl';
import type { IPlaceRepository } from '../../../../../lib/src/repository/interface/IPlaceRepository';
import { getJSTDate } from '../../../../../lib/src/utility/date';
import { RaceType } from '../../../../../lib/src/utility/raceType';
import { mockS3Gateway } from '../../mock/gateway/mockS3Gateway';

describe('JraPlaceRepositoryFromStorageImpl', () => {
    let placeS3Gateway: jest.Mocked<IS3Gateway<HorseRacingPlaceRecord>>;
    let heldDayS3Gateway: jest.Mocked<IS3Gateway<heldDayRecord>>;
    let repository: IPlaceRepository<JraPlaceEntity>;

    const raceType: RaceType = RaceType.JRA;

    beforeEach(() => {
        // S3Gatewayのモックを作成
        placeS3Gateway = mockS3Gateway<HorseRacingPlaceRecord>();
        heldDayS3Gateway = mockS3Gateway<heldDayRecord>();

        // DIコンテナにモックを登録
        container.registerInstance('JraPlaceS3Gateway', placeS3Gateway);
        container.registerInstance('JraHeldDayS3Gateway', heldDayS3Gateway);

        // テスト対象のリポジトリを生成
        repository = container.resolve(JraPlaceRepositoryFromStorageImpl);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('fetchPlaceList', () => {
        test('正しい開催場データを取得できる', async () => {
            // モックの戻り値を設定
            placeS3Gateway.fetchDataFromS3.mockResolvedValue(
                fs.readFileSync(
                    path.resolve(
                        __dirname,
                        '../../mock/repository/csv/jra/placeList.csv',
                    ),
                    'utf8',
                ),
            );
            heldDayS3Gateway.fetchDataFromS3.mockResolvedValue(
                fs.readFileSync(
                    path.resolve(
                        __dirname,
                        '../../mock/repository/csv/jra/heldDayList.csv',
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
            expect(heldDayS3Gateway.uploadDataToS3).toHaveBeenCalledTimes(1);
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
                    raceType,
                    PlaceData.create(raceType, date, '東京'),
                    HeldDayData.create(1, 1),
                    getJSTDate(new Date()),
                ),
            );
        },
    ).flat();
});
