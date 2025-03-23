import 'reflect-metadata';

import { container } from 'tsyringe';

import { NarPlaceData } from '../../../../lib/src/domain/narPlaceData';
import type { INarRaceDataHtmlGateway } from '../../../../lib/src/gateway/interface/iNarRaceDataHtmlGateway';
import { MockNarRaceDataHtmlGateway } from '../../../../lib/src/gateway/mock/mockNarRaceDataHtmlGateway';
import { NarPlaceEntity } from '../../../../lib/src/repository/entity/narPlaceEntity';
import { SearchRaceFilterEntity } from '../../../../lib/src/repository/entity/searchRaceFilterEntity';
import { NarRaceRepositoryFromHtmlImpl } from '../../../../lib/src/repository/implement/narRaceRepositoryFromHtmlImpl';
import { getJSTDate } from '../../../../lib/src/utility/date';
import { allowedEnvs, ENV } from '../../../../lib/src/utility/env';

if (ENV === allowedEnvs.githubActionsCi) {
    describe('NarRaceRepositoryFromHtmlImpl', () => {
        test('CI環境でテストをスキップ', () => {
            expect(true).toBe(true);
        });
    });
} else {
    describe('NarRaceRepositoryFromHtmlImpl', () => {
        let raceDataHtmlGateway: INarRaceDataHtmlGateway;
        let repository: NarRaceRepositoryFromHtmlImpl;

        beforeEach(() => {
            // gatwayのモックを作成
            raceDataHtmlGateway = new MockNarRaceDataHtmlGateway();

            // DIコンテナにモックを登録
            container.registerInstance(
                'NarRaceDataHtmlGateway',
                raceDataHtmlGateway,
            );

            // テスト対象のリポジトリを生成
            repository = container.resolve(NarRaceRepositoryFromHtmlImpl);
        });

        afterEach(() => {
            jest.clearAllMocks();
        });

        describe('fetchRaceList', () => {
            test('正しいレース開催データを取得できる', async () => {
                const raceEntityList = await repository.fetchRaceEntityList(
                    new SearchRaceFilterEntity<NarPlaceEntity>(
                        new Date('2024-10-02'),
                        new Date('2024-10-02'),
                        [
                            NarPlaceEntity.createWithoutId(
                                NarPlaceData.create(
                                    new Date('2024-10-02'),
                                    '大井',
                                ),
                                getJSTDate(new Date()),
                            ),
                        ],
                    ),
                );
                expect(raceEntityList).toHaveLength(12);
            });
            test('正しいレース開催データを取得できる（データが足りてないこともある）', async () => {
                const raceEntityList = await repository.fetchRaceEntityList(
                    new SearchRaceFilterEntity<NarPlaceEntity>(
                        new Date('2023-10-08'),
                        new Date('2023-10-08'),
                        [
                            NarPlaceEntity.createWithoutId(
                                NarPlaceData.create(
                                    new Date('2023-10-08'),
                                    '盛岡',
                                ),
                                getJSTDate(new Date()),
                            ),
                        ],
                    ),
                );
                expect(raceEntityList).toHaveLength(12);
            });
            test('正しいレース開催データを取得できる', async () => {
                const raceEntityList = await repository.fetchRaceEntityList(
                    new SearchRaceFilterEntity<NarPlaceEntity>(
                        new Date('2024-10-02'),
                        new Date('2024-10-02'),
                        [
                            NarPlaceEntity.createWithoutId(
                                NarPlaceData.create(
                                    new Date('2024-10-02'),
                                    '大井',
                                ),
                                getJSTDate(new Date()),
                            ),
                        ],
                    ),
                );
                expect(raceEntityList).toHaveLength(12);
            });
            test('データがない場合は空のリストを返す', async () => {
                const raceEntityList = await repository.fetchRaceEntityList(
                    new SearchRaceFilterEntity<NarPlaceEntity>(
                        new Date('2024-09-01'),
                        new Date('2024-09-02'),
                        [
                            NarPlaceEntity.createWithoutId(
                                NarPlaceData.create(
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
            });
        });

        describe('registerRaceList', () => {
            test('htmlなので登録できない', async () => {
                // テスト実行
                await expect(
                    repository.registerRaceEntityList([]),
                ).rejects.toThrow('HTMLにはデータを登録出来ません');
            });
        });
    });
}
