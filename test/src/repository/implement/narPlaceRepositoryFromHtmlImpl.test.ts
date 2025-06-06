import 'reflect-metadata';

import { container } from 'tsyringe';

import type { INarPlaceDataHtmlGateway } from '../../../../lib/src/gateway/interface/iNarPlaceDataHtmlGateway';
import { MockNarPlaceDataHtmlGateway } from '../../../../lib/src/gateway/mock/mockNarPlaceDataHtmlGateway';
import { SearchPlaceFilterEntity } from '../../../../lib/src/repository/entity/searchPlaceFilterEntity';
import { NarPlaceRepositoryFromHtmlImpl } from '../../../../lib/src/repository/implement/narPlaceRepositoryFromHtmlImpl';
import { allowedEnvs } from '../../../../lib/src/utility/env';
import { SkipEnv } from '../../../utility/testDecorators';

describe('NarPlaceRepositoryFromHtmlImpl', () => {
    let placeDataHtmlgateway: INarPlaceDataHtmlGateway;
    let repository: NarPlaceRepositoryFromHtmlImpl;

    beforeEach(() => {
        // gatwayのモックを作成
        placeDataHtmlgateway = new MockNarPlaceDataHtmlGateway();

        // DIコンテナにモックを登録
        container.registerInstance(
            'NarPlaceDataHtmlGateway',
            placeDataHtmlgateway,
        );

        // テスト対象のリポジトリを生成
        repository = container.resolve(NarPlaceRepositoryFromHtmlImpl);
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
                expect(placeEntityList).toHaveLength(120);
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
