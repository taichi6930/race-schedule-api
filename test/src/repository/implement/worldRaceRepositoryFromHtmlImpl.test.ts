import 'reflect-metadata';

import { container } from 'tsyringe';

import type { IWorldRaceDataHtmlGateway } from '../../../../lib/src/gateway/interface/iWorldRaceDataHtmlGateway';
import { MockWorldRaceDataHtmlGateway } from '../../../../lib/src/gateway/mock/mockWorldRaceDataHtmlGateway';
import { SearchRaceFilterEntity } from '../../../../lib/src/repository/entity/searchRaceFilterEntity';
import type { WorldPlaceEntity } from '../../../../lib/src/repository/entity/worldPlaceEntity';
import { WorldRaceRepositoryFromHtmlImpl } from '../../../../lib/src/repository/implement/worldRaceRepositoryFromHtmlImpl';
import { allowedEnvs } from '../../../../lib/src/utility/env';
import { SkipEnv } from '../../../utility/testDecorators';

describe('WorldRaceRepositoryFromHtmlImpl', () => {
    let raceDataHtmlGateway: IWorldRaceDataHtmlGateway;
    let repository: WorldRaceRepositoryFromHtmlImpl;

    beforeEach(() => {
        // gatwayのモックを作成
        raceDataHtmlGateway = new MockWorldRaceDataHtmlGateway();

        // DIコンテナにモックを登録
        container.registerInstance(
            'WorldRaceDataHtmlGateway',
            raceDataHtmlGateway,
        );

        // テスト対象のリポジトリを生成
        repository = container.resolve(WorldRaceRepositoryFromHtmlImpl);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('fetchRaceList', () => {
        SkipEnv(
            '正しいレース開催データを取得できる',
            [allowedEnvs.githubActionsCi],
            async () => {
                const raceEntityList = await repository.fetchRaceEntityList(
                    new SearchRaceFilterEntity<WorldPlaceEntity>(
                        new Date('2024-11-01'),
                        new Date('2024-12-31'),
                        [],
                    ),
                );
                expect(raceEntityList).toHaveLength(20);
            },
        );

        SkipEnv(
            '正しいレース開催データを取得できる（データが足りてないこともある）',
            [allowedEnvs.githubActionsCi],
            async () => {
                const raceEntityList = await repository.fetchRaceEntityList(
                    new SearchRaceFilterEntity<WorldPlaceEntity>(
                        new Date('2025-02-01'),
                        new Date('2025-03-31'),
                        [],
                    ),
                );
                expect(raceEntityList).toHaveLength(6);
            },
        );
    });

    describe('registerRaceList', () => {
        SkipEnv(
            'htmlなので登録できない',
            [allowedEnvs.githubActionsCi],
            async () => {
                // テスト実行
                await expect(
                    repository.registerRaceEntityList([]),
                ).rejects.toThrow('HTMLにはデータを登録出来ません');
            },
        );
    });
});
