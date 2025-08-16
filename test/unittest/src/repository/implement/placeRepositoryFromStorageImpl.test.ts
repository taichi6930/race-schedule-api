import 'reflect-metadata';

import * as fs from 'node:fs';
import path from 'node:path';

import { container } from 'tsyringe';

import { PlaceData } from '../../../../../lib/src/domain/placeData';
import type { IS3Gateway } from '../../../../../lib/src/gateway/interface/iS3Gateway';
import type { PlaceRecord } from '../../../../../lib/src/gateway/record/horseRacingPlaceRecord';
import { HorseRacingPlaceEntity } from '../../../../../lib/src/repository/entity/horseRacingPlaceEntity';
import { SearchPlaceFilterEntity } from '../../../../../lib/src/repository/entity/searchPlaceFilterEntity';
import { PlaceRepositoryFromStorageImpl } from '../../../../../lib/src/repository/implement/placeRepositoryFromStorageImpl';
import type { IPlaceRepository } from '../../../../../lib/src/repository/interface/IPlaceRepository';
import type { RaceCourse } from '../../../../../lib/src/utility/data/common/raceCourse';
import { getJSTDate } from '../../../../../lib/src/utility/date';
import { RaceType } from '../../../../../lib/src/utility/raceType';
import { mockS3Gateway } from '../../mock/gateway/mockS3Gateway';

describe('PlaceRepositoryFromStorageImpl', () => {
    let placeS3Gateway: jest.Mocked<IS3Gateway<PlaceRecord>>;
    let repository: IPlaceRepository<HorseRacingPlaceEntity>;

    beforeEach(() => {
        // S3Gatewayのモックを作成
        placeS3Gateway = mockS3Gateway<PlaceRecord>();

        // DIコンテナにモックを登録
        container.registerInstance('PlaceS3Gateway', placeS3Gateway);

        // テスト対象のリポジトリを生成
        repository = container.resolve(PlaceRepositoryFromStorageImpl);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('fetchPlaceList', () => {
        test('正しい開催場データを取得できる', async () => {
            // モックの戻り値を設定
            placeS3Gateway.fetchDataFromS3.mockImplementation(
                async (bucketName, fileName) => {
                    return fs.readFileSync(
                        path.resolve(
                            __dirname,
                            `../../mock/repository/csv/${bucketName}${fileName}`,
                        ),
                        'utf8',
                    );
                },
            );

            // テスト実行
            for (const raceType of [
                RaceType.JRA,
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
                RaceType.JRA,
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

            expect(placeS3Gateway.uploadDataToS3).toHaveBeenCalledTimes(5);
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
