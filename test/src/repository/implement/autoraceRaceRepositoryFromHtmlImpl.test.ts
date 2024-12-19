import 'reflect-metadata';

import { container } from 'tsyringe';

import { AutoracePlaceData } from '../../../../lib/src/domain/autoracePlaceData';
import type { IAutoraceRaceDataHtmlGateway } from '../../../../lib/src/gateway/interface/iAutoraceRaceDataHtmlGateway';
import { MockAutoraceRaceDataHtmlGateway } from '../../../../lib/src/gateway/mock/mockAutoraceRaceDataHtmlGateway';
import { AutoracePlaceEntity } from '../../../../lib/src/repository/entity/autoracePlaceEntity';
import type { AutoraceRaceEntity } from '../../../../lib/src/repository/entity/autoraceRaceEntity';
import { AutoraceRaceRepositoryFromHtmlImpl } from '../../../../lib/src/repository/implement/autoraceRaceRepositoryFromHtmlImpl';
import { FetchRaceListRequest } from '../../../../lib/src/repository/request/fetchRaceListRequest';
import { RegisterRaceListRequest } from '../../../../lib/src/repository/request/registerRaceListRequest';
import { getJSTDate } from '../../../../lib/src/utility/date';
import { ENV } from '../../../../lib/src/utility/env';

if (ENV !== 'GITHUB_ACTIONS_CI') {
    describe('AutoraceRaceRepositoryFromHtmlImpl', () => {
        let autoraceRaceDataHtmlGateway: IAutoraceRaceDataHtmlGateway;
        let repository: AutoraceRaceRepositoryFromHtmlImpl;

        beforeEach(() => {
            // gatwayのモックを作成
            autoraceRaceDataHtmlGateway = new MockAutoraceRaceDataHtmlGateway();

            // DIコンテナにモックを登録
            container.registerInstance(
                'AutoraceRaceDataHtmlGateway',
                autoraceRaceDataHtmlGateway,
            );

            // テスト対象のリポジトリを生成
            repository = container.resolve(AutoraceRaceRepositoryFromHtmlImpl);
        });

        describe('fetchPlaceList', () => {
            test('正しいオートレース場データを取得できる', async () => {
                const response = await repository.fetchRaceEntityList(
                    new FetchRaceListRequest<AutoracePlaceEntity>(
                        new Date('2024-11-01'),
                        new Date('2024-11-30'),
                        [
                            new AutoracePlaceEntity(
                                null,
                                new AutoracePlaceData(
                                    new Date('2024-11-04'),
                                    '川口',
                                    'SG',
                                ),
                                getJSTDate(new Date()),
                            ),
                        ],
                    ),
                );
                expect(response.raceEntityList).toHaveLength(12);
            });
        });

        describe('registerRaceList', () => {
            test('htmlなので登録できない', async () => {
                // リクエストの作成
                const request = new RegisterRaceListRequest<AutoraceRaceEntity>(
                    [],
                );
                // テスト実行
                await expect(
                    repository.registerRaceEntityList(request),
                ).rejects.toThrow('HTMLにはデータを登録出来ません');
            });
        });
    });
} else {
    describe('AutoraceRaceRepositoryFromHtmlImpl', () => {
        test('CI環境でテストをスキップ', () => {
            expect(true).toBe(true);
        });
    });
}
