import 'reflect-metadata';

import { container } from 'tsyringe';

import { BoatracePlaceData } from '../../../../lib/src/domain/boatracePlaceData';
import type { IBoatraceRaceDataHtmlGateway } from '../../../../lib/src/gateway/interface/iBoatraceRaceDataHtmlGateway';
import { MockBoatraceRaceDataHtmlGateway } from '../../../../lib/src/gateway/mock/mockBoatraceRaceDataHtmlGateway';
import { BoatracePlaceEntity } from '../../../../lib/src/repository/entity/boatracePlaceEntity';
import { SearchRaceFilterEntity } from '../../../../lib/src/repository/entity/searchRaceFilterEntity';
import { BoatraceRaceRepositoryFromHtmlImpl } from '../../../../lib/src/repository/implement/boatraceRaceRepositoryFromHtmlImpl';
import { getJSTDate } from '../../../../lib/src/utility/date';
import { SkipGitHubActionsCI } from '../../../utility/testDecorators';

describe('BoatraceRaceRepositoryFromHtmlImpl', () => {
    let raceDataHtmlGateway: IBoatraceRaceDataHtmlGateway;
    let repository: BoatraceRaceRepositoryFromHtmlImpl;

    beforeEach(() => {
        // gatwayのモックを作成
        raceDataHtmlGateway = new MockBoatraceRaceDataHtmlGateway();

        // DIコンテナにモックを登録
        container.registerInstance(
            'BoatraceRaceDataHtmlGateway',
            raceDataHtmlGateway,
        );

        // テスト対象のリポジトリを生成
        repository = container.resolve(BoatraceRaceRepositoryFromHtmlImpl);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('fetchRaceList', () => {
        SkipGitHubActionsCI('レース開催データを正常に取得できる', async () => {
            const raceEntityList = await repository.fetchRaceEntityList(
                new SearchRaceFilterEntity<BoatracePlaceEntity>(
                    new Date('2024-11-01'),
                    new Date('2024-11-30'),
                    [
                        BoatracePlaceEntity.createWithoutId(
                            BoatracePlaceData.create(
                                new Date('2024-11-24'),
                                '下関',
                                'SG',
                            ),
                            getJSTDate(new Date()),
                        ),
                    ],
                ),
            );
            expect(raceEntityList).toHaveLength(1);
        });
    });

    describe('registerRaceList', () => {
        SkipGitHubActionsCI('htmlなので登録できない', async () => {
            // テスト実行
            await expect(repository.registerRaceEntityList([])).rejects.toThrow(
                'HTMLにはデータを登録出来ません',
            );
        });
    });
});
