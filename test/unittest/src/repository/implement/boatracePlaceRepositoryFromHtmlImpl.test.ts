import 'reflect-metadata';

import { container } from 'tsyringe';

import type { IPlaceDataHtmlGateway } from '../../../../../lib/src/gateway/interface/iPlaceDataHtmlGateway';
import { MockPlaceDataHtmlGateway } from '../../../../../lib/src/gateway/mock/mockPlaceDataHtmlGateway';
import { SearchPlaceFilterEntity } from '../../../../../lib/src/repository/entity/searchPlaceFilterEntity';
import { BoatracePlaceRepositoryFromHtmlImpl } from '../../../../../lib/src/repository/implement/boatracePlaceRepositoryFromHtmlImpl';
import { allowedEnvs } from '../../../../../lib/src/utility/env';
import { SkipEnv } from '../../../../utility/testDecorators';

describe('BoatracePlaceRepositoryFromHtmlImpl', () => {
    let placeDataHtmlgateway: IPlaceDataHtmlGateway;
    let repository: BoatracePlaceRepositoryFromHtmlImpl;

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
                    ),
                );
                expect(placeEntityList).toHaveLength(66);
            },
        );
    });

    describe('registerPlaceList', () => {
        SkipEnv(
            'htmlなので登録できない',
            [allowedEnvs.githubActionsCi],
            async () => {
                // テスト実行
                await expect(
                    repository.registerPlaceEntityList([]),
                ).rejects.toThrow('HTMLにはデータを登録出来ません');
            },
        );
    });
});
