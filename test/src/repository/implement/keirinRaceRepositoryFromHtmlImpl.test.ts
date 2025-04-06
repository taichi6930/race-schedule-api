import 'reflect-metadata';

import { container } from 'tsyringe';

import { KeirinPlaceData } from '../../../../lib/src/domain/keirinPlaceData';
import type { IKeirinRaceDataHtmlGateway } from '../../../../lib/src/gateway/interface/iKeirinRaceDataHtmlGateway';
import { MockKeirinRaceDataHtmlGateway } from '../../../../lib/src/gateway/mock/mockKeirinRaceDataHtmlGateway';
import { KeirinPlaceEntity } from '../../../../lib/src/repository/entity/keirinPlaceEntity';
import { SearchRaceFilterEntity } from '../../../../lib/src/repository/entity/searchRaceFilterEntity';
import { KeirinRaceRepositoryFromHtmlImpl } from '../../../../lib/src/repository/implement/keirinRaceRepositoryFromHtmlImpl';
import { getJSTDate } from '../../../../lib/src/utility/date';
import { SkipGitHubActionsCI } from '../../../utility/testDecorators';

describe('KeirinRaceRepositoryFromHtmlImpl', () => {
    let raceDataHtmlGateway: IKeirinRaceDataHtmlGateway;
    let repository: KeirinRaceRepositoryFromHtmlImpl;

    beforeEach(() => {
        // gatwayのモックを作成
        raceDataHtmlGateway = new MockKeirinRaceDataHtmlGateway();

        // DIコンテナにモックを登録
        container.registerInstance(
            'KeirinRaceDataHtmlGateway',
            raceDataHtmlGateway,
        );

        // テスト対象のリポジトリを生成
        repository = container.resolve(KeirinRaceRepositoryFromHtmlImpl);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('fetchRaceList', () => {
        SkipGitHubActionsCI('正しいレース開催データを取得できる', async () => {
            const raceEntityList = await repository.fetchRaceEntityList(
                new SearchRaceFilterEntity<KeirinPlaceEntity>(
                    new Date('2024-10-20'),
                    new Date('2024-10-20'),
                    [
                        KeirinPlaceEntity.createWithoutId(
                            KeirinPlaceData.create(
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
