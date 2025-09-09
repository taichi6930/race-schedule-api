import 'reflect-metadata';

import * as fs from 'node:fs';
import path from 'node:path';

import { format } from 'date-fns';
import { container } from 'tsyringe';

import { RaceData } from '../../../../../../lib/src/domain/raceData';
import { RaceEntityForAWS } from '../../../../../../lib/src/repository/entity/raceEntity';
import { SearchRaceFilterEntityForAWS } from '../../../../../../lib/src/repository/entity/searchRaceFilterEntity';
import { HorseRacingRaceRepositoryFromStorage } from '../../../../../../lib/src/repository/implement/horseRacingRaceRepositoryFromStorage';
import { MechanicalRacingRaceRepositoryFromStorage } from '../../../../../../lib/src/repository/implement/mechanicalRacingRaceRepositoryFromStorage';
import type { IRaceRepositoryForAWS } from '../../../../../../lib/src/repository/interface/IRaceRepository';
import { getJSTDate } from '../../../../../../lib/src/utility/date';
import {
    IS_LARGE_AMOUNT_DATA_TEST,
    IS_SHORT_TEST,
} from '../../../../../../lib/src/utility/env';
import { RaceType } from '../../../../../../src/utility/raceType';
import type { TestGatewaySetup } from '../../../../../utility/testSetupHelper';
import {
    clearMocks,
    setupTestGatewayMock,
} from '../../../../../utility/testSetupHelper';
import {
    baseConditionData,
    baseRacePlayerDataList,
    defaultHeldDayData,
    defaultLocation,
    defaultRaceGrade,
    defaultStage,
    testRaceTypeListAll,
} from '../../mock/common/baseCommonData';

describe('RaceRepositoryFromStorage', () => {
    let gatewaySetup: TestGatewaySetup;
    let horseRacingRaceRepository: IRaceRepositoryForAWS;
    let mechanicalRacingRaceRepository: IRaceRepositoryForAWS;

    beforeEach(() => {
        gatewaySetup = setupTestGatewayMock();
        horseRacingRaceRepository = container.resolve(
            HorseRacingRaceRepositoryFromStorage,
        );
        mechanicalRacingRaceRepository = container.resolve(
            MechanicalRacingRaceRepositoryFromStorage,
        );
    });

    afterEach(() => {
        clearMocks();
    });

    describe('fetchRaceList', () => {
        beforeEach(() => {
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
        });

        test.each(testRaceTypeListAll)(
            'レース開催データを正常に取得できる(%s)',
            async (raceType) => {
                const repository =
                    raceType === RaceType.JRA ||
                    raceType === RaceType.NAR ||
                    raceType === RaceType.OVERSEAS
                        ? horseRacingRaceRepository
                        : mechanicalRacingRaceRepository;

                const raceEntityList = await repository.fetchRaceEntityList(
                    new SearchRaceFilterEntityForAWS(
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
            test.each(testRaceTypeListAll)(
                `${description}: %s`,
                async (raceType) => {
                    const raceEntityList: RaceEntityForAWS[] =
                        makeRaceEntityList(raceType);

                    if (hasRegisterData) {
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
                    expect(
                        gatewaySetup.s3Gateway.uploadDataToS3,
                    ).toHaveBeenCalledTimes(
                        raceType === RaceType.JRA ||
                            raceType === RaceType.NAR ||
                            raceType === RaceType.OVERSEAS
                            ? 1
                            : 2,
                    );
                },
            );
        });
    });

    const makeRaceEntityList = (raceType: RaceType): RaceEntityForAWS[] => {
        const dayCount = IS_SHORT_TEST
            ? 3
            : IS_LARGE_AMOUNT_DATA_TEST
              ? 100
              : 10;
        const raceNumberCount = IS_SHORT_TEST ? 3 : 12;
        return Array.from({ length: dayCount }, (_, day) => {
            const date = new Date('2024-01-01');
            date.setDate(date.getDate() + day);
            return Array.from({ length: raceNumberCount }, (__, raceNumber) =>
                RaceEntityForAWS.createWithoutId(
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
    };
});
