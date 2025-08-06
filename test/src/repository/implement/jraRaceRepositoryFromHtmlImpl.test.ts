import 'reflect-metadata';

import { container } from 'tsyringe';

import { JraHeldDayData } from '../../../../lib/src/domain/jraHeldDayData';
import { PlaceData } from '../../../../lib/src/domain/placeData';
import type { IRaceDataHtmlGateway } from '../../../../lib/src/gateway/interface/iRaceDataHtmlGateway';
import { MockRaceDataHtmlGateway } from '../../../../lib/src/gateway/mock/mockRaceDataHtmlGateway';
import { JraPlaceEntity } from '../../../../lib/src/repository/entity/jraPlaceEntity';
import { SearchRaceFilterEntity } from '../../../../lib/src/repository/entity/searchRaceFilterEntity';
import { JraRaceRepositoryFromHtmlImpl } from '../../../../lib/src/repository/implement/jraRaceRepositoryFromHtmlImpl';
import { getJSTDate } from '../../../../lib/src/utility/date';
import { allowedEnvs } from '../../../../lib/src/utility/env';
import { RaceType } from '../../../../lib/src/utility/raceType';
import { SkipEnv } from '../../../utility/testDecorators';

describe('JraRaceRepositoryFromHtmlImpl', () => {
    let raceDataHtmlGateway: IRaceDataHtmlGateway;
    let repository: JraRaceRepositoryFromHtmlImpl;

    beforeEach(() => {
        // gatewayのモックを作成
        raceDataHtmlGateway = new MockRaceDataHtmlGateway();

        // DIコンテナにモックを登録
        container.registerInstance('RaceDataHtmlGateway', raceDataHtmlGateway);

        // テスト対象のリポジトリを生成
        repository = container.resolve(JraRaceRepositoryFromHtmlImpl);
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
                    new SearchRaceFilterEntity<JraPlaceEntity>(
                        new Date('2024-05-26'),
                        new Date('2024-05-26'),
                        [
                            JraPlaceEntity.createWithoutId(
                                PlaceData.create(
                                    RaceType.JRA,
                                    new Date('2024-05-26'),
                                    '東京',
                                ),
                                JraHeldDayData.create(1, 1),
                                getJSTDate(new Date()),
                            ),
                        ],
                    ),
                );
                expect(raceEntityList).toHaveLength(24);
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
