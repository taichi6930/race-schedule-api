import 'reflect-metadata';

import { container } from 'tsyringe';

import { AutoracePlaceData } from '../../../../lib/src/domain/autoracePlaceData';
import type { IAutoraceRaceDataHtmlGateway } from '../../../../lib/src/gateway/interface/iAutoraceRaceDataHtmlGateway';
import { MockAutoraceRaceDataHtmlGateway } from '../../../../lib/src/gateway/mock/mockAutoraceRaceDataHtmlGateway';
import { AutoracePlaceEntity } from '../../../../lib/src/repository/entity/autoracePlaceEntity';
import { SearchRaceFilterEntity } from '../../../../lib/src/repository/entity/searchRaceFilterEntity';
import { AutoraceRaceRepositoryFromHtmlImpl } from '../../../../lib/src/repository/implement/autoraceRaceRepositoryFromHtmlImpl';
import { getJSTDate } from '../../../../lib/src/utility/date';
import { allowedEnvs, ENV } from '../../../../lib/src/utility/env';

if (ENV === allowedEnvs.githubActionsCi) {
    describe('AutoraceRaceRepositoryFromHtmlImpl', () => {
        test('CI環境でテストをスキップ', () => {
            expect(true).toBe(true);
        });
    });
} else {
    describe('AutoraceRaceRepositoryFromHtmlImpl', () => {
        let raceDataHtmlGateway: IAutoraceRaceDataHtmlGateway;
        let repository: AutoraceRaceRepositoryFromHtmlImpl;

        beforeEach(() => {
            // gatwayのモックを作成
            raceDataHtmlGateway = new MockAutoraceRaceDataHtmlGateway();

            // DIコンテナにモックを登録
            container.registerInstance(
                'AutoraceRaceDataHtmlGateway',
                raceDataHtmlGateway,
            );

            // テスト対象のリポジトリを生成
            repository = container.resolve(AutoraceRaceRepositoryFromHtmlImpl);
        });

        afterEach(() => {
            jest.clearAllMocks();
        });

        describe('fetchRaceList', () => {
            test('レース開催データを正常に取得できる', async () => {
                const raceEntityList = await repository.fetchRaceEntityList(
                    new SearchRaceFilterEntity<AutoracePlaceEntity>(
                        new Date('2024-11-01'),
                        new Date('2024-11-30'),
                        [
                            AutoracePlaceEntity.createWithoutId(
                                AutoracePlaceData.create(
                                    new Date('2024-11-04'),
                                    '川口',
                                    'SG',
                                ),
                                getJSTDate(new Date()),
                            ),
                        ],
                    ),
                );
                expect(raceEntityList).toHaveLength(12);
            });
        });

        describe('registerRaceList', () => {
            test('htmlなので登録できない', async () => {
                // テスト実行
                await expect(
                    repository.registerRaceEntityList([]),
                ).rejects.toThrow('HTMLにはデータを登録出来ません');
            });
        });
    });
}
