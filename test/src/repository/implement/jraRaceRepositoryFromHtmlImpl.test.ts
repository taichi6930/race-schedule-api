import 'reflect-metadata';

import { container } from 'tsyringe';

import { JraPlaceData } from '../../../../lib/src/domain/jraPlaceData';
import type { IJraRaceDataHtmlGateway } from '../../../../lib/src/gateway/interface/iJraRaceDataHtmlGateway';
import { MockJraRaceDataHtmlGateway } from '../../../../lib/src/gateway/mock/mockJraRaceDataHtmlGateway';
import { JraPlaceEntity } from '../../../../lib/src/repository/entity/jraPlaceEntity';
import { SearchRaceFilterEntity } from '../../../../lib/src/repository/entity/searchRaceFilterEntity';
import { JraRaceRepositoryFromHtmlImpl } from '../../../../lib/src/repository/implement/jraRaceRepositoryFromHtmlImpl';
import { getJSTDate } from '../../../../lib/src/utility/date';
import { allowedEnvs, ENV } from '../../../../lib/src/utility/env';

if (ENV === allowedEnvs.githubActionsCi) {
    describe('JraRaceRepositoryFromHtmlImpl', () => {
        test('CI環境でテストをスキップ', () => {
            expect(true).toBe(true);
        });
    });
} else {
    describe('JraRaceRepositoryFromHtmlImpl', () => {
        let raceDataHtmlGateway: IJraRaceDataHtmlGateway;
        let repository: JraRaceRepositoryFromHtmlImpl;

        beforeEach(() => {
            // gatwayのモックを作成
            raceDataHtmlGateway = new MockJraRaceDataHtmlGateway();

            // DIコンテナにモックを登録
            container.registerInstance(
                'JraRaceDataHtmlGateway',
                raceDataHtmlGateway,
            );

            // テスト対象のリポジトリを生成
            repository = container.resolve(JraRaceRepositoryFromHtmlImpl);
        });

        afterEach(() => {
            jest.clearAllMocks();
        });

        describe('fetchRaceList', () => {
            test('正しいレース開催データを取得できる', async () => {
                const raceEntityList = await repository.fetchRaceEntityList(
                    new SearchRaceFilterEntity<JraPlaceEntity>(
                        new Date('2024-05-26'),
                        new Date('2024-05-26'),
                        [
                            JraPlaceEntity.createWithoutId(
                                JraPlaceData.create(
                                    new Date('2024-05-26'),
                                    '東京',
                                    1,
                                    1,
                                ),
                                getJSTDate(new Date()),
                            ),
                        ],
                    ),
                );
                expect(raceEntityList).toHaveLength(24);
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
