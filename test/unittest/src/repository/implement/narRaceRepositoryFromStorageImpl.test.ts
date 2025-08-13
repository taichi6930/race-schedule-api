import 'reflect-metadata';

import * as fs from 'node:fs';
import path from 'node:path';

import { format } from 'date-fns';
import { container } from 'tsyringe';

import { HorseRaceConditionData } from '../../../../../lib/src/domain/houseRaceConditionData';
import { RaceData } from '../../../../../lib/src/domain/raceData';
import type { IS3Gateway } from '../../../../../lib/src/gateway/interface/iS3Gateway';
import type { HorseRacingRaceRecord } from '../../../../../lib/src/gateway/record/horseRacingRaceRecord';
import type { HorseRacingPlaceEntity } from '../../../../../lib/src/repository/entity/horseRacingPlaceEntity';
import { HorseRacingRaceEntity } from '../../../../../lib/src/repository/entity/horseRacingRaceEntity';
import { SearchRaceFilterEntity } from '../../../../../lib/src/repository/entity/searchRaceFilterEntity';
import { NarRaceRepositoryFromStorageImpl } from '../../../../../lib/src/repository/implement/narRaceRepositoryFromStorageImpl';
import type { IRaceRepository } from '../../../../../lib/src/repository/interface/IRaceRepository';
import { getJSTDate } from '../../../../../lib/src/utility/date';
import { RaceType } from '../../../../../lib/src/utility/raceType';
import { mockS3Gateway } from '../../mock/gateway/mockS3Gateway';

describe('NarRaceRepositoryFromStorageImpl', () => {
    let s3Gateway: jest.Mocked<IS3Gateway<HorseRacingRaceRecord>>;
    let repository: IRaceRepository<
        HorseRacingRaceEntity,
        HorseRacingPlaceEntity
    >;

    beforeEach(() => {
        // S3Gatewayのモックを作成
        s3Gateway = mockS3Gateway<HorseRacingRaceRecord>();

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
            const csvData = fs.readFileSync(csvFilePath, 'utf8');

            s3Gateway.fetchDataFromS3.mockResolvedValue(csvData);

            // リクエストの作成
            const searchFilter =
                new SearchRaceFilterEntity<HorseRacingPlaceEntity>(
                    new Date('2024-01-01'),
                    new Date('2024-02-01'),
                    RaceType.NAR,
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
            await repository.registerRaceEntityList(
                RaceType.NAR,
                raceEntityList,
            );

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
        const csvData = fs.readFileSync(csvFilePath, 'utf8');

        s3Gateway.fetchDataFromS3.mockResolvedValue(csvData);

        // テスト実行
        await repository.registerRaceEntityList(RaceType.NAR, raceEntityList);

        // uploadDataToS3が366回呼ばれることを検証
        expect(s3Gateway.uploadDataToS3).toHaveBeenCalledTimes(1);
    });

    // 1年間のレース開催データを登録する
    const raceEntityList: HorseRacingRaceEntity[] = Array.from(
        { length: 60 },
        (_, day) => {
            const date = new Date('2024-01-01');
            date.setDate(date.getDate() + day);
            return Array.from({ length: 12 }, (__, j) =>
                HorseRacingRaceEntity.createWithoutId(
                    RaceData.create(
                        RaceType.NAR,
                        `raceName${format(date, 'yyyyMMdd')}`,
                        date,
                        '大井',
                        'GⅠ',
                        j + 1,
                    ),
                    HorseRaceConditionData.create('ダート', 1200),
                    getJSTDate(new Date()),
                ),
            );
        },
    ).flat();
});
