import 'reflect-metadata';

import { container } from 'tsyringe';

import type { IKeirinPlaceDataHtmlGateway } from '../../../../lib/src/gateway/interface/iKeirinPlaceDataHtmlGateway';
import { MockKeirinPlaceDataHtmlGateway } from '../../../../lib/src/gateway/mock/mockKeirinPlaceDataHtmlGateway';
import { SearchFilterEntity } from '../../../../lib/src/repository/entity/searchFilterEntity';
import { KeirinPlaceRepositoryFromHtmlImpl } from '../../../../lib/src/repository/implement/keirinPlaceRepositoryFromHtmlImpl';
import { allowedEnvs, ENV } from '../../../../lib/src/utility/env';

if (ENV !== allowedEnvs.githubActionsCi) {
    describe('KeirinPlaceRepositoryFromHtmlImpl', () => {
        let keirinPlaceDataHtmlgateway: IKeirinPlaceDataHtmlGateway;
        let repository: KeirinPlaceRepositoryFromHtmlImpl;

        beforeEach(() => {
            // gatwayのモックを作成
            keirinPlaceDataHtmlgateway = new MockKeirinPlaceDataHtmlGateway();

            // DIコンテナにモックを登録
            container.registerInstance(
                'KeirinPlaceDataHtmlGateway',
                keirinPlaceDataHtmlgateway,
            );

            // テスト対象のリポジトリを生成
            repository = container.resolve(KeirinPlaceRepositoryFromHtmlImpl);
        });

        describe('fetchPlaceList', () => {
            test('正しい競輪場データを取得できる', async () => {
                const placeEntityList = await repository.fetchPlaceEntityList(
                    new SearchFilterEntity(
                        new Date('2024-10-01'),
                        new Date('2024-10-31'),
                    ),
                );
                expect(placeEntityList).toHaveLength(233);
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
} else {
    describe('KeirinPlaceRepositoryFromHtmlImpl', () => {
        test('CI環境でテストをスキップ', () => {
            expect(true).toBe(true);
        });
    });
}
