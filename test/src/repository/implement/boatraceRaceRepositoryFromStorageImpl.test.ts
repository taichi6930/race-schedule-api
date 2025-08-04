import 'reflect-metadata';

import * as fs from 'node:fs';
import path from 'node:path';

import { format } from 'date-fns';
import { container } from 'tsyringe';

import { BoatraceRaceData } from '../../../../lib/src/domain/boatraceRaceData';
import type { IS3Gateway } from '../../../../lib/src/gateway/interface/iS3Gateway';
import type { BoatraceRaceRecord } from '../../../../lib/src/gateway/record/boatraceRaceRecord';
import type { RacePlayerRecord } from '../../../../lib/src/gateway/record/racePlayerRecord';
import { BoatraceRaceEntity } from '../../../../lib/src/repository/entity/boatraceRaceEntity';
import type { PlaceEntity } from '../../../../lib/src/repository/entity/placeEntity';
import { SearchRaceFilterEntity } from '../../../../lib/src/repository/entity/searchRaceFilterEntity';
import { BoatraceRaceRepositoryFromStorageImpl } from '../../../../lib/src/repository/implement/boatraceRaceRepositoryFromStorageImpl';
import { getJSTDate } from '../../../../lib/src/utility/date';
import { baseBoatraceRacePlayerDataList } from '../../mock/common/baseBoatraceData';
import { mockS3Gateway } from '../../mock/gateway/mockS3Gateway';

describe('BoatraceRaceRepositoryFromStorageImpl', () => {
    let raceS3Gateway: jest.Mocked<IS3Gateway<BoatraceRaceRecord>>;
    let racePlayerS3Gateway: jest.Mocked<IS3Gateway<RacePlayerRecord>>;
    let repository: BoatraceRaceRepositoryFromStorageImpl;

    beforeEach(() => {
        // S3Gatewayのモックを作成
        raceS3Gateway = mockS3Gateway<BoatraceRaceRecord>();
        racePlayerS3Gateway = mockS3Gateway<RacePlayerRecord>();

        // DIコンテナにモックを登録
        container.registerInstance('BoatraceRaceS3Gateway', raceS3Gateway);
        container.registerInstance(
            'BoatraceRacePlayerS3Gateway',
            racePlayerS3Gateway,
        );

        // テスト対象のリポジトリを生成
        repository = container.resolve(BoatraceRaceRepositoryFromStorageImpl);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('fetchRaceList', () => {
        test('レース開催データを正常に取得できる', async () => {
            // モックの戻り値を設定
            const csvFilePath = path.resolve(
                __dirname,
                '../../mock/repository/csv/boatrace/raceList.csv',
            );
            const csvData = fs.readFileSync(csvFilePath, 'utf8');

            raceS3Gateway.fetchDataFromS3.mockResolvedValue(csvData);

            // モックの戻り値を設定
            racePlayerS3Gateway.fetchDataFromS3.mockResolvedValue(
                fs.readFileSync(
                    path.resolve(
                        __dirname,
                        '../../mock/repository/csv/boatrace/racePlayerList.csv',
                    ),
                    'utf8',
                ),
            );

            // リクエストの作成
            const searchFilter = new SearchRaceFilterEntity<PlaceEntity>(
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
            // 1年間のレース開催データを登録する
            const raceEntityList: BoatraceRaceEntity[] = Array.from(
                { length: 60 },
                (_, day) => {
                    const date = new Date('2024-01-01');
                    date.setDate(date.getDate() + day);
                    return Array.from({ length: 12 }, (__, j) =>
                        BoatraceRaceEntity.createWithoutId(
                            BoatraceRaceData.create(
                                `raceName${format(date, 'yyyyMMdd')}`,
                                `優勝戦`,
                                date,
                                '平和島',
                                'GⅠ',
                                j + 1,
                            ),
                            baseBoatraceRacePlayerDataList,
                            getJSTDate(new Date()),
                        ),
                    );
                },
            ).flat();

            // テスト実行
            await repository.registerRaceEntityList(raceEntityList);

            // uploadDataToS3が1回呼ばれることを検証
            expect(raceS3Gateway.uploadDataToS3).toHaveBeenCalledTimes(1);
        });
    });

    test('DBにデータの存在するところに、正しいレース開催データを登録できる', async () => {
        // 1年間のレース開催データを登録する
        const raceEntityList: BoatraceRaceEntity[] = Array.from(
            { length: 60 },
            (_, day) => {
                const date = new Date('2024-01-01');
                date.setDate(date.getDate() + day);
                return Array.from({ length: 12 }, (__, j) =>
                    BoatraceRaceEntity.createWithoutId(
                        BoatraceRaceData.create(
                            `raceName${format(date, 'yyyyMMdd')}`,
                            `優勝戦`,
                            date,
                            '平和島',
                            'GⅠ',
                            j + 1,
                        ),
                        baseBoatraceRacePlayerDataList,
                        getJSTDate(new Date()),
                    ),
                );
            },
        ).flat();

        // モックの戻り値を設定
        const csvFilePath = path.resolve(
            __dirname,
            '../../mock/repository/csv/boatrace/raceList.csv',
        );
        const csvData = fs.readFileSync(csvFilePath, 'utf8');

        raceS3Gateway.fetchDataFromS3.mockResolvedValue(csvData);

        // モックの戻り値を設定
        racePlayerS3Gateway.fetchDataFromS3.mockResolvedValue(
            fs.readFileSync(
                path.resolve(
                    __dirname,
                    '../../mock/repository/csv/boatrace/racePlayerList.csv',
                ),
                'utf8',
            ),
        );

        // テスト実行
        await repository.registerRaceEntityList(raceEntityList);

        // uploadDataToS3が1回呼ばれることを検証
        expect(raceS3Gateway.uploadDataToS3).toHaveBeenCalledTimes(1);
    });
});
