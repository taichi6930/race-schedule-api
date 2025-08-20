import 'reflect-metadata';

import { container } from 'tsyringe';

import type { IPlaceDataHtmlGateway } from '../../../../../lib/src/gateway/interface/iPlaceDataHtmlGateway';
import { MockPlaceDataHtmlGateway } from '../../../../../lib/src/gateway/mock/mockPlaceDataHtmlGateway';
import type { PlaceEntity } from '../../../../../lib/src/repository/entity/placeEntity';
import { SearchPlaceFilterEntity } from '../../../../../lib/src/repository/entity/searchPlaceFilterEntity';
import { JraPlaceRepositoryFromHtmlImpl } from '../../../../../lib/src/repository/implement/jraPlaceRepositoryFromHtmlImpl';
import type { IPlaceRepository } from '../../../../../lib/src/repository/interface/IPlaceRepository';
import { RaceType } from '../../../../../lib/src/utility/raceType';
import { allowedEnvs, SkipEnv } from '../../../../utility/testDecorators';
import { basePlaceEntity } from '../../mock/common/baseCommonData';

describe('JraPlaceRepositoryFromHtmlImpl', () => {
    let placeDataHtmlgateway: IPlaceDataHtmlGateway;
    let repository: IPlaceRepository<PlaceEntity>;

    const raceType: RaceType = RaceType.JRA;

    beforeEach(() => {
        // gatewayのモックを作成
        placeDataHtmlgateway = new MockPlaceDataHtmlGateway();

        // DIコンテナにモックを登録
        container.registerInstance(
            'PlaceDataHtmlGateway',
            placeDataHtmlgateway,
        );

        // テスト対象のリポジトリを生成
        repository = container.resolve(JraPlaceRepositoryFromHtmlImpl);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('fetchPlaceList', () => {
        SkipEnv(
            '正しい開催場データを取得できる',
            [allowedEnvs.githubActionsCi],
            async () => {
                const placeEntityList = await repository.fetchPlaceEntityList(
                    new SearchPlaceFilterEntity(
                        new Date('2024-01-01'),
                        new Date('2024-12-31'),
                        raceType,
                    ),
                );
                expect(placeEntityList).toHaveLength(288);
            },
        );
    });

    describe('registerPlaceList', () => {
        it('htmlなので登録できない', async () => {
            // テスト実行
            await expect(
                repository.registerPlaceEntityList(raceType, [
                    basePlaceEntity(RaceType.JRA),
                ]),
            ).resolves.toEqual({
                code: 500,
                message: 'HTMLにはデータを登録出来ません',
                successData: [],
                failureData: [basePlaceEntity(RaceType.JRA)],
            });
        });
    });
});
