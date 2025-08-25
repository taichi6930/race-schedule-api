import 'reflect-metadata';

import { container } from 'tsyringe';

import type { IPlaceDataHtmlGateway } from '../../../../../lib/src/gateway/interface/iPlaceDataHtmlGateway';
import { MockPlaceDataHtmlGateway } from '../../../../../lib/src/gateway/mock/mockPlaceDataHtmlGateway';
import { SearchPlaceFilterEntity } from '../../../../../lib/src/repository/entity/searchPlaceFilterEntity';
import { BoatracePlaceRepositoryFromHtml } from '../../../../../lib/src/repository/implement/boatracePlaceRepositoryFromHtml';
import { PlaceRepositoryFromHtml } from '../../../../../lib/src/repository/implement/placeRepositoryFromHtml';
import type { IPlaceRepository } from '../../../../../lib/src/repository/interface/IPlaceRepository';
import { allowedEnvs } from '../../../../../lib/src/utility/env';
import { RaceType } from '../../../../../lib/src/utility/raceType';
import { SkipEnv } from '../../../../utility/testDecorators';
import { clearMocks } from '../../../../utility/testSetupHelper';
import {
    basePlaceEntity,
    testRaceTypeListWithoutOverseas,
} from '../../mock/common/baseCommonData';

// テーブル駆動型テスト
const testCases = {
    [RaceType.JRA]: [
        {
            name: 'PlaceRepositoryFromHtml',
            repositoryClass: PlaceRepositoryFromHtml,
            startDate: new Date('2024-01-01'),
            endDate: new Date('2024-12-31'),
            expectedLength: 288,
        },
    ],
    [RaceType.NAR]: [
        {
            name: 'PlaceRepositoryFromHtml',
            repositoryClass: PlaceRepositoryFromHtml,
            startDate: new Date('2024-10-01'),
            endDate: new Date('2024-10-31'),
            expectedLength: 120,
        },
    ],
    [RaceType.KEIRIN]: [
        {
            name: 'PlaceRepositoryFromHtml',
            repositoryClass: PlaceRepositoryFromHtml,
            startDate: new Date('2024-10-01'),
            endDate: new Date('2024-10-31'),
            expectedLength: 233,
        },
    ],
    [RaceType.AUTORACE]: [
        {
            name: 'PlaceRepositoryFromHtml',
            repositoryClass: PlaceRepositoryFromHtml,
            startDate: new Date('2024-11-01'),
            endDate: new Date('2024-11-30'),
            expectedLength: 60,
        },
    ],
    [RaceType.BOATRACE]: [
        {
            name: 'BoatracePlaceRepositoryFromHtml',
            repositoryClass: BoatracePlaceRepositoryFromHtml,
            startDate: new Date('2025-04-01'),
            endDate: new Date('2025-06-30'),
            expectedLength: 66,
        },
    ],
};

describe.each(testRaceTypeListWithoutOverseas)(
    'PlaceRepositoryFromHtml - %s',
    (raceType) => {
        for (const {
            name,
            repositoryClass,
            startDate,
            endDate,
            expectedLength,
        } of testCases[raceType]) {
            describe(name, () => {
                let placeDataHtmlGateway: IPlaceDataHtmlGateway;
                let repository: IPlaceRepository;

                beforeEach(() => {
                    placeDataHtmlGateway = new MockPlaceDataHtmlGateway();
                    container.registerInstance(
                        'PlaceDataHtmlGateway',
                        placeDataHtmlGateway,
                    );
                    repository =
                        container.resolve<IPlaceRepository>(repositoryClass);
                });

                afterEach(() => {
                    clearMocks();
                });

                describe('fetchPlaceList', () => {
                    SkipEnv(
                        `正しいレース開催データを取得できる(${raceType})`,
                        [allowedEnvs.githubActionsCi],
                        async () => {
                            const placeEntityList =
                                await repository.fetchPlaceEntityList(
                                    new SearchPlaceFilterEntity(
                                        startDate,
                                        endDate,
                                        raceType,
                                    ),
                                );
                            expect(placeEntityList).toHaveLength(
                                expectedLength,
                            );
                        },
                    );
                });

                describe('registerPlaceList', () => {
                    it(`HTMLにはデータを登録できない(${raceType})`, async () => {
                        await expect(
                            repository.registerPlaceEntityList(raceType, [
                                basePlaceEntity(raceType),
                            ]),
                        ).resolves.toEqual({
                            code: 500,
                            message: 'HTMLにはデータを登録出来ません',
                            successData: [],
                            failureData: [basePlaceEntity(raceType)],
                        });
                    });
                });
            });
        }
    },
);
