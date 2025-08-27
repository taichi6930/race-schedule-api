import 'reflect-metadata';

import * as fs from 'node:fs';
import path from 'node:path';
import { afterEach } from 'node:test';

import { container } from 'tsyringe';

import { PlaceData } from '../../../../../lib/src/domain/placeData';
import { PlaceEntity } from '../../../../../lib/src/repository/entity/placeEntity';
import { SearchPlaceFilterEntity } from '../../../../../lib/src/repository/entity/searchPlaceFilterEntity';
import { PlaceRepositoryFromStorage } from '../../../../../lib/src/repository/implement/placeRepositoryFromStorage';
import type { IPlaceRepository } from '../../../../../lib/src/repository/interface/IPlaceRepository';
import { getJSTDate } from '../../../../../lib/src/utility/date';
import {
    IS_LARGE_AMOUNT_DATA_TEST,
    IS_SHORT_TEST,
} from '../../../../../lib/src/utility/env';
import { RaceType } from '../../../../../lib/src/utility/raceType';
import type { TestGatewaySetup } from '../../../../utility/testSetupHelper';
import {
    clearMocks,
    setupTestGatewayMock,
} from '../../../../utility/testSetupHelper';
import {
    defaultHeldDayData,
    defaultLocation,
    defaultPlaceGrade,
    testRaceTypeListAll,
    testRaceTypeListWithoutOverseas,
} from '../../mock/common/baseCommonData';

describe('PlaceRepositoryFromStorage', () => {
    let gatewaySetup: TestGatewaySetup;
    let repository: IPlaceRepository;

    beforeEach(() => {
        gatewaySetup = setupTestGatewayMock();
        // テスト対象のリポジトリを生成
        repository = container.resolve(PlaceRepositoryFromStorage);
    });

    afterEach(() => {
        clearMocks();
    });

    describe('fetchPlaceList', () => {
        test.each(testRaceTypeListAll)(
            '正しい開催場データを取得できる(%s)',
            async (raceType) => {
                // モックの戻り値を設定
                gatewaySetup.s3Gateway.fetchDataFromS3.mockImplementation(
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
                expect(placeEntityList).toHaveLength(
                    raceType === RaceType.OVERSEAS ? 0 : 1,
                );
            },
        );
    });

    describe('registerPlaceList', () => {
        test.each(testRaceTypeListWithoutOverseas)(
            '正しい開催場データを登録できる(%s)',
            async (raceType) => {
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

                expect(
                    gatewaySetup.s3Gateway.uploadDataToS3,
                ).toHaveBeenCalledTimes(raceType == RaceType.NAR ? 1 : 2);
            },
        );
    });

    // 1年間の開催場データを登録する
    const placeEntityList = (raceType: RaceType): PlaceEntity[] => {
        const dayCount = IS_SHORT_TEST
            ? 3
            : IS_LARGE_AMOUNT_DATA_TEST
              ? 100
              : 10;
        return Array.from({ length: dayCount }, (_, day) => {
            const location = defaultLocation[raceType];
            const date = new Date('2024-01-01');
            date.setDate(date.getDate() + day);
            return PlaceEntity.createWithoutId(
                PlaceData.create(raceType, date, location),
                defaultHeldDayData[raceType],
                defaultPlaceGrade[raceType],
                getJSTDate(new Date()),
            );
        });
    };
});
