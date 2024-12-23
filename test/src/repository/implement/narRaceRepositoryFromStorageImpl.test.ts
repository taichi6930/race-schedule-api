import 'reflect-metadata';

import { format, parse } from 'date-fns';
import { container } from 'tsyringe';

import { NarRaceData } from '../../../../lib/src/domain/narRaceData';
import type { IS3Gateway } from '../../../../lib/src/gateway/interface/iS3Gateway';
import type { NarRaceRecord } from '../../../../lib/src/gateway/record/narRaceRecord';
import type { NarPlaceEntity } from '../../../../lib/src/repository/entity/narPlaceEntity';
import { NarRaceEntity } from '../../../../lib/src/repository/entity/narRaceEntity';
import { NarRaceRepositoryFromStorageImpl } from '../../../../lib/src/repository/implement/narRaceRepositoryFromStorageImpl';
import { FetchRaceListRequest } from '../../../../lib/src/repository/request/fetchRaceListRequest';
import { RegisterRaceListRequest } from '../../../../lib/src/repository/request/registerRaceListRequest';
import { getJSTDate } from '../../../../lib/src/utility/date';
import { mockS3GatewayForNarRace } from '../../mock/gateway/s3GatewayMock';

describe('NarRaceRepositoryFromStorageImpl', () => {
    let s3Gateway: jest.Mocked<IS3Gateway<NarRaceRecord>>;
    let repository: NarRaceRepositoryFromStorageImpl;

    beforeEach(() => {
        // S3Gatewayのモックを作成
        s3Gateway = mockS3GatewayForNarRace();

        // DIコンテナにモックを登録
        container.registerInstance('NarRaceS3Gateway', s3Gateway);

        // テスト対象のリポジトリを生成
        repository = container.resolve(NarRaceRepositoryFromStorageImpl);
    });

    describe('fetchRaceList', () => {
        test('正しいレースデータを取得できる', async () => {
            // モックの戻り値を設定
            s3Gateway.fetchDataFromS3.mockImplementation(
                async (filename: string) => {
                    // filenameから日付を取得 16時からのレースにしたい
                    const date = parse('20240101', 'yyyyMMdd', new Date());
                    date.setHours(16);
                    const csvHeaderDataText: string = [
                        'name',
                        'dateTime',
                        'location',
                        'surfaceType',
                        'distance',
                        'grade',
                        'number',
                        'heldTimes',
                        'heldDayTimes',
                    ].join(',');
                    const csvDataText: string = [
                        `raceName20240101`,
                        date.toISOString(),
                        '大井',
                        'ダート',
                        '1200',
                        'GⅠ',
                        '1',
                    ].join(',');
                    const csvDataRameNameUndefinedText: string = [
                        undefined,
                        date.toISOString(),
                        '大井',
                        'ダート',
                        '1200',
                        'GⅠ',
                        '1',
                    ].join(',');
                    const csvDataNumUndefinedText: string = [
                        `raceName${filename.slice(0, 8)}`,
                        date.toISOString(),
                        '大井',
                        'ダート',
                        '1200',
                        'GⅠ',
                        undefined,
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
            const request = new FetchRaceListRequest<NarPlaceEntity>(
                new Date('2024-01-01'),
                new Date('2024-02-01'),
            );
            // テスト実行
            const response = await repository.fetchRaceEntityList(request);

            // レスポンスの検証
            expect(response.raceEntityList).toHaveLength(1);
        });
    });

    describe('registerRaceList', () => {
        test('正しいレースデータを登録できる', async () => {
            // 1年間のレースデータを登録する
            const raceEntityList: NarRaceEntity[] = Array.from(
                { length: 366 },
                (_, day) => {
                    const date = new Date('2024-01-01');
                    date.setDate(date.getDate() + day);
                    return Array.from(
                        { length: 12 },
                        (__, j) =>
                            new NarRaceEntity(
                                null,
                                new NarRaceData(
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

            // リクエストの作成
            const request = new RegisterRaceListRequest<NarRaceEntity>(
                raceEntityList,
            );
            // テスト実行
            await repository.registerRaceEntityList(request);

            // uploadDataToS3が366回呼ばれることを検証
            expect(s3Gateway.uploadDataToS3).toHaveBeenCalledTimes(1);
        });
    });
});
