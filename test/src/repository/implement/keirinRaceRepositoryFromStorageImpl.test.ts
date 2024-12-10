import 'reflect-metadata';

import { format, parse } from 'date-fns';
import { container } from 'tsyringe';

import { KeirinRaceData } from '../../../../lib/src/domain/keirinRaceData';
import type { IS3Gateway } from '../../../../lib/src/gateway/interface/iS3Gateway';
import type { KeirinRacePlayerRecord } from '../../../../lib/src/gateway/record/keirinRacePlayerRecord';
import type { KeirinRaceRecord } from '../../../../lib/src/gateway/record/keirinRaceRecord';
import type { KeirinPlaceEntity } from '../../../../lib/src/repository/entity/keirinPlaceEntity';
import { KeirinRaceEntity } from '../../../../lib/src/repository/entity/keirinRaceEntity';
import { KeirinRaceRepositoryFromStorageImpl } from '../../../../lib/src/repository/implement/keirinRaceRepositoryFromStorageImpl';
import { FetchRaceListRequest } from '../../../../lib/src/repository/request/fetchRaceListRequest';
import { RegisterRaceListRequest } from '../../../../lib/src/repository/request/registerRaceListRequest';
import { KEIRIN_PLACE_CODE } from '../../../../lib/src/utility/data/keirin';
import { baseKeirinRacePlayerDataList } from '../../mock/common/baseKeirinData';
import {
    mockS3GatewayForKeirinRace,
    mockS3GatewayForKeirinRacePlayer,
} from '../../mock/gateway/s3GatewayMock';

describe('KeirinRaceRepositoryFromStorageImpl', () => {
    let raceS3Gateway: jest.Mocked<IS3Gateway<KeirinRaceRecord>>;
    let racePlayerS3Gateway: jest.Mocked<IS3Gateway<KeirinRacePlayerRecord>>;
    let repository: KeirinRaceRepositoryFromStorageImpl;

    beforeEach(() => {
        // S3Gatewayのモックを作成
        raceS3Gateway = mockS3GatewayForKeirinRace();
        racePlayerS3Gateway = mockS3GatewayForKeirinRacePlayer();

        // DIコンテナにモックを登録
        container.registerInstance('KeirinRaceS3Gateway', raceS3Gateway);
        container.registerInstance(
            'KeirinRacePlayerS3Gateway',
            racePlayerS3Gateway,
        );

        // テスト対象のリポジトリを生成
        repository = container.resolve(KeirinRaceRepositoryFromStorageImpl);
    });

    describe('fetchRaceList', () => {
        test('正しいレースデータを取得できる', async () => {
            // モックの戻り値を設定
            raceS3Gateway.fetchDataFromS3.mockImplementation(
                async (filename: string) => {
                    // filenameから日付を取得 16時からのレースにしたい
                    const date = parse('20240101', 'yyyyMMdd', new Date());
                    date.setHours(16);
                    const csvHeaderDataText: string = [
                        'name',
                        'stage',
                        'dateTime',
                        'location',
                        'grade',
                        'number',
                        'id',
                    ].join(',');
                    const csvDataText: string = [
                        `raceName20240101`,
                        `決勝`,
                        date.toISOString(),
                        '平塚',
                        'GⅠ',
                        '1',
                        `keirin20240101${KEIRIN_PLACE_CODE['平塚']}01`,
                    ].join(',');
                    const csvDataRameNameUndefinedText: string = [
                        undefined,
                        `決勝`,
                        date.toISOString(),
                        '平塚',
                        'GⅠ',
                        '1',
                        `keirin20240101${KEIRIN_PLACE_CODE['平塚']}01`,
                    ].join(',');
                    const csvDataNumUndefinedText: string = [
                        `raceName${filename.slice(0, 8)}`,
                        `決勝`,
                        date.toISOString(),
                        '平塚',
                        'GⅠ',
                        undefined,
                        `keirin20240101${KEIRIN_PLACE_CODE['平塚']}01`,
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
            racePlayerS3Gateway.fetchDataFromS3.mockImplementation(
                async (filename: string) => {
                    // filenameから日付を取得 16時からのレースにしたい
                    const date = parse(
                        filename.slice(0, 8),
                        'yyyyMMdd',
                        new Date(),
                    );
                    date.setHours(16);
                    const csvHeaderDataText: string = [
                        'id',
                        'playerId',
                        'positionNumber',
                        'playerNumber',
                    ].join(',');
                    const csvDataText: string = [
                        `keirin20240101${KEIRIN_PLACE_CODE['平塚']}0101`,
                        `keirin20240101${KEIRIN_PLACE_CODE['平塚']}01`,
                        '1',
                        '1',
                    ].join(',');
                    const csvDataRameNameUndefinedText: string = [
                        undefined,
                        `keirin20240101${KEIRIN_PLACE_CODE['平塚']}01`,
                        '1',
                        '1',
                    ].join(',');
                    const csvDataNumUndefinedText: string = [
                        `keirin20240101${KEIRIN_PLACE_CODE['平塚']}0101`,
                        `keirin20240101${KEIRIN_PLACE_CODE['平塚']}01`,
                        null,
                        '1',
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
            const request = new FetchRaceListRequest<KeirinPlaceEntity>(
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
            const raceEntityList: KeirinRaceEntity[] = Array.from(
                { length: 366 },
                (_, day) => {
                    const date = new Date('2024-01-01');
                    date.setDate(date.getDate() + day);
                    return Array.from(
                        { length: 12 },
                        (__, j) =>
                            new KeirinRaceEntity(
                                null,
                                new KeirinRaceData(
                                    `raceName${format(date, 'yyyyMMdd')}`,
                                    `S級決勝`,
                                    date,
                                    '平塚',
                                    'GⅠ',
                                    j + 1,
                                ),
                                baseKeirinRacePlayerDataList,
                            ),
                    );
                },
            ).flat();

            // リクエストの作成
            const request = new RegisterRaceListRequest<KeirinRaceEntity>(
                raceEntityList,
            );
            // テスト実行
            await repository.registerRaceEntityList(request);

            // uploadDataToS3が1回呼ばれることを検証
            expect(raceS3Gateway.uploadDataToS3).toHaveBeenCalledTimes(1);
        });
    });
});
