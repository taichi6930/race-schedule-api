import 'reflect-metadata';

import { container } from 'tsyringe';

import type { IPlaceDataHtmlGateway } from '../../../../../lib/src/gateway/interface/iPlaceDataHtmlGateway';
import { MockPlaceDataHtmlGateway } from '../../../../../lib/src/gateway/mock/mockPlaceDataHtmlGateway';
import type { PlaceEntity } from '../../../../../lib/src/repository/entity/placeEntity';
import { SearchPlaceFilterEntity } from '../../../../../lib/src/repository/entity/searchPlaceFilterEntity';
import { AutoracePlaceRepositoryFromHtmlImpl } from '../../../../../lib/src/repository/implement/autoracePlaceRepositoryFromHtmlImpl';
import { BoatracePlaceRepositoryFromHtmlImpl } from '../../../../../lib/src/repository/implement/boatracePlaceRepositoryFromHtmlImpl';
import { KeirinPlaceRepositoryFromHtmlImpl } from '../../../../../lib/src/repository/implement/keirinPlaceRepositoryFromHtmlImpl';
import type { IPlaceRepository } from '../../../../../lib/src/repository/interface/IPlaceRepository';
import { allowedEnvs } from '../../../../../lib/src/utility/env';
import { RaceType } from '../../../../../lib/src/utility/raceType';
import { SkipEnv } from '../../../../utility/testDecorators';
import { basePlaceEntity } from '../../mock/common/baseCommonData';

type RepositoryClassType = new (
    placeDataHtmlGateway: IPlaceDataHtmlGateway,
) => IPlaceRepository<PlaceEntity>;
const testCases: {
    name: string;
    repositoryClass: RepositoryClassType;
    raceType: RaceType;
    baseEntity: PlaceEntity;
    startDate: Date;
    endDate: Date;
    expectedLength: number;
}[] = [
    {
        name: 'KeirinPlaceRepositoryFromHtmlImpl',
        repositoryClass: KeirinPlaceRepositoryFromHtmlImpl,
        raceType: RaceType.KEIRIN,
        baseEntity: basePlaceEntity(RaceType.KEIRIN),
        startDate: new Date('2024-10-01'),
        endDate: new Date('2024-10-31'),
        expectedLength: 233,
    },
    {
        name: 'AutoracePlaceRepositoryFromHtmlImpl',
        repositoryClass: AutoracePlaceRepositoryFromHtmlImpl,
        raceType: RaceType.AUTORACE,
        baseEntity: basePlaceEntity(RaceType.AUTORACE),
        startDate: new Date('2024-11-01'),
        endDate: new Date('2024-11-30'),
        expectedLength: 60,
    },
    {
        name: 'BoatracePlaceRepositoryFromHtmlImpl',
        repositoryClass: BoatracePlaceRepositoryFromHtmlImpl,
        raceType: RaceType.BOATRACE,
        baseEntity: basePlaceEntity(RaceType.BOATRACE),
        startDate: new Date('2025-04-01'),
        endDate: new Date('2025-06-30'),
        expectedLength: 66,
    },
];

for (const {
    name,
    repositoryClass,
    raceType,
    baseEntity,
    startDate,
    endDate,
    expectedLength,
} of testCases) {
    describe(name, () => {
        let placeDataHtmlgateway: IPlaceDataHtmlGateway;
        let repository: IPlaceRepository<PlaceEntity>;

        beforeEach(() => {
            placeDataHtmlgateway = new MockPlaceDataHtmlGateway();
            container.registerInstance(
                'PlaceDataHtmlGateway',
                placeDataHtmlgateway,
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
                '正しい開催場データを取得できる',
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
            it('HTMLなので登録できない', async () => {
                await expect(
                    repository.registerPlaceEntityList(raceType, [baseEntity]),
                ).resolves.toEqual({
                    code: 500,
                    message: 'HTMLにはデータを登録出来ません',
                    successData: [],
                    failureData: [baseEntity],
                });
            });
        });
    });
}
