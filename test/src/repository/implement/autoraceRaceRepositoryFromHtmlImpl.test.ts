import 'reflect-metadata';

import { container } from 'tsyringe';

import { AutoracePlaceData } from '../../../../lib/src/domain/autoracePlaceData';
import type { IRaceDataHtmlGateway } from '../../../../lib/src/gateway/interface/iRaceDataHtmlGateway';
import { MockRaceDataHtmlGateway } from '../../../../lib/src/gateway/mock/mockRaceDataHtmlGateway';
import { AutoracePlaceEntity } from '../../../../lib/src/repository/entity/autoracePlaceEntity';
import { SearchRaceFilterEntity } from '../../../../lib/src/repository/entity/searchRaceFilterEntity';
import { AutoraceRaceRepositoryFromHtmlImpl } from '../../../../lib/src/repository/implement/autoraceRaceRepositoryFromHtmlImpl';
import { getJSTDate } from '../../../../lib/src/utility/date';
import { allowedEnvs } from '../../../../lib/src/utility/env';
import { SkipEnv } from '../../../utility/testDecorators';

describe('AutoraceRaceRepositoryFromHtmlImpl', () => {
    let raceDataHtmlGateway: IRaceDataHtmlGateway;
    let repository: AutoraceRaceRepositoryFromHtmlImpl;

    beforeEach(() => {
        // gatewayのモックを作成
        raceDataHtmlGateway = new MockRaceDataHtmlGateway();

        // DIコンテナにモックを登録
        container.registerInstance('RaceDataHtmlGateway', raceDataHtmlGateway);

        // テスト対象のリポジトリを生成
        repository = container.resolve(AutoraceRaceRepositoryFromHtmlImpl);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('fetchRaceList', () => {
        SkipEnv(
            'レース開催データを正常に取得できる',
            [allowedEnvs.githubActionsCi],
            async () => {
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
