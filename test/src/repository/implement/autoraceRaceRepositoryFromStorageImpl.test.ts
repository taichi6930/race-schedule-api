import 'reflect-metadata';

import { format, parse } from 'date-fns';
import { container } from 'tsyringe';

import { AutoraceRaceData } from '../../../../lib/src/domain/autoraceRaceData';
import type { IS3Gateway } from '../../../../lib/src/gateway/interface/iS3Gateway';
import type { AutoraceRacePlayerRecord } from '../../../../lib/src/gateway/record/autoraceRacePlayerRecord';
import type { AutoraceRaceRecord } from '../../../../lib/src/gateway/record/autoraceRaceRecord';
import type { AutoracePlaceEntity } from '../../../../lib/src/repository/entity/autoracePlaceEntity';
import { AutoraceRaceEntity } from '../../../../lib/src/repository/entity/autoraceRaceEntity';
import { AutoraceRaceRepositoryFromStorageImpl } from '../../../../lib/src/repository/implement/autoraceRaceRepositoryFromStorageImpl';
import { FetchRaceListRequest } from '../../../../lib/src/repository/request/fetchRaceListRequest';
import { RegisterRaceListRequest } from '../../../../lib/src/repository/request/registerRaceListRequest';
import { AUTORACE_PLACE_CODE } from '../../../../lib/src/utility/data/autorace/autoraceRaceCourse';
import { getJSTDate } from '../../../../lib/src/utility/date';
import { baseAutoraceRacePlayerDataList } from '../../mock/common/baseAutoraceData';
import {
    mockS3GatewayForAutoraceRace,
    mockS3GatewayForAutoraceRacePlayer,
} from '../../mock/gateway/s3GatewayMock';

