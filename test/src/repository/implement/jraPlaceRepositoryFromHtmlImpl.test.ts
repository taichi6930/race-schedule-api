import 'reflect-metadata';

import { container } from 'tsyringe';

import type { IJraPlaceDataHtmlGateway } from '../../../../lib/src/gateway/interface/iJraPlaceDataHtmlGateway';
import { MockJraPlaceDataHtmlGateway } from '../../../../lib/src/gateway/mock/mockJraPlaceDataHtmlGateway';
import { SearchPlaceFilterEntity } from '../../../../lib/src/repository/entity/searchPlaceFilterEntity';
import { JraPlaceRepositoryFromHtmlImpl } from '../../../../lib/src/repository/implement/jraPlaceRepositoryFromHtmlImpl';
import { allowedEnvs, SkipEnv } from '../../../utility/testDecorators';

describe('JraPlaceRepositoryFromHtmlImpl', () => {
    let placeDataHtmlgateway: IJraPlaceDataHtmlGateway;
    let repository: JraPlaceRepositoryFromHtmlImpl;

    beforeEach(() => {
        // gatwayのモックを作成
        placeDataHtmlgateway = new MockJraPlaceDataHtmlGateway();

        // DIコンテナにモックを登録
        container.registerInstance(
            'JraPlaceDataHtmlGateway',
            placeDataHtmlgateway,
        );

        // テスト対象のリポジトリを生成
        repository = container.resolve(JraPlaceRepositoryFromHtmlImpl);
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
                        new Date('2024-01-01'),
                        new Date('2024-12-31'),
                    ),
                );
                expect(placeEntityList).toHaveLength(288);
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
