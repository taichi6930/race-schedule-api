import 'reflect-metadata';

import { container } from 'tsyringe';

import type { IKeirinPlaceDataHtmlGateway } from '../../../../lib/src/gateway/interface/iKeirinPlaceDataHtmlGateway';
import { MockKeirinPlaceDataHtmlGateway } from '../../../../lib/src/gateway/mock/mockKeirinPlaceDataHtmlGateway';
import { SearchPlaceFilterEntity } from '../../../../lib/src/repository/entity/searchPlaceFilterEntity';
import { KeirinPlaceRepositoryFromHtmlImpl } from '../../../../lib/src/repository/implement/keirinPlaceRepositoryFromHtmlImpl';
import { allowedEnvs } from '../../../../lib/src/utility/env';
import { SkipEnv } from '../../../utility/testDecorators';

describe('KeirinPlaceRepositoryFromHtmlImpl', () => {
    let placeDataHtmlgateway: IKeirinPlaceDataHtmlGateway;
    let repository: KeirinPlaceRepositoryFromHtmlImpl;

    beforeEach(() => {
        // gatwayのモックを作成
        placeDataHtmlgateway = new MockKeirinPlaceDataHtmlGateway();

        // DIコンテナにモックを登録
        container.registerInstance(
            'KeirinPlaceDataHtmlGateway',
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
                    ),
                );
                expect(placeEntityList).toHaveLength(233);
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
