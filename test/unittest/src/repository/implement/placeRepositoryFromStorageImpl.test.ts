import 'reflect-metadata';

import * as fs from 'node:fs';
import path from 'node:path';

import { container } from 'tsyringe';

import { PlaceData } from '../../../../../lib/src/domain/placeData';
import type { IS3Gateway } from '../../../../../lib/src/gateway/interface/iS3Gateway';
import type { HorseRacingPlaceRecord } from '../../../../../lib/src/gateway/record/horseRacingPlaceRecord';
import { HorseRacingPlaceEntity } from '../../../../../lib/src/repository/entity/horseRacingPlaceEntity';
import { SearchPlaceFilterEntity } from '../../../../../lib/src/repository/entity/searchPlaceFilterEntity';
import { PlaceRepositoryFromStorageImpl } from '../../../../../lib/src/repository/implement/placeRepositoryFromStorageImpl';
import type { IPlaceRepository } from '../../../../../lib/src/repository/interface/IPlaceRepository';
import type { RaceCourse } from '../../../../../lib/src/utility/data/common/raceCourse';
import { getJSTDate } from '../../../../../lib/src/utility/date';
import { RaceType } from '../../../../../lib/src/utility/raceType';
import { mockS3Gateway } from '../../mock/gateway/mockS3Gateway';

describe('PlaceRepositoryFromStorageImpl', () => {
    let placeS3GatewayForNar: jest.Mocked<IS3Gateway<HorseRacingPlaceRecord>>;
    let placeS3GatewayForKeirin: jest.Mocked<
        IS3Gateway<HorseRacingPlaceRecord>
    >;
    let placeS3GatewayForAutorace: jest.Mocked<
        IS3Gateway<HorseRacingPlaceRecord>
    >;
    let placeS3GatewayForBoatrace: jest.Mocked<
        IS3Gateway<HorseRacingPlaceRecord>
    >;
    let repository: IPlaceRepository<HorseRacingPlaceEntity>;

    beforeEach(() => {
        // S3Gatewayのモックを作成
        placeS3GatewayForNar = mockS3Gateway<HorseRacingPlaceRecord>();
        placeS3GatewayForKeirin = mockS3Gateway<HorseRacingPlaceRecord>();
        placeS3GatewayForAutorace = mockS3Gateway<HorseRacingPlaceRecord>();
        placeS3GatewayForBoatrace = mockS3Gateway<HorseRacingPlaceRecord>();

        // DIコンテナにモックを登録
        container.registerInstance('NarPlaceS3Gateway', placeS3GatewayForNar);
        container.registerInstance(
            'KeirinPlaceS3Gateway',
            placeS3GatewayForKeirin,
        );
        container.registerInstance(
            'AutoracePlaceS3Gateway',
            placeS3GatewayForAutorace,
        );
        container.registerInstance(
            'BoatracePlaceS3Gateway',
            placeS3GatewayForBoatrace,
        );

        // テスト対象のリポジトリを生成
        repository = container.resolve(PlaceRepositoryFromStorageImpl);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('fetchPlaceList', () => {
        test('正しい開催場データを取得できる', async () => {
            placeS3GatewayForNar.fetchDataFromS3.mockResolvedValue(
                fs.readFileSync(
                    path.resolve(
                        __dirname,
                        '../../mock/repository/csv/nar/placeList.csv',
                    ),
                    'utf8',
                ),
            );
            placeS3GatewayForKeirin.fetchDataFromS3.mockResolvedValue(
                fs.readFileSync(
                    path.resolve(
                        __dirname,
                        '../../mock/repository/csv/keirin/placeList.csv',
                    ),
                    'utf8',
                ),
            );
            placeS3GatewayForAutorace.fetchDataFromS3.mockResolvedValue(
                fs.readFileSync(
                    path.resolve(
                        __dirname,
                        '../../mock/repository/csv/autorace/placeList.csv',
                    ),
                    'utf8',
                ),
            );
            placeS3GatewayForBoatrace.fetchDataFromS3.mockResolvedValue(
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
                RaceType.NAR,
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
                RaceType.NAR,
                RaceType.KEIRIN,
                RaceType.AUTORACE,
                RaceType.BOATRACE,
            ]) {
                const _placeEntityList = placeEntityList(raceType);
                // テスト実行
                await expect(
                    repository.registerPlaceEntityList(
                        raceType,
                        _placeEntityList,
                    ),
                ).resolves.toEqual({
                    code: 200,
                    message: 'データの保存に成功しました',
                    successData: _placeEntityList,
                    failureData: [],
                });
            }

            // uploadDataToS3が1回呼ばれることを検証
            expect(placeS3GatewayForNar.uploadDataToS3).toHaveBeenCalledTimes(
                1,
            );
            expect(
                placeS3GatewayForKeirin.uploadDataToS3,
            ).toHaveBeenCalledTimes(1);
            expect(
                placeS3GatewayForAutorace.uploadDataToS3,
            ).toHaveBeenCalledTimes(1);
            expect(
                placeS3GatewayForBoatrace.uploadDataToS3,
            ).toHaveBeenCalledTimes(1);
        });
    });

    // // 1年間の開催場データを登録する
    // 1年間の開催場データを登録する
    const placeEntityList = (raceType: RaceType): HorseRacingPlaceEntity[] =>
        Array.from({ length: 60 }, (_, day) => {
            const location = createLocation(raceType);
            const date = new Date('2024-01-01');
            date.setDate(date.getDate() + day);
            return Array.from({ length: 12 }, () =>
                HorseRacingPlaceEntity.createWithoutId(
                    PlaceData.create(raceType, date, location),
                    getJSTDate(new Date()),
                ),
            );
        }).flat();
});

const createLocation = (raceType: RaceType): RaceCourse => {
    switch (raceType) {
        case RaceType.JRA: {
            return '東京';
        }
        case RaceType.NAR: {
            return '大井';
        }
        case RaceType.KEIRIN: {
            return '平塚';
        }
        case RaceType.AUTORACE: {
            return '川口';
        }
        case RaceType.BOATRACE: {
            return '浜名湖';
        }
        case RaceType.OVERSEAS: {
            return 'パリロンシャン';
        }
    }
};
