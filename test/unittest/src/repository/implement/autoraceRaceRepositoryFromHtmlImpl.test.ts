import 'reflect-metadata';

import { container } from 'tsyringe';

import { PlaceData } from '../../../../../lib/src/domain/placeData';
import type { IRaceDataHtmlGateway } from '../../../../../lib/src/gateway/interface/iRaceDataHtmlGateway';
import { MockRaceDataHtmlGateway } from '../../../../../lib/src/gateway/mock/mockRaceDataHtmlGateway';
import { MechanicalRacingPlaceEntity } from '../../../../../lib/src/repository/entity/mechanicalRacingPlaceEntity';
import type { MechanicalRacingRaceEntity } from '../../../../../lib/src/repository/entity/mechanicalRacingRaceEntity';
import { SearchRaceFilterEntity } from '../../../../../lib/src/repository/entity/searchRaceFilterEntity';
import { AutoraceRaceRepositoryFromHtmlImpl } from '../../../../../lib/src/repository/implement/autoraceRaceRepositoryFromHtmlImpl';
import type { IRaceRepository } from '../../../../../lib/src/repository/interface/IRaceRepository';
import { getJSTDate } from '../../../../../lib/src/utility/date';
import { allowedEnvs } from '../../../../../lib/src/utility/env';
import { RaceType } from '../../../../../lib/src/utility/raceType';
import { SkipEnv } from '../../../../utility/testDecorators';

describe('AutoraceRaceRepositoryFromHtmlImpl', () => {
    let raceDataHtmlGateway: IRaceDataHtmlGateway;
    let repository: IRaceRepository<
        MechanicalRacingRaceEntity,
        MechanicalRacingPlaceEntity
    >;

    const raceType: RaceType = RaceType.AUTORACE;

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
                    new SearchRaceFilterEntity<MechanicalRacingPlaceEntity>(
                        new Date('2024-11-01'),
                        new Date('2024-11-30'),
                        RaceType.AUTORACE,
                        [
                            MechanicalRacingPlaceEntity.createWithoutId(
                                raceType,
                                PlaceData.create(
                                    raceType,
                                    new Date('2024-11-04'),
                                    '川口',
                                ),
                                'SG',
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
        it('HTMLにはデータを登録できないこと', async () => {
            // テスト実行
            await expect(
                repository.registerRaceEntityList(raceType, []),
            ).rejects.toThrow('HTMLにはデータを登録出来ません');
        });
    });
});
