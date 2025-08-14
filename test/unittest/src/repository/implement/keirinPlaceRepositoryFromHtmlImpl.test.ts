import 'reflect-metadata';

import { container } from 'tsyringe';

import type { IPlaceDataHtmlGateway } from '../../../../../lib/src/gateway/interface/iPlaceDataHtmlGateway';
import { MockPlaceDataHtmlGateway } from '../../../../../lib/src/gateway/mock/mockPlaceDataHtmlGateway';
import type { MechanicalRacingPlaceEntity } from '../../../../../lib/src/repository/entity/mechanicalRacingPlaceEntity';
import { SearchPlaceFilterEntity } from '../../../../../lib/src/repository/entity/searchPlaceFilterEntity';
import { KeirinPlaceRepositoryFromHtmlImpl } from '../../../../../lib/src/repository/implement/keirinPlaceRepositoryFromHtmlImpl';
import type { IPlaceRepository } from '../../../../../lib/src/repository/interface/IPlaceRepository';
import { allowedEnvs } from '../../../../../lib/src/utility/env';
import { RaceType } from '../../../../../lib/src/utility/raceType';
import { SkipEnv } from '../../../../utility/testDecorators';
import { baseKeirinPlaceEntity } from '../../mock/common/baseKeirinData';

describe('KeirinPlaceRepositoryFromHtmlImpl', () => {
    let placeDataHtmlgateway: IPlaceDataHtmlGateway;
    let repository: IPlaceRepository<MechanicalRacingPlaceEntity>;

    beforeEach(() => {
        // gatewayのモックを作成
        placeDataHtmlgateway = new MockPlaceDataHtmlGateway();

        // DIコンテナにモックを登録
        container.registerInstance(
            'PlaceDataHtmlGateway',
            placeDataHtmlgateway,
        );

        // テスト対象のリポジトリを生成
        repository = container.resolve(KeirinPlaceRepositoryFromHtmlImpl);
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
                        new Date('2024-10-01'),
                        new Date('2024-10-31'),
                        RaceType.KEIRIN,
                    ),
                );
                expect(placeEntityList).toHaveLength(233);
            },
        );
    });

    describe('registerPlaceList', () => {
        it('htmlなので登録できない', async () => {
            // テスト実行
            await expect(
                repository.registerPlaceEntityList(RaceType.KEIRIN, [
                    baseKeirinPlaceEntity,
                ]),
            ).resolves.toEqual({
                code: 500,
                message: 'HTMLにはデータを登録出来ません',
                successData: [],
                failureData: [baseKeirinPlaceEntity],
            });
        });
    });
});
