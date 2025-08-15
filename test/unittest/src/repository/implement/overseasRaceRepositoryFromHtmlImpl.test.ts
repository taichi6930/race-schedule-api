import 'reflect-metadata';

import { container } from 'tsyringe';

import type { IRaceDataHtmlGateway } from '../../../../../lib/src/gateway/interface/iRaceDataHtmlGateway';
import { MockRaceDataHtmlGateway } from '../../../../../lib/src/gateway/mock/mockRaceDataHtmlGateway';
import type { HorseRacingPlaceEntity } from '../../../../../lib/src/repository/entity/horseRacingPlaceEntity';
import type { HorseRacingRaceEntity } from '../../../../../lib/src/repository/entity/horseRacingRaceEntity';
import { SearchRaceFilterEntity } from '../../../../../lib/src/repository/entity/searchRaceFilterEntity';
import { OverseasRaceRepositoryFromHtmlImpl } from '../../../../../lib/src/repository/implement/overseasRaceRepositoryFromHtmlImpl';
import type { IRaceRepository } from '../../../../../lib/src/repository/interface/IRaceRepository';
import { allowedEnvs } from '../../../../../lib/src/utility/env';
import { RaceType } from '../../../../../lib/src/utility/raceType';
import { SkipEnv } from '../../../../utility/testDecorators';

describe('OverseasRaceRepositoryFromHtmlImpl', () => {
    let raceDataHtmlGateway: IRaceDataHtmlGateway;
    let repository: IRaceRepository<
        HorseRacingRaceEntity,
        HorseRacingPlaceEntity
    >;

    const raceType: RaceType = RaceType.OVERSEAS;

    beforeEach(() => {
        // gatewayのモックを作成
        raceDataHtmlGateway = new MockRaceDataHtmlGateway();

        // DIコンテナにモックを登録
        container.registerInstance('RaceDataHtmlGateway', raceDataHtmlGateway);

        // テスト対象のリポジトリを生成
        repository = container.resolve(OverseasRaceRepositoryFromHtmlImpl);
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
                    new SearchRaceFilterEntity<HorseRacingPlaceEntity>(
                        new Date('2025-05-01'),
                        new Date('2025-06-30'),
                        raceType,
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
                    new SearchRaceFilterEntity<HorseRacingPlaceEntity>(
                        new Date('2025-06-01'),
                        new Date('2025-07-31'),
                        raceType,
                        [],
                    ),
                );
                expect(raceEntityList).toHaveLength(30);
            },
        );
    });

    describe('registerRaceList', () => {
        it('HTMLにはデータを登録できないこと', async () => {
            // テスト実行
            await expect(
                repository.registerRaceEntityList(raceType, []),
            ).rejects.toThrow('HTMLにはデータを登録出来ません');
        });
    });
});
