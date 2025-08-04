import 'reflect-metadata';

import { container } from 'tsyringe';

import { PlaceData } from '../../../../lib/src/domain/placeData';
import type { IRaceDataHtmlGateway } from '../../../../lib/src/gateway/interface/iRaceDataHtmlGateway';
import { MockRaceDataHtmlGateway } from '../../../../lib/src/gateway/mock/mockRaceDataHtmlGateway';
import { PlaceEntity } from '../../../../lib/src/repository/entity/placeEntity';
import { SearchRaceFilterEntity } from '../../../../lib/src/repository/entity/searchRaceFilterEntity';
import { KeirinRaceRepositoryFromHtmlImpl } from '../../../../lib/src/repository/implement/keirinRaceRepositoryFromHtmlImpl';
import { getJSTDate } from '../../../../lib/src/utility/date';
import { RaceType } from '../../../../lib/src/utility/raceType';
import { allowedEnvs, SkipEnv } from '../../../utility/testDecorators';

describe('KeirinRaceRepositoryFromHtmlImpl', () => {
    let raceDataHtmlGateway: IRaceDataHtmlGateway;
    let repository: KeirinRaceRepositoryFromHtmlImpl;

    beforeEach(() => {
        // gatewayのモックを作成
        raceDataHtmlGateway = new MockRaceDataHtmlGateway();

        // DIコンテナにモックを登録
        container.registerInstance('RaceDataHtmlGateway', raceDataHtmlGateway);

        // テスト対象のリポジトリを生成
        repository = container.resolve(KeirinRaceRepositoryFromHtmlImpl);
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
                    new SearchRaceFilterEntity<PlaceEntity>(
                        new Date('2024-10-20'),
                        new Date('2024-10-20'),
                        [
                            PlaceEntity.createWithoutId(
                                RaceType.KEIRIN,
                                PlaceData.create(
                                    RaceType.KEIRIN,
                                    new Date('2024-10-20'),
                                    '弥彦',
                                    'GⅠ',
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
