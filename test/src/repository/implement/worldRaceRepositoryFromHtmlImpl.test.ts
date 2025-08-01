import 'reflect-metadata';

import { container } from 'tsyringe';

import type { IRaceDataHtmlGateway } from '../../../../lib/src/gateway/interface/iRaceDataHtmlGateway';
import { MockRaceDataHtmlGateway } from '../../../../lib/src/gateway/mock/mockRaceDataHtmlGateway';
import { SearchRaceFilterEntity } from '../../../../lib/src/repository/entity/searchRaceFilterEntity';
import type { WorldPlaceEntity } from '../../../../lib/src/repository/entity/worldPlaceEntity';
import { WorldRaceRepositoryFromHtmlImpl } from '../../../../lib/src/repository/implement/worldRaceRepositoryFromHtmlImpl';
import { allowedEnvs } from '../../../../lib/src/utility/env';
import { SkipEnv } from '../../../utility/testDecorators';

describe('WorldRaceRepositoryFromHtmlImpl', () => {
    let raceDataHtmlGateway: IRaceDataHtmlGateway;
    let repository: WorldRaceRepositoryFromHtmlImpl;

    beforeEach(() => {
        // gatewayのモックを作成
        raceDataHtmlGateway = new MockRaceDataHtmlGateway();

        // DIコンテナにモックを登録
        container.registerInstance('RaceDataHtmlGateway', raceDataHtmlGateway);

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
                        new Date('2025-05-01'),
                        new Date('2025-06-30'),
                        [],
                    ),
                );
                expect(raceEntityList).toHaveLength(35);
            },
        );

        SkipEnv(
            '正しいレース開催データを取得できる（データが足りてないこともある）',
            [allowedEnvs.githubActionsCi],
            async () => {
                const raceEntityList = await repository.fetchRaceEntityList(
                    new SearchRaceFilterEntity<WorldPlaceEntity>(
                        new Date('2025-06-01'),
                        new Date('2025-07-31'),
                        [],
                    ),
                );
                expect(raceEntityList).toHaveLength(30);
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
