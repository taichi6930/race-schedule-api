import 'reflect-metadata';

import { parse } from 'date-fns';
import { format } from 'date-fns';
import { container } from 'tsyringe';

import { AutoracePlaceData } from '../../../../lib/src/domain/autoracePlaceData';
import type { IS3Gateway } from '../../../../lib/src/gateway/interface/iS3Gateway';
import type { AutoracePlaceRecord } from '../../../../lib/src/gateway/record/autoracePlaceRecord';
import { AutoracePlaceEntity } from '../../../../lib/src/repository/entity/autoracePlaceEntity';
import { AutoracePlaceRepositoryFromStorageImpl } from '../../../../lib/src/repository/implement/autoracePlaceRepositoryFromStorageImpl';
import { FetchPlaceListRequest } from '../../../../lib/src/repository/request/fetchPlaceListRequest';
import { RegisterPlaceListRequest } from '../../../../lib/src/repository/request/registerPlaceListRequest';
import { getJSTDate } from '../../../../lib/src/utility/date';
import { mockS3GatewayForAutoracePlace } from '../../mock/gateway/s3GatewayMock';

describe('AutoracePlaceRepositoryFromStorageImpl', () => {
    let s3Gateway: jest.Mocked<IS3Gateway<AutoracePlaceRecord>>;
    let repository: AutoracePlaceRepositoryFromStorageImpl;

    beforeEach(() => {
        // S3Gatewayのモックを作成
        s3Gateway = mockS3GatewayForAutoracePlace();

        // DIコンテナにモックを登録
        container.registerInstance('AutoracePlaceS3Gateway', s3Gateway);

        // テスト対象のリポジトリを生成
        repository = container.resolve(AutoracePlaceRepositoryFromStorageImpl);
    });

    describe('fetchPlaceList', () => {
        test('正しいオートレース場データを取得できる', async () => {
            // モックの戻り値を設定
            s3Gateway.fetchDataFromS3.mockImplementation(async () => {
                // filenameから日付を取得 16時からのオートレース場にしたい
                const date = parse('202401', 'yyyyMM', new Date());
                date.setHours(16);
                console.log(date);

                // CSVのヘッダーを定義
                const csvHeaderDataText = [
                    'dateTime',
                    'location',
                    'grade',
                    'id',
                ].join(',');

                // データ行を生成
                const csvDataText: string = [
                    format(date, 'yyyy-MM-dd HH:mm:ss'),
                    '飯塚',
                    'SG',
                    `autorace${format(date, 'yyyyMM')}`,
                ].join(',');
                // データ行を生成
                const csvUndefinedDataText: string = [
                    undefined,
                    undefined,
                    undefined,
                    undefined,
                ].join(',');

                // ヘッダーとデータ行を結合して完全なCSVデータを生成
                const csvDatajoinText: string = [
                    csvHeaderDataText,
                    csvDataText,
                    csvUndefinedDataText,
                ].join('\n');
                return Promise.resolve(csvDatajoinText);
            });
            // リクエストの作成
            const request = new FetchPlaceListRequest(
                new Date('2024-01-01'),
                new Date('2024-02-01'),
            );
            // テスト実行
            const response = await repository.fetchPlaceEntityList(request);

            // レスポンスの検証
            expect(response.placeEntityList).toHaveLength(1);
        });
    });

    describe('registerPlaceList', () => {
        test('正しいオートレース場データを登録できる', async () => {
            // 1年間のオートレース場データを登録する
            const placeEntityList: AutoracePlaceEntity[] = Array.from(
                { length: 366 },
                (_, day) => {
                    const date = new Date('2024-01-01');
                    date.setDate(date.getDate() + day);
                    return Array.from(
                        { length: 12 },
                        () =>
                            new AutoracePlaceEntity(
                                null,
                                new AutoracePlaceData(date, '飯塚', 'SG'),
                                getJSTDate(new Date()),
                            ),
                    );
                },
            ).flat();

            // リクエストの作成
            const request = new RegisterPlaceListRequest<AutoracePlaceEntity>(
                placeEntityList,
            );
            // テスト実行
            await repository.registerPlaceEntityList(request);

            // uploadDataToS3が1回呼ばれることを検証
            expect(s3Gateway.uploadDataToS3).toHaveBeenCalledTimes(1);
        });
    });
});
