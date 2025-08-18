import 'reflect-metadata';

import * as fs from 'node:fs';
import path from 'node:path';

import { format } from 'date-fns';
import { container } from 'tsyringe';

import { HeldDayData } from '../../../../../lib/src/domain/heldDayData';
import { HorseRaceConditionData } from '../../../../../lib/src/domain/houseRaceConditionData';
import { RaceData } from '../../../../../lib/src/domain/raceData';
import type { IS3Gateway } from '../../../../../lib/src/gateway/interface/iS3Gateway';
import { JraRaceEntity } from '../../../../../lib/src/repository/entity/jraRaceEntity';
import type { PlaceEntity } from '../../../../../lib/src/repository/entity/placeEntity';
import { SearchRaceFilterEntity } from '../../../../../lib/src/repository/entity/searchRaceFilterEntity';
import { JraRaceRepositoryFromStorageImpl } from '../../../../../lib/src/repository/implement/jraRaceRepositoryFromStorageImpl';
import type { IRaceRepository } from '../../../../../lib/src/repository/interface/IRaceRepository';
import { getJSTDate } from '../../../../../lib/src/utility/date';
import { RaceType } from '../../../../../lib/src/utility/raceType';
import type { TestSetup } from '../../../../utility/testSetupHelper';
import { setupTestMock } from '../../../../utility/testSetupHelper';

describe('JraRaceRepositoryFromStorageImpl', () => {
    let s3Gateway: jest.Mocked<IS3Gateway>;
    let repository: IRaceRepository<JraRaceEntity, PlaceEntity>;

    const raceType: RaceType = RaceType.JRA;

    beforeEach(() => {
        const setup: TestSetup = setupTestMock();
        ({ s3Gateway } = setup);
        // テスト対象のリポジトリを生成
        repository = container.resolve(JraRaceRepositoryFromStorageImpl);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('fetchRaceList', () => {
        test('正しいレース開催データを取得できる', async () => {
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

            // リクエストの作成
            const searchFilter = new SearchRaceFilterEntity<PlaceEntity>(
                new Date('2024-01-01'),
                new Date('2024-02-01'),
                raceType,
            );
            // テスト実行
            const raceEntityList =
                await repository.fetchRaceEntityList(searchFilter);

            // レスポンスの検証
            expect(raceEntityList).toHaveLength(1);
        });
    });

    describe('registerRaceList', () => {
        test('DBが空データのところに、正しいレース開催データを登録できる', async () => {
            // テスト実行
            await repository.registerRaceEntityList(raceType, raceEntityList);

            // uploadDataToS3が366回呼ばれることを検証
            expect(s3Gateway.uploadDataToS3).toHaveBeenCalledTimes(1);
        });

        test('DBにデータの存在するところに、正しいレース開催データを登録できる', async () => {
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
            await repository.registerRaceEntityList(raceType, raceEntityList);

            // uploadDataToS3が366回呼ばれることを検証
            expect(s3Gateway.uploadDataToS3).toHaveBeenCalledTimes(1);
        });
    });

    // 1年間のレース開催データを登録する
    const raceEntityList: JraRaceEntity[] = Array.from(
        { length: 60 },
        (_, day) => {
            const date = new Date('2024-01-01');
            date.setDate(date.getDate() + day);
            return Array.from({ length: 12 }, (__, j) =>
                JraRaceEntity.createWithoutId(
                    RaceData.create(
                        raceType,
                        `raceName${format(date, 'yyyyMMdd')}`,
                        date,
                        '東京',
                        'GⅠ',
                        j + 1,
                    ),
                    HeldDayData.create(1, 1),
                    HorseRaceConditionData.create('ダート', 1200),
                    getJSTDate(new Date()),
                ),
            );
        },
    ).flat();
});
