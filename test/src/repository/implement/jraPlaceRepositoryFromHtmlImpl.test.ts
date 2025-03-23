import 'reflect-metadata';

import { container } from 'tsyringe';

import type { IJraPlaceDataHtmlGateway } from '../../../../lib/src/gateway/interface/iJraPlaceDataHtmlGateway';
import { MockJraPlaceDataHtmlGateway } from '../../../../lib/src/gateway/mock/mockJraPlaceDataHtmlGateway';
import { SearchPlaceFilterEntity } from '../../../../lib/src/repository/entity/searchPlaceFilterEntity';
import { JraPlaceRepositoryFromHtmlImpl } from '../../../../lib/src/repository/implement/jraPlaceRepositoryFromHtmlImpl';
import { allowedEnvs, ENV } from '../../../../lib/src/utility/env';

if (ENV === allowedEnvs.githubActionsCi) {
    describe('JraPlaceRepositoryFromHtmlImpl', () => {
        test('CI環境でテストをスキップ', () => {
            expect(true).toBe(true);
        });
    });
} else {
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
            test('正しい開催場データを取得できる', async () => {
                const placeEntityList = await repository.fetchPlaceEntityList(
                    new SearchPlaceFilterEntity(
                        new Date('2024-01-01'),
                        new Date('2024-12-31'),
                    ),
                );
                expect(placeEntityList).toHaveLength(288);
            });
        });

        describe('registerPlaceList', () => {
            test('htmlなので登録できない', async () => {
                // テスト実行
                await expect(
                    repository.registerPlaceEntityList([]),
                ).rejects.toThrow('HTMLにはデータを登録出来ません');
            });
        });
    });
}
