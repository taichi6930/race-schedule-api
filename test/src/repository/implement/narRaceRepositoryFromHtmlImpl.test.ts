import 'reflect-metadata';

import { container } from 'tsyringe';

import { PlaceData } from '../../../../lib/src/domain/placeData';
import type { IRaceDataHtmlGateway } from '../../../../lib/src/gateway/interface/iRaceDataHtmlGateway';
import { MockRaceDataHtmlGateway } from '../../../../lib/src/gateway/mock/mockRaceDataHtmlGateway';
import { NarPlaceEntity } from '../../../../lib/src/repository/entity/narPlaceEntity';
import { SearchRaceFilterEntity } from '../../../../lib/src/repository/entity/searchRaceFilterEntity';
import { NarRaceRepositoryFromHtmlImpl } from '../../../../lib/src/repository/implement/narRaceRepositoryFromHtmlImpl';
import { getJSTDate } from '../../../../lib/src/utility/date';
import { allowedEnvs } from '../../../../lib/src/utility/env';
import { RaceType } from '../../../../lib/src/utility/raceType';
import { SkipEnv } from '../../../utility/testDecorators';

describe('NarRaceRepositoryFromHtmlImpl', () => {
    let raceDataHtmlGateway: IRaceDataHtmlGateway;
    let repository: NarRaceRepositoryFromHtmlImpl;

    beforeEach(() => {
        // gatewayのモックを作成
        raceDataHtmlGateway = new MockRaceDataHtmlGateway();

        // DIコンテナにモックを登録
        container.registerInstance('RaceDataHtmlGateway', raceDataHtmlGateway);

        // テスト対象のリポジトリを生成
        repository = container.resolve(NarRaceRepositoryFromHtmlImpl);
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
                    new SearchRaceFilterEntity<NarPlaceEntity>(
                        new Date('2024-10-02'),
                        new Date('2024-10-02'),
                        [
                            NarPlaceEntity.createWithoutId(
                                PlaceData.create(
                                    RaceType.NAR,
                                    new Date('2024-10-02'),
                                    '大井',
                                ),
                                getJSTDate(new Date()),
                            ),
                        ],
                    ),
                );
                expect(raceEntityList).toHaveLength(12);
            },
        );
        SkipEnv(
            '正しいレース開催データを取得できる（データが足りてないこともある）',
            [allowedEnvs.githubActionsCi],
            async () => {
                const raceEntityList = await repository.fetchRaceEntityList(
                    new SearchRaceFilterEntity<NarPlaceEntity>(
                        new Date('2023-10-08'),
                        new Date('2023-10-08'),
                        [
                            NarPlaceEntity.createWithoutId(
                                PlaceData.create(
                                    RaceType.NAR,
                                    new Date('2023-10-08'),
                                    '盛岡',
                                ),
                                getJSTDate(new Date()),
                            ),
                        ],
                    ),
                );
                expect(raceEntityList).toHaveLength(12);
            },
        );
        SkipEnv(
            '正しいレース開催データを取得できる',
            [allowedEnvs.githubActionsCi],
            async () => {
                const raceEntityList = await repository.fetchRaceEntityList(
                    new SearchRaceFilterEntity<NarPlaceEntity>(
                        new Date('2024-10-02'),
                        new Date('2024-10-02'),
                        [
                            NarPlaceEntity.createWithoutId(
                                PlaceData.create(
                                    RaceType.NAR,
                                    new Date('2024-10-02'),
                                    '大井',
                                ),
                                getJSTDate(new Date()),
                            ),
                        ],
                    ),
                );
                expect(raceEntityList).toHaveLength(12);
            },
        );
        SkipEnv(
            'データがない場合は空のリストを返す',
            [allowedEnvs.githubActionsCi],
            async () => {
                const raceEntityList = await repository.fetchRaceEntityList(
                    new SearchRaceFilterEntity<NarPlaceEntity>(
                        new Date('2024-09-01'),
                        new Date('2024-09-02'),
                        [
                            NarPlaceEntity.createWithoutId(
                                PlaceData.create(
                                    RaceType.NAR,
                                    new Date('2024-09-02'),
                                    '大井',
                                ),
                                getJSTDate(new Date()),
                            ),
                        ],
                    ),
                );

                // データがない場合は空のリストを返す
                expect(raceEntityList).toHaveLength(0);
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
