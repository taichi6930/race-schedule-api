import 'reflect-metadata';

import * as fs from 'node:fs';
import path from 'node:path';

import { container } from 'tsyringe';

import { HeldDayData } from '../../../../../lib/src/domain/heldDayData';
import { PlaceData } from '../../../../../lib/src/domain/placeData';
import type { IS3Gateway } from '../../../../../lib/src/gateway/interface/iS3Gateway';
import { PlaceEntity } from '../../../../../lib/src/repository/entity/placeEntity';
import { SearchPlaceFilterEntity } from '../../../../../lib/src/repository/entity/searchPlaceFilterEntity';
import { PlaceRepositoryFromStorage } from '../../../../../lib/src/repository/implement/placeRepositoryFromStorage';
import type { IPlaceRepository } from '../../../../../lib/src/repository/interface/IPlaceRepository';
import { getJSTDate } from '../../../../../lib/src/utility/date';
import {
    ALL_RACE_TYPE_LIST,
    RaceType,
} from '../../../../../lib/src/utility/raceType';
import type { TestSetup } from '../../../../utility/testSetupHelper';
import { setupTestMock } from '../../../../utility/testSetupHelper';

describe('PlaceRepositoryFromStorage', () => {
    let s3Gateway: jest.Mocked<IS3Gateway>;
    let repository: IPlaceRepository<PlaceEntity>;

    beforeEach(() => {
        const setup: TestSetup = setupTestMock();
        ({ s3Gateway } = setup);
        // テスト対象のリポジトリを生成
        repository = container.resolve(PlaceRepositoryFromStorage);
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
            for (const raceType of ALL_RACE_TYPE_LIST) {
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

            expect(s3Gateway.uploadDataToS3).toHaveBeenCalledTimes(10);
        });
    });

    // 1年間の開催場データを登録する
    const placeEntityList = (raceType: RaceType): PlaceEntity[] =>
        Array.from({ length: 60 }, (_, day) => {
            const location = defaultLocation[raceType];
            const date = new Date('2024-01-01');
            date.setDate(date.getDate() + day);
            return Array.from({ length: 12 }, () =>
                PlaceEntity.createWithoutId(
                    PlaceData.create(raceType, date, location),
                    defaultHeldDayData[raceType],
                    defaultGrade[raceType],
                    getJSTDate(new Date()),
                ),
            );
        }).flat();

    const defaultHeldDayData = {
        [RaceType.JRA]: HeldDayData.create(1, 1),
        [RaceType.NAR]: undefined,
        [RaceType.OVERSEAS]: undefined,
        [RaceType.KEIRIN]: undefined,
        [RaceType.AUTORACE]: undefined,
        [RaceType.BOATRACE]: undefined,
    };

    const defaultLocation = {
        [RaceType.JRA]: '東京',
        [RaceType.NAR]: '大井',
        [RaceType.OVERSEAS]: 'パリロンシャン',
        [RaceType.KEIRIN]: '平塚',
        [RaceType.AUTORACE]: '川口',
        [RaceType.BOATRACE]: '浜名湖',
    };

    const defaultGrade = {
        [RaceType.JRA]: undefined,
        [RaceType.NAR]: undefined,
        [RaceType.OVERSEAS]: undefined,
        [RaceType.KEIRIN]: 'GP',
        [RaceType.AUTORACE]: 'SG',
        [RaceType.BOATRACE]: 'SG',
    };
});
