import 'reflect-metadata';

import { container } from 'tsyringe';

import type { IPlaceDataHtmlGateway } from '../../../../../src/gateway/interface/iPlaceDataHtmlGateway';
import { MockPlaceDataHtmlGateway } from '../../../../../src/gateway/mock/mockPlaceDataHtmlGateway';
import { SearchPlaceFilterEntity } from '../../../../../src/repository/entity/filter/searchPlaceFilterEntity';
import { PlaceRepositoryFromHtml } from '../../../../../src/repository/implement/placeRepositoryFromHtml';
import type { IPlaceRepository } from '../../../../../src/repository/interface/IPlaceRepository';
import { allowedEnvs } from '../../../../../src/utility/env';
import { EnvStore } from '../../../../../src/utility/envStore';
import { RaceType } from '../../../../../src/utility/raceType';
import { SkipEnv } from '../../../../utility/testDecorators';
import { clearMocks } from '../../../../utility/testSetupHelper';
import {
    basePlaceEntity,
    testRaceTypeListAll,
} from '../../mock/common/baseCommonData';
import { cloudFlareEnvMock } from '../../mock/common/cloudFlareEnvMock';

// テーブル駆動型テスト
const testCases = {
    [RaceType.JRA]: [
        {
            startDate: new Date('2024-01-01'),
            endDate: new Date('2024-12-31'),
            expectedLength: 288,
        },
    ],
    [RaceType.NAR]: [
        {
            startDate: new Date('2024-10-01'),
            endDate: new Date('2024-10-31'),
            expectedLength: 120,
        },
    ],
    [RaceType.OVERSEAS]: [
        {
            startDate: new Date('2024-10-01'),
            endDate: new Date('2024-10-31'),
            expectedLength: 1,
        },
    ],
    [RaceType.KEIRIN]: [
        {
            startDate: new Date('2024-10-01'),
            endDate: new Date('2024-10-31'),
            expectedLength: 233,
        },
    ],
    [RaceType.AUTORACE]: [
        {
            startDate: new Date('2024-11-01'),
            endDate: new Date('2024-11-30'),
            expectedLength: 60,
        },
    ],
    [RaceType.BOATRACE]: [
        {
            startDate: new Date('2025-04-01'),
            endDate: new Date('2025-06-30'),
            expectedLength: 0,
        },
    ],
};

describe.each(testRaceTypeListAll)('PlaceRepositoryFromHtml', (raceType) => {
    for (const { startDate, endDate, expectedLength } of testCases[raceType]) {
        describe(`PlaceRepositoryFromHtml(${raceType})`, () => {
            let placeDataHtmlGateway: IPlaceDataHtmlGateway;
            let repository: IPlaceRepository;

            beforeAll(() => {
                EnvStore.setEnv(cloudFlareEnvMock());

                placeDataHtmlGateway = new MockPlaceDataHtmlGateway();
                container.registerInstance(
                    'PlaceDataHtmlGateway',
                    placeDataHtmlGateway,
                );
                repository = container.resolve<IPlaceRepository>(
                    PlaceRepositoryFromHtml,
                );
            });

            afterAll(() => {
                clearMocks();
            });

            describe('fetchPlaceList', () => {
                SkipEnv(
                    `正しいレース開催データを取得できる(${raceType})`,
                    [allowedEnvs.githubActionsCi],
                    async () => {
                        const searchPlaceFilter = new SearchPlaceFilterEntity(
                            startDate,
                            endDate,
                            [raceType],
                            [],
                        );
                        const placeEntityList =
                            await repository.fetchPlaceEntityList(
                                searchPlaceFilter,
                            );
                        expect(placeEntityList).toHaveLength(expectedLength);
                    },
                );
            });

            describe('upsertPlaceList', () => {
                it(`HTMLにはデータを登録できない(${raceType})`, async () => {
                    await expect(
                        repository.upsertPlaceEntityList([
                            basePlaceEntity(raceType),
                        ]),
                    ).resolves.toEqual({
                        successCount: 0,
                        failureCount: 0,
                        failures: [],
                    });
                });
            });
        });
    }
});
