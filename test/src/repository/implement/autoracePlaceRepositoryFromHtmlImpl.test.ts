import 'reflect-metadata';

import { container } from 'tsyringe';

import type { IAutoracePlaceDataHtmlGateway } from '../../../../lib/src/gateway/interface/iAutoracePlaceDataHtmlGateway';
import { MockAutoracePlaceDataHtmlGateway } from '../../../../lib/src/gateway/mock/mockAutoracePlaceDataHtmlGateway';
import { SearchPlaceFilterEntity } from '../../../../lib/src/repository/entity/searchPlaceFilterEntity';
import { AutoracePlaceRepositoryFromHtmlImpl } from '../../../../lib/src/repository/implement/autoracePlaceRepositoryFromHtmlImpl';
import { SkipGitHubActionsCI } from '../../../utility/testDecorators';

describe('AutoracePlaceRepositoryFromHtmlImpl', () => {
    let placeDataHtmlgateway: IAutoracePlaceDataHtmlGateway;
    let repository: AutoracePlaceRepositoryFromHtmlImpl;

    beforeEach(() => {
        // gatwayのモックを作成
        placeDataHtmlgateway = new MockAutoracePlaceDataHtmlGateway();

        // DIコンテナにモックを登録
        container.registerInstance(
            'AutoracePlaceDataHtmlGateway',
            placeDataHtmlgateway,
        );

        // テスト対象のリポジトリを生成
        repository = container.resolve(AutoracePlaceRepositoryFromHtmlImpl);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('fetchPlaceList', () => {
        SkipGitHubActionsCI('正しい開催場データを取得できる', async () => {
            const placeEntityList = await repository.fetchPlaceEntityList(
                new SearchPlaceFilterEntity(
                    new Date('2024-11-01'),
                    new Date('2024-11-30'),
                ),
            );
            expect(placeEntityList).toHaveLength(60);
        });
    });

    describe('registerPlaceList', () => {
        SkipGitHubActionsCI('htmlなので登録できない', async () => {
            // テスト実行
            await expect(
                repository.registerPlaceEntityList([]),
            ).rejects.toThrow('HTMLにはデータを登録出来ません');
        });
    });
});
