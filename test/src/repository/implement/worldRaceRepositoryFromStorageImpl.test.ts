import 'reflect-metadata';

import { format, parse } from 'date-fns';
import { container } from 'tsyringe';

import type { IS3Gateway } from '../../../../lib/src/gateway/interface/iS3Gateway';
import type { WorldPlaceEntity } from '../../../../lib/src/repository/entity/worldPlaceEntity';
import { WorldRaceEntity } from '../../../../lib/src/repository/entity/worldRaceEntity';
import { WorldRaceRepositoryFromStorageImpl } from '../../../../lib/src/repository/implement/worldRaceRepositoryFromStorageImpl';
import { FetchRaceListRequest } from '../../../../lib/src/repository/request/fetchRaceListRequest';
import { RegisterRaceListRequest } from '../../../../lib/src/repository/request/registerRaceListRequest';
import { WORLD_PLACE_CODE } from '../../../../lib/src/utility/data/world';
import { mockS3GatewayForWorldRace } from '../../mock/gateway/s3GatewayMock';

describe('WorldRaceRepositoryFromStorageImpl', () => {
    let s3Gateway: jest.Mocked<IS3Gateway<WorldRaceEntity>>;
    let repository: WorldRaceRepositoryFromStorageImpl;

    beforeEach(() => {
        // S3Gatewayのモックを作成
        s3Gateway = mockS3GatewayForWorldRace();

        // DIコンテナにモックを登録
        container.registerInstance('WorldRaceS3Gateway', s3Gateway);

        // テスト対象のリポジトリを生成
        repository = container.resolve(WorldRaceRepositoryFromStorageImpl);
    });

    describe('fetchRaceList', () => {
        test('正しいレースデータを取得できる', async () => {
            // モックの戻り値を設定
            s3Gateway.fetchDataFromS3.mockImplementation(
                async (filename: string) => {
                    // filenameから日付を取得 16時からのレースにしたい
                    const date = parse(
                        filename.slice(0, 8),
                        'yyyyMMdd',
                        new Date(),
                    );
                    date.setHours(16);
                    const csvHeaderDataText: string = [
                        'name',
                        'dateTime',
                        'location',
                        'surfaceType',
                        'distance',
                        'grade',
                        'number',
                        'id',
                    ].join(',');
                    const csvDataText: string = [
                        `raceName${filename.slice(0, 8)}`,
                        date.toISOString(),
                        'パリロンシャン',
                        '芝',
                        '2400',
                        'GⅠ',
                        '1',
                        `world${format(date, 'yyyyMMdd')}${WORLD_PLACE_CODE['パリロンシャン']}01`,
                    ].join(',');
                    const csvDataRameNameUndefinedText: string = [
                        undefined,
                        date.toISOString(),
                        'パリロンシャン',
                        '芝',
                        '2400',
                        'GⅠ',
                        '1',
                        `world${format(date, 'yyyyMMdd')}${WORLD_PLACE_CODE['パリロンシャン']}01`,
                    ].join(',');
                    const csvDataNumUndefinedText: string = [
                        `raceName${filename.slice(0, 8)}`,
                        date.toISOString(),
                        'パリロンシャン',
                        '芝',
                        '2400',
                        'GⅠ',
                        undefined,
                        `world${format(date, 'yyyyMMdd')}${WORLD_PLACE_CODE['パリロンシャン']}01`,
                    ].join(',');
                    const csvDatajoinText: string = [
                        csvHeaderDataText,
                        csvDataText,
                        csvDataRameNameUndefinedText,
                        csvDataNumUndefinedText,
                    ].join('\n');
                    return Promise.resolve(csvDatajoinText);
                },
            );
            // リクエストの作成
            const request = new FetchRaceListRequest<WorldPlaceEntity>(
                new Date('2024-01-01'),
                new Date('2024-02-01'),
            );
            // テスト実行
            const response = await repository.fetchRaceList(request);

            // レスポンスの検証
            expect(response.raceDataList).toHaveLength(32);
        });
    });

    describe('registerRaceList', () => {
        test('正しいレースデータを登録できる', async () => {
            // 1年間のレースデータを登録する
            const raceDataList: WorldRaceEntity[] = Array.from(
                { length: 366 },
                (_, day) => {
                    const date = new Date('2024-01-01');
                    date.setDate(date.getDate() + day);
                    return Array.from(
                        { length: 12 },
                        (__, j) =>
                            new WorldRaceEntity(
                                null,
                                `raceName${format(date, 'yyyyMMdd')}`,
                                date,
                                'パリロンシャン',
                                '芝',
                                2400,
                                'GⅠ',
                                j + 1,
                            ),
                    );
                },
            ).flat();

            // リクエストの作成
            const request = new RegisterRaceListRequest<WorldRaceEntity>(
                raceDataList,
            );
            // テスト実行
            await repository.registerRaceList(request);

            // uploadDataToS3が366回呼ばれることを検証
            expect(s3Gateway.uploadDataToS3).toHaveBeenCalledTimes(366);
        });
    });
});
