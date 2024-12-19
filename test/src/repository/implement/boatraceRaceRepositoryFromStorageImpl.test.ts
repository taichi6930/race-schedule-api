import 'reflect-metadata';

import { format, parse } from 'date-fns';
import { container } from 'tsyringe';

import { BoatraceRaceData } from '../../../../lib/src/domain/boatraceRaceData';
import type { IS3Gateway } from '../../../../lib/src/gateway/interface/iS3Gateway';
import type { BoatraceRacePlayerRecord } from '../../../../lib/src/gateway/record/boatraceRacePlayerRecord';
import type { BoatraceRaceRecord } from '../../../../lib/src/gateway/record/boatraceRaceRecord';
import type { BoatracePlaceEntity } from '../../../../lib/src/repository/entity/boatracePlaceEntity';
import { BoatraceRaceEntity } from '../../../../lib/src/repository/entity/boatraceRaceEntity';
import { BoatraceRaceRepositoryFromStorageImpl } from '../../../../lib/src/repository/implement/boatraceRaceRepositoryFromStorageImpl';
import { FetchRaceListRequest } from '../../../../lib/src/repository/request/fetchRaceListRequest';
import { RegisterRaceListRequest } from '../../../../lib/src/repository/request/registerRaceListRequest';
import { BOATRACE_PLACE_CODE } from '../../../../lib/src/utility/data/boatrace';
import { getJSTDate } from '../../../../lib/src/utility/date';
import { baseBoatraceRacePlayerDataList } from '../../mock/common/baseBoatraceData';
import {
    mockS3GatewayForBoatraceRace,
    mockS3GatewayForBoatraceRacePlayer,
} from '../../mock/gateway/s3GatewayMock';

describe('BoatraceRaceRepositoryFromStorageImpl', () => {
    let raceS3Gateway: jest.Mocked<IS3Gateway<BoatraceRaceRecord>>;
    let racePlayerS3Gateway: jest.Mocked<IS3Gateway<BoatraceRacePlayerRecord>>;
    let repository: BoatraceRaceRepositoryFromStorageImpl;

    beforeEach(() => {
        // S3Gatewayのモックを作成
        raceS3Gateway = mockS3GatewayForBoatraceRace();
        racePlayerS3Gateway = mockS3GatewayForBoatraceRacePlayer();

        // DIコンテナにモックを登録
        container.registerInstance('BoatraceRaceS3Gateway', raceS3Gateway);
        container.registerInstance(
            'BoatraceRacePlayerS3Gateway',
            racePlayerS3Gateway,
        );

        // テスト対象のリポジトリを生成
        repository = container.resolve(BoatraceRaceRepositoryFromStorageImpl);
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
                        `boatrace20240101${BOATRACE_PLACE_CODE['平塚']}01`,
                    ].join(',');
                    const csvDataRameNameUndefinedText: string = [
                        undefined,
                        `決勝`,
                        date.toISOString(),
                        '平塚',
                        'GⅠ',
                        '1',
                        `boatrace20240101${BOATRACE_PLACE_CODE['平塚']}01`,
                    ].join(',');
                    const csvDataNumUndefinedText: string = [
                        `raceName${filename.slice(0, 8)}`,
                        `決勝`,
                        date.toISOString(),
                        '平塚',
                        'GⅠ',
                        undefined,
                        `boatrace20240101${BOATRACE_PLACE_CODE['平塚']}01`,
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
                        `boatrace20240101${BOATRACE_PLACE_CODE['平塚']}0101`,
                        `boatrace20240101${BOATRACE_PLACE_CODE['平塚']}01`,
                        '1',
                        '1',
                    ].join(',');
                    const csvDataRameNameUndefinedText: string = [
                        undefined,
                        `boatrace20240101${BOATRACE_PLACE_CODE['平塚']}01`,
                        '1',
                        '1',
                    ].join(',');
                    const csvDataNumUndefinedText: string = [
                        `boatrace20240101${BOATRACE_PLACE_CODE['平塚']}0101`,
                        `boatrace20240101${BOATRACE_PLACE_CODE['平塚']}01`,
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
            const request = new FetchRaceListRequest<BoatracePlaceEntity>(
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
            const raceEntityList: BoatraceRaceEntity[] = Array.from(
                { length: 366 },
                (_, day) => {
                    const date = new Date('2024-01-01');
                    date.setDate(date.getDate() + day);
                    return Array.from(
                        { length: 12 },
                        (__, j) =>
                            new BoatraceRaceEntity(
                                null,
                                new BoatraceRaceData(
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

            // リクエストの作成
            const request = new RegisterRaceListRequest<BoatraceRaceEntity>(
                raceEntityList,
            );
            // テスト実行
            await repository.registerRaceEntityList(request);

            // uploadDataToS3が1回呼ばれることを検証
            expect(raceS3Gateway.uploadDataToS3).toHaveBeenCalledTimes(1);
        });
    });
});
