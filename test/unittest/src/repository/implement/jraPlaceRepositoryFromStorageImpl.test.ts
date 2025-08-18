import 'reflect-metadata';

import * as fs from 'node:fs';
import path from 'node:path';

import { container } from 'tsyringe';

import { HeldDayData } from '../../../../../lib/src/domain/heldDayData';
import { PlaceData } from '../../../../../lib/src/domain/placeData';
import type { IS3Gateway } from '../../../../../lib/src/gateway/interface/iS3Gateway';
import { PlaceEntity } from '../../../../../lib/src/repository/entity/placeEntity';
import { SearchPlaceFilterEntity } from '../../../../../lib/src/repository/entity/searchPlaceFilterEntity';
import { JraPlaceRepositoryFromStorageImpl } from '../../../../../lib/src/repository/implement/jraPlaceRepositoryFromStorageImpl';
import type { IPlaceRepository } from '../../../../../lib/src/repository/interface/IPlaceRepository';
import { getJSTDate } from '../../../../../lib/src/utility/date';
import { RaceType } from '../../../../../lib/src/utility/raceType';
import type { TestSetup } from '../../../../utility/testSetupHelper';
import { setupTestMock } from '../../../../utility/testSetupHelper';

describe('JraPlaceRepositoryFromStorageImpl', () => {
    let s3Gateway: jest.Mocked<IS3Gateway>;
    let repository: IPlaceRepository<PlaceEntity>;

    const raceType: RaceType = RaceType.JRA;

    beforeEach(() => {
        const setup: TestSetup = setupTestMock();
        ({ s3Gateway } = setup);
        // テスト対象のリポジトリを生成
        repository = container.resolve(JraPlaceRepositoryFromStorageImpl);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('fetchPlaceList', () => {
        test('正しい開催場データを取得できる', async () => {
            // モックの戻り値を設定
            s3Gateway.fetchDataFromS3.mockImplementation(
                async (folderName, fileName) => {
                    return fs.readFileSync(
                        path.resolve(
                            __dirname,
                            '../../mock/repository/csv',
                            `${folderName}${fileName}`,
                        ),
                        'utf8',
                    );
                },
            );

            // テスト実行
            const placeEntityList = await repository.fetchPlaceEntityList(
                new SearchPlaceFilterEntity(
                    new Date('2024-01-01'),
                    new Date('2024-02-01'),
                    raceType,
                ),
            );

            // レスポンスの検証
            expect(placeEntityList).toHaveLength(1);
        });
    });

    describe('registerPlaceList', () => {
        test('正しい開催場データを登録できる', async () => {
            // テスト実行
            await expect(
                repository.registerPlaceEntityList(raceType, placeEntityList),
            ).resolves.toEqual({
                code: 200,
                message: 'データの保存に成功しました',
                successData: placeEntityList,
                failureData: [],
            });

            // uploadDataToS3が2回呼ばれることを検証
            expect(s3Gateway.uploadDataToS3).toHaveBeenCalledTimes(2);
        });
    });

    // 1年間の開催場データを登録する
    const placeEntityList: PlaceEntity[] = Array.from(
        { length: 60 },
        (_, day) => {
            const date = new Date('2024-01-01');
            date.setDate(date.getDate() + day);
            return Array.from({ length: 12 }, () =>
                PlaceEntity.createWithoutId(
                    PlaceData.create(raceType, date, '東京'),
                    HeldDayData.create(1, 1),
                    getJSTDate(new Date()),
                ),
            );
        },
    ).flat();
});
