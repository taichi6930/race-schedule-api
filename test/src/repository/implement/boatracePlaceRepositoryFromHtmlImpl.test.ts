import 'reflect-metadata';

import { container } from 'tsyringe';

import type { IBoatracePlaceDataHtmlGateway } from '../../../../lib/src/gateway/interface/iBoatracePlaceDataHtmlGateway';
import { MockBoatracePlaceDataHtmlGateway } from '../../../../lib/src/gateway/mock/mockBoatracePlaceDataHtmlGateway';
import { SearchPlaceFilterEntity } from '../../../../lib/src/repository/entity/searchPlaceFilterEntity';
import { BoatracePlaceRepositoryFromHtmlImpl } from '../../../../lib/src/repository/implement/boatracePlaceRepositoryFromHtmlImpl';
import { allowedEnvs } from '../../../../lib/src/utility/env';
import { SkipEnv } from '../../../utility/testDecorators';

describe('BoatracePlaceRepositoryFromHtmlImpl', () => {
    let placeDataHtmlgateway: IBoatracePlaceDataHtmlGateway;
    let repository: BoatracePlaceRepositoryFromHtmlImpl;

    beforeEach(() => {
        // gatwayのモックを作成
        placeDataHtmlgateway = new MockBoatracePlaceDataHtmlGateway();

        // DIコンテナにモックを登録
        container.registerInstance(
            'BoatracePlaceDataHtmlGateway',
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
                        new Date('2024-10-01'),
                        new Date('2024-12-31'),
                    ),
                );
                expect(placeEntityList).toHaveLength(98);
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
