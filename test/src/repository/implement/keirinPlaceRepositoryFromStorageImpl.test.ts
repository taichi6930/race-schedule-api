import 'reflect-metadata';

import { parse } from 'date-fns';
import { format } from 'date-fns';
import { container } from 'tsyringe';

import type { IS3Gateway } from '../../../../lib/src/gateway/interface/iS3Gateway';
import { KeirinPlaceEntity } from '../../../../lib/src/repository/entity/keirinPlaceEntity';
import { KeirinPlaceRepositoryFromStorageImpl } from '../../../../lib/src/repository/implement/keirinPlaceRepositoryFromStorageImpl';
import { FetchPlaceListRequest } from '../../../../lib/src/repository/request/fetchPlaceListRequest';
import { RegisterPlaceListRequest } from '../../../../lib/src/repository/request/registerPlaceListRequest';
import { mockS3GatewayForKeirinPlace } from '../../mock/gateway/s3GatewayMock';

describe('KeirinPlaceRepositoryFromStorageImpl', () => {
    let s3Gateway: jest.Mocked<IS3Gateway<KeirinPlaceEntity>>;
    let repository: KeirinPlaceRepositoryFromStorageImpl;

    beforeEach(() => {
        // S3Gatewayのモックを作成
        s3Gateway = mockS3GatewayForKeirinPlace();

        // DIコンテナにモックを登録
        container.registerInstance('KeirinPlaceS3Gateway', s3Gateway);

        // テスト対象のリポジトリを生成
        repository = container.resolve(KeirinPlaceRepositoryFromStorageImpl);
    });

    describe('fetchPlaceList', () => {
        test('正しい競馬場データを取得できる', async () => {
            // モックの戻り値を設定
            s3Gateway.fetchDataFromS3.mockImplementation(
                async (filename: string) => {
                    // filenameから日付を取得 16時からの競馬場にしたい
                    const date = parse(
                        filename.slice(0, 6),
                        'yyyyMM',
                        new Date(),
                    );
                    date.setHours(16);
                    console.log(date);

                    // CSVのヘッダーを定義
                    const headers = ['dateTime', 'location', 'grade', 'id'];

                    // データ行を生成
                    const csvDataText: string = [
                        format(date, 'yyyy-MM-dd HH:mm:ss'),
                        '平塚',
                        'GP',
                        `keirin${format(date, 'yyyyMM')}`,
                    ].join(',');

                    // ヘッダーとデータ行を結合して完全なCSVデータを生成
                    const csvDatajoinText: string = [
                        headers.join(','),
                        csvDataText,
                    ].join('\n');
                    return Promise.resolve(csvDatajoinText);
                },
            );
            // リクエストの作成
            const request = new FetchPlaceListRequest(
                new Date('2024-01-01'),
                new Date('2024-02-01'),
            );
            // テスト実行
            const response = await repository.fetchPlaceList(request);

            // レスポンスの検証
            expect(response.placeDataList).toHaveLength(1);
        });
    });

    describe('registerPlaceList', () => {
        test('正しい競馬場データを登録できる', async () => {
            // 1年間の競馬場データを登録する
            const placeDataList: KeirinPlaceEntity[] = Array.from(
                { length: 366 },
                (_, day) => {
                    const date = new Date('2024-01-01');
                    date.setDate(date.getDate() + day);
                    return Array.from(
                        { length: 12 },
                        () => new KeirinPlaceEntity(null, date, '平塚', 'GP'),
                    );
                },
            ).flat();

            // リクエストの作成
            const request = new RegisterPlaceListRequest<KeirinPlaceEntity>(
                placeDataList,
            );
            // テスト実行
            await repository.registerPlaceList(request);

            // uploadDataToS3が12回呼ばれることを検証
            expect(s3Gateway.uploadDataToS3).toHaveBeenCalledTimes(12);
        });
    });
});