describe('AutoraceRaceRepositoryFromStorageImpl', () => {
    let raceS3Gateway: jest.Mocked<IS3Gateway<AutoraceRaceRecord>>;
    let racePlayerS3Gateway: jest.Mocked<IS3Gateway<AutoraceRacePlayerRecord>>;
    let repository: AutoraceRaceRepositoryFromStorageImpl;

    beforeEach(() => {
        // S3Gatewayのモックを作成
        raceS3Gateway = mockS3GatewayForAutoraceRace();
        racePlayerS3Gateway = mockS3GatewayForAutoraceRacePlayer();

        // DIコンテナにモックを登録
        container.registerInstance('AutoraceRaceS3Gateway', raceS3Gateway);
        container.registerInstance(
            'AutoraceRacePlayerS3Gateway',
            racePlayerS3Gateway,
        );

        // テスト対象のリポジトリを生成
        repository = container.resolve(AutoraceRaceRepositoryFromStorageImpl);
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
                        'updateDate',
                    ].join(',');
                    const csvDataText: string = [
                        `raceName20240101`,
                        `優勝戦`,
                        date.toISOString(),
                        '飯塚',
                        'GⅠ',
                        '1',
                        `autorace20240101${AUTORACE_PLACE_CODE['飯塚']}01`,
                        getJSTDate(new Date()).toISOString(),
                    ].join(',');
                    const csvDataRameNameUndefinedText: string = [
                        undefined,
                        `優勝戦`,
                        date.toISOString(),
                        '飯塚',
                        'GⅠ',
                        '1',
                        `autorace20240101${AUTORACE_PLACE_CODE['飯塚']}01`,
                        getJSTDate(new Date()).toISOString(),
                    ].join(',');
                    const csvDataNumUndefinedText: string = [
                        `raceName${filename.slice(0, 8)}`,
                        `優勝戦`,
                        date.toISOString(),
                        '飯塚',
                        'GⅠ',
                        undefined,
                        `autorace20240101${AUTORACE_PLACE_CODE['飯塚']}01`,
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
                        'raceId',
                        'positionNumber',
                        'playerNumber',
                    ].join(',');
                    const csvDataText: string = [
                        `autorace20240101${AUTORACE_PLACE_CODE['飯塚']}0101`,
                        `autorace20240101${AUTORACE_PLACE_CODE['飯塚']}01`,
                        '1',
                        '999999',
                    ].join(',');
                    const csvDataRameNameUndefinedText: string = [
                        undefined,
                        `autorace20240101${AUTORACE_PLACE_CODE['飯塚']}01`,
                        '1',
                        '1',
                    ].join(',');
                    const csvDataNumUndefinedText: string = [
                        `autorace20240101${AUTORACE_PLACE_CODE['飯塚']}0101`,
                        `autorace20240101${AUTORACE_PLACE_CODE['飯塚']}01`,
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
            const request = new FetchRaceListRequest<AutoracePlaceEntity>(
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
        test('DBが空データのところに、正しいレースデータを登録できる', async () => {
            // 1年間のレースデータを登録する
            const raceEntityList: AutoraceRaceEntity[] = Array.from(
                { length: 366 },
                (_, day) => {
                    const date = new Date('2024-01-01');
                    date.setDate(date.getDate() + day);
                    return Array.from(
                        { length: 12 },
                        (__, j) =>
                            new AutoraceRaceEntity(
                                null,
                                AutoraceRaceData.create(
                                    `raceName${format(date, 'yyyyMMdd')}`,
                                    `優勝戦`,
                                    date,
                                    '飯塚',
                                    'GⅠ',
                                    j + 1,
                                ),
                                baseAutoraceRacePlayerDataList,
                                getJSTDate(new Date()),
                            ),
                    );
                },
            ).flat();

            // リクエストの作成
            const request = new RegisterRaceListRequest<AutoraceRaceEntity>(
                raceEntityList,
            );
            // テスト実行
            await repository.registerRaceEntityList(request);

            // uploadDataToS3が1回呼ばれることを検証
            expect(raceS3Gateway.uploadDataToS3).toHaveBeenCalledTimes(1);
        });

        test('DBにデータがあるところに、正しいレースデータを登録できる', async () => {
            // 1年間のレースデータを登録する
            const raceEntityList: AutoraceRaceEntity[] = Array.from(
                { length: 366 },
                (_, day) => {
                    const date = new Date('2024-01-01');
                    date.setDate(date.getDate() + day);
                    return Array.from(
                        { length: 12 },
                        (__, j) =>
                            new AutoraceRaceEntity(
                                null,
                                AutoraceRaceData.create(
                                    `raceName${format(date, 'yyyyMMdd')}`,
                                    `優勝戦`,
                                    date,
                                    '飯塚',
                                    'GⅠ',
                                    j + 1,
                                ),
                                baseAutoraceRacePlayerDataList,
                                getJSTDate(new Date()),
                            ),
                    );
                },
            ).flat();

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
                        `優勝戦`,
                        date.toISOString(),
                        '飯塚',
                        'GⅠ',
                        '1',
                        `autorace20240101${AUTORACE_PLACE_CODE['飯塚']}01`,
                    ].join(',');
                    const csvDataRameNameUndefinedText: string = [
                        undefined,
                        `優勝戦`,
                        date.toISOString(),
                        '飯塚',
                        'GⅠ',
                        '1',
                        `autorace20240101${AUTORACE_PLACE_CODE['飯塚']}01`,
                    ].join(',');
                    const csvDataNumUndefinedText: string = [
                        `raceName${filename.slice(0, 8)}`,
                        `優勝戦`,
                        date.toISOString(),
                        '飯塚',
                        'GⅠ',
                        undefined,
                        `autorace20240101${AUTORACE_PLACE_CODE['飯塚']}01`,
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
                        'raceId',
                        'positionNumber',
                        'playerNumber',
                    ].join(',');
                    const csvDataText: string = [
                        `autorace20240101${AUTORACE_PLACE_CODE['飯塚']}0101`,
                        `autorace20240101${AUTORACE_PLACE_CODE['飯塚']}01`,
                        '1',
                        '999999',
                    ].join(',');
                    const csvDataRameNameUndefinedText: string = [
                        undefined,
                        `autorace20240101${AUTORACE_PLACE_CODE['飯塚']}01`,
                        '1',
                        '1',
                    ].join(',');
                    const csvDataNumUndefinedText: string = [
                        `autorace20240101${AUTORACE_PLACE_CODE['飯塚']}0101`,
                        `autorace20240101${AUTORACE_PLACE_CODE['飯塚']}01`,
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
            const request = new RegisterRaceListRequest<AutoraceRaceEntity>(
                raceEntityList,
            );
            // テスト実行
            await repository.registerRaceEntityList(request);

            // uploadDataToS3が1回呼ばれることを検証
            expect(raceS3Gateway.uploadDataToS3).toHaveBeenCalledTimes(1);
        });
    });
});
