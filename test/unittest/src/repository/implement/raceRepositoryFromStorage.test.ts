import 'reflect-metadata';

import * as fs from 'node:fs';
import path from 'node:path';

import { format } from 'date-fns';
import { container } from 'tsyringe';

import { RaceData } from '../../../../../lib/src/domain/raceData';
import type { IS3Gateway } from '../../../../../lib/src/gateway/interface/iS3Gateway';
import { RaceEntity } from '../../../../../lib/src/repository/entity/raceEntity';
import { SearchRaceFilterEntity } from '../../../../../lib/src/repository/entity/searchRaceFilterEntity';
import { MechanicalRacingRaceRepositoryFromStorage } from '../../../../../lib/src/repository/implement/mechanicalRacingRaceRepositoryFromStorage';
import { RaceRepositoryFromStorage } from '../../../../../lib/src/repository/implement/raceRepositoryFromStorage';
import type { IRaceRepository } from '../../../../../lib/src/repository/interface/IRaceRepository';
import { CSV_FILE_NAME } from '../../../../../lib/src/utility/constants';
import { getJSTDate } from '../../../../../lib/src/utility/date';
import { IS_SHORT_TEST } from '../../../../../lib/src/utility/env';
import { RaceType } from '../../../../../lib/src/utility/raceType';
import type { TestSetup } from '../../../../utility/testSetupHelper';
import { setupTestMock } from '../../../../utility/testSetupHelper';
import {
    baseConditionData,
    baseRacePlayerDataList,
    defaultHeldDayData,
    defaultLocation,
    defaultRaceGrade,
    defaultStage,
} from '../../mock/common/baseCommonData';
import { RACE_TYPE_LIST_ALL } from './../../../../../lib/src/utility/raceType';

describe('RaceRepositoryFromStorage', () => {
    let s3Gateway: jest.Mocked<IS3Gateway>;
    let horseRacingRaceRepository: IRaceRepository;
    let mechanicalRacingRaceRepository: IRaceRepository;

    const raceTypeList = IS_SHORT_TEST ? [RaceType.JRA] : RACE_TYPE_LIST_ALL;

    beforeEach(() => {
        const setup: TestSetup = setupTestMock();
        ({ s3Gateway } = setup);

        // テスト対象のリポジトリを生成
        horseRacingRaceRepository = container.resolve(
            RaceRepositoryFromStorage,
        );
        mechanicalRacingRaceRepository = container.resolve(
            MechanicalRacingRaceRepositoryFromStorage,
        );
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('fetchRaceList', () => {
        beforeEach(() => {
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
        });

        test.each(raceTypeList)(
            'レース開催データを正常に取得できる: %s',
            async (raceType) => {
                const repository =
                    raceType === RaceType.JRA ||
                    raceType === RaceType.NAR ||
                    raceType === RaceType.OVERSEAS
                        ? horseRacingRaceRepository
                        : mechanicalRacingRaceRepository;

                const raceEntityList = await repository.fetchRaceEntityList(
                    new SearchRaceFilterEntity(
                        new Date('2024-01-01'),
                        new Date('2024-02-01'),
                        raceType,
                        [],
                    ),
                );
                expect(raceEntityList).toHaveLength(1);
            },
        );
    });

    describe('registerRaceList', () => {
        describe.each([
            [
                true,
                'DBにデータの存在するところに、正しいレース開催データを登録できる',
            ],
            [
                false,
                'DBが空データのところに、正しいレース開催データを登録できる',
            ],
        ])('%s', (hasRegisterData: boolean, description: string) => {
            test.each(raceTypeList)(`${description}: %s`, async (raceType) => {
                const raceEntityList: RaceEntity[] =
                    makeRaceEntityList(raceType);

                if (hasRegisterData) {
                    s3Gateway.fetchDataFromS3.mockResolvedValue(
                        fs.readFileSync(
                            path.resolve(
                                __dirname,
                                '../../mock/repository/csv',
                                raceType.toLowerCase(),
                                CSV_FILE_NAME.RACE_LIST,
                            ),
                            'utf8',
                        ),
                    );
                }

                const repository =
                    raceType === RaceType.JRA ||
                    raceType === RaceType.NAR ||
                    raceType === RaceType.OVERSEAS
                        ? horseRacingRaceRepository
                        : mechanicalRacingRaceRepository;

                await repository.registerRaceEntityList(
                    raceType,
                    raceEntityList,
                );
                expect(s3Gateway.uploadDataToS3).toHaveBeenCalledTimes(
                    raceType === RaceType.JRA ||
                        raceType === RaceType.NAR ||
                        raceType === RaceType.OVERSEAS
                        ? 1
                        : 2,
                );
            });
        });
    });

    const makeRaceEntityList = (raceType: RaceType): RaceEntity[] =>
        Array.from({ length: 5 }, (_, day) => {
            const date = new Date('2024-01-01');
            date.setDate(date.getDate() + day);
            return Array.from({ length: 6 }, (__, raceNumber) =>
                RaceEntity.createWithoutId(
                    RaceData.create(
                        raceType,
                        `raceName${format(date, 'yyyyMMdd')}`,
                        date,
                        defaultLocation[raceType],
                        defaultRaceGrade[raceType],
                        raceNumber + 1,
                    ),
                    defaultHeldDayData[raceType],
                    baseConditionData(raceType),
                    defaultStage[raceType],
                    baseRacePlayerDataList(raceType),
                    getJSTDate(new Date()),
                ),
            );
        }).flat();
});
