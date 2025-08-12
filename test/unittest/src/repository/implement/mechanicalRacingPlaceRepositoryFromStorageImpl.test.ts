import 'reflect-metadata';

import * as fs from 'node:fs';
import path from 'node:path';

import { container } from 'tsyringe';

import { PlaceData } from '../../../../../lib/src/domain/placeData';
import type { IS3Gateway } from '../../../../../lib/src/gateway/interface/iS3Gateway';
import type { MechanicalRacingPlaceRecord } from '../../../../../lib/src/gateway/record/mechanicalRacingPlaceRecord';
import { MechanicalRacingPlaceEntity } from '../../../../../lib/src/repository/entity/mechanicalRacingPlaceEntity';
import { SearchPlaceFilterEntity } from '../../../../../lib/src/repository/entity/searchPlaceFilterEntity';
import { MechanicalRacingPlaceRepositoryFromStorageImpl } from '../../../../../lib/src/repository/implement/mechanicalRacingPlaceRepositoryFromStorageImpl';
import type { IPlaceRepository } from '../../../../../lib/src/repository/interface/IPlaceRepository';
import { getJSTDate } from '../../../../../lib/src/utility/date';
import { RaceType } from '../../../../../lib/src/utility/raceType';
import { mockS3Gateway } from '../../mock/gateway/mockS3Gateway';

describe('MechanicalRacingPlaceRepositoryFromStorageImpl', () => {
    let s3GatewayForKeirin: jest.Mocked<
        IS3Gateway<MechanicalRacingPlaceRecord>
    >;
    let s3GatewayForAutorace: jest.Mocked<
        IS3Gateway<MechanicalRacingPlaceRecord>
    >;
    let s3GatewayForBoatrace: jest.Mocked<
        IS3Gateway<MechanicalRacingPlaceRecord>
    >;
    let repository: IPlaceRepository<MechanicalRacingPlaceEntity>;

    beforeEach(() => {
        // S3Gatewayのモックを作成
        s3GatewayForKeirin = mockS3Gateway<MechanicalRacingPlaceRecord>();
        s3GatewayForAutorace = mockS3Gateway<MechanicalRacingPlaceRecord>();
        s3GatewayForBoatrace = mockS3Gateway<MechanicalRacingPlaceRecord>();

        // DIコンテナにモックを登録
        container.registerInstance('KeirinPlaceS3Gateway', s3GatewayForKeirin);
        container.registerInstance(
            'AutoracePlaceS3Gateway',
            s3GatewayForAutorace,
        );
        container.registerInstance(
            'BoatracePlaceS3Gateway',
            s3GatewayForBoatrace,
        );

        // テスト対象のリポジトリを生成
        repository = container.resolve(
            MechanicalRacingPlaceRepositoryFromStorageImpl,
        );
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('fetchPlaceList', () => {
        test('正しい開催場データを取得できる', async () => {
            // モックの戻り値を設定
            s3GatewayForKeirin.fetchDataFromS3.mockResolvedValue(
                fs.readFileSync(
                    path.resolve(
                        __dirname,
                        '../../mock/repository/csv/keirin/placeList.csv',
                    ),
                    'utf8',
                ),
            );
            s3GatewayForAutorace.fetchDataFromS3.mockResolvedValue(
                fs.readFileSync(
                    path.resolve(
                        __dirname,
                        '../../mock/repository/csv/autorace/placeList.csv',
                    ),
                    'utf8',
                ),
            );
            s3GatewayForBoatrace.fetchDataFromS3.mockResolvedValue(
                fs.readFileSync(
                    path.resolve(
                        __dirname,
                        '../../mock/repository/csv/boatrace/placeList.csv',
                    ),
                    'utf8',
                ),
            );

            // テスト実行
            for (const raceType of [
                RaceType.KEIRIN,
                RaceType.AUTORACE,
                RaceType.BOATRACE,
            ]) {
                const placeEntityList = await repository.fetchPlaceEntityList(
                    new SearchPlaceFilterEntity(
                        new Date('2024-01-01'),
                        new Date('2024-02-01'),
                        raceType,
                    ),
                );

                // レスポンスの検証
                expect(placeEntityList).toHaveLength(1);
            }
        });
    });

    describe('registerPlaceList', () => {
        test('正しい開催場データを登録できる', async () => {
            for (const raceType of [
                RaceType.KEIRIN,
                RaceType.AUTORACE,
                RaceType.BOATRACE,
            ]) {
                // テスト実行
                await repository.registerPlaceEntityList(
                    raceType,
                    placeEntityList(raceType),
                );
            }

            // uploadDataToS3が1回呼ばれることを検証
            expect(s3GatewayForKeirin.uploadDataToS3).toHaveBeenCalledTimes(1);
            expect(s3GatewayForAutorace.uploadDataToS3).toHaveBeenCalledTimes(
                1,
            );
            expect(s3GatewayForBoatrace.uploadDataToS3).toHaveBeenCalledTimes(
                1,
            );
        });
    });

    // 1年間の開催場データを登録する
    const placeEntityList = (
        raceType: RaceType,
    ): MechanicalRacingPlaceEntity[] =>
        Array.from({ length: 60 }, (_, day) => {
            const location =
                raceType === RaceType.KEIRIN
                    ? '平塚'
                    : raceType === RaceType.AUTORACE
                      ? '飯塚'
                      : '平和島';
            const date = new Date('2024-01-01');
            date.setDate(date.getDate() + day);
            return Array.from({ length: 12 }, () =>
                MechanicalRacingPlaceEntity.createWithoutId(
                    raceType,
                    PlaceData.create(raceType, date, location),
                    'GⅠ',
                    getJSTDate(new Date()),
                ),
            );
        }).flat();
});
