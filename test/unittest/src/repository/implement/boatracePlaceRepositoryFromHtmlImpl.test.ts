import 'reflect-metadata';

import { container } from 'tsyringe';

import type { IPlaceDataHtmlGateway } from '../../../../../lib/src/gateway/interface/iPlaceDataHtmlGateway';
import { MockPlaceDataHtmlGateway } from '../../../../../lib/src/gateway/mock/mockPlaceDataHtmlGateway';
import type { MechanicalRacingPlaceEntity } from '../../../../../lib/src/repository/entity/mechanicalRacingPlaceEntity';
import { SearchPlaceFilterEntity } from '../../../../../lib/src/repository/entity/searchPlaceFilterEntity';
import { BoatracePlaceRepositoryFromHtmlImpl } from '../../../../../lib/src/repository/implement/boatracePlaceRepositoryFromHtmlImpl';
import type { IPlaceRepository } from '../../../../../lib/src/repository/interface/IPlaceRepository';
import { allowedEnvs } from '../../../../../lib/src/utility/env';
import { RaceType } from '../../../../../lib/src/utility/raceType';
import { SkipEnv } from '../../../../utility/testDecorators';
import { baseBoatracePlaceEntity } from '../../mock/common/baseBoatraceData';

describe('BoatracePlaceRepositoryFromHtmlImpl', () => {
    let placeDataHtmlgateway: IPlaceDataHtmlGateway;
    let repository: IPlaceRepository<MechanicalRacingPlaceEntity>;

    const raceType: RaceType = RaceType.BOATRACE;

    beforeEach(() => {
        // gatewayのモックを作成
        placeDataHtmlgateway = new MockPlaceDataHtmlGateway();

        // DIコンテナにモックを登録
        container.registerInstance(
            'PlaceDataHtmlGateway',
            placeDataHtmlgateway,
        );

        // テスト対象のリポジトリを生成
        repository = container.resolve(BoatracePlaceRepositoryFromHtmlImpl);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('fetchPlaceList', () => {
        SkipEnv(
            '正しい開催場データを取得できる',
            [allowedEnvs.githubActionsCi],
            async () => {
                const placeEntityList = await repository.fetchPlaceEntityList(
                    new SearchPlaceFilterEntity(
                        new Date('2025-04-01'),
                        new Date('2025-06-30'),
                        raceType,
                    ),
                );
                expect(placeEntityList).toHaveLength(66);
            },
        );
    });

    describe('registerPlaceList', () => {
        it('htmlなので登録できない', async () => {
            // テスト実行
            await expect(
                repository.registerPlaceEntityList(raceType, [
                    baseBoatracePlaceEntity,
                ]),
            ).resolves.toEqual({
                code: 500,
                message: 'HTMLにはデータを登録出来ません',
                successData: [],
                failureData: [baseBoatracePlaceEntity],
            });
        });
    });
});
