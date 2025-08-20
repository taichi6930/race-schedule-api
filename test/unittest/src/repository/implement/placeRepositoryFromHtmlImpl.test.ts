import 'reflect-metadata';

import { container } from 'tsyringe';

import type { IPlaceDataHtmlGateway } from '../../../../../lib/src/gateway/interface/iPlaceDataHtmlGateway';
import { MockPlaceDataHtmlGateway } from '../../../../../lib/src/gateway/mock/mockPlaceDataHtmlGateway';
import type { PlaceEntity } from '../../../../../lib/src/repository/entity/placeEntity';
import { SearchPlaceFilterEntity } from '../../../../../lib/src/repository/entity/searchPlaceFilterEntity';
import { AutoracePlaceRepositoryFromHtml } from '../../../../../lib/src/repository/implement/autoracePlaceRepositoryFromHtml';
import { BoatracePlaceRepositoryFromHtmlImpl } from '../../../../../lib/src/repository/implement/boatracePlaceRepositoryFromHtmlImpl';
import { JraPlaceRepositoryFromHtmlImpl } from '../../../../../lib/src/repository/implement/jraPlaceRepositoryFromHtmlImpl';
import { KeirinPlaceRepositoryFromHtmlImpl } from '../../../../../lib/src/repository/implement/keirinPlaceRepositoryFromHtmlImpl';
import { NarPlaceRepositoryFromHtmlImpl } from '../../../../../lib/src/repository/implement/narPlaceRepositoryFromHtmlImpl';
import type { IPlaceRepository } from '../../../../../lib/src/repository/interface/IPlaceRepository';
import { allowedEnvs } from '../../../../../lib/src/utility/env';
import { RaceType } from '../../../../../lib/src/utility/raceType';
import { SkipEnv } from '../../../../utility/testDecorators';
import { basePlaceEntity } from '../../mock/common/baseCommonData';

// テーブル駆動型テスト
const testCases = [
    {
        name: 'JraPlaceRepositoryFromHtmlImpl',
        repositoryClass: JraPlaceRepositoryFromHtmlImpl,
        raceType: RaceType.JRA,
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-12-31'),
        expectedLength: 288,
    },
    {
        name: 'NarPlaceRepositoryFromHtmlImpl',
        repositoryClass: NarPlaceRepositoryFromHtmlImpl,
        raceType: RaceType.NAR,
        startDate: new Date('2024-10-01'),
        endDate: new Date('2024-10-31'),
        expectedLength: 120,
    },
    {
        name: 'KeirinPlaceRepositoryFromHtmlImpl',
        repositoryClass: KeirinPlaceRepositoryFromHtmlImpl,
        raceType: RaceType.KEIRIN,
        startDate: new Date('2024-10-01'),
        endDate: new Date('2024-10-31'),
        expectedLength: 233,
    },
    {
        name: 'AutoracePlaceRepositoryFromHtml',
        repositoryClass: AutoracePlaceRepositoryFromHtml,
        raceType: RaceType.AUTORACE,
        startDate: new Date('2024-11-01'),
        endDate: new Date('2024-11-30'),
        expectedLength: 60,
    },
    {
        name: 'BoatracePlaceRepositoryFromHtmlImpl',
        repositoryClass: BoatracePlaceRepositoryFromHtmlImpl,
        raceType: RaceType.BOATRACE,
        startDate: new Date('2025-04-01'),
        endDate: new Date('2025-06-30'),
        expectedLength: 66,
    },
];

for (const {
    name,
    repositoryClass,
    raceType,
    startDate,
    endDate,
    expectedLength,
} of testCases) {
    describe(name, () => {
        let placeDataHtmlGateway: IPlaceDataHtmlGateway;
        let repository: IPlaceRepository<PlaceEntity>;

        beforeEach(() => {
            placeDataHtmlGateway = new MockPlaceDataHtmlGateway();
            container.registerInstance(
                'PlaceDataHtmlGateway',
                placeDataHtmlGateway,
            );
            repository =
                container.resolve<IPlaceRepository<PlaceEntity>>(
                    repositoryClass,
                );
        });

        afterEach(() => {
            jest.clearAllMocks();
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
                    expect(placeEntityList).toHaveLength(expectedLength);
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
