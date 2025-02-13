import 'reflect-metadata';

import { container } from 'tsyringe';

import { BoatracePlaceData } from '../../../../lib/src/domain/boatracePlaceData';
import type { IBoatraceRaceDataHtmlGateway } from '../../../../lib/src/gateway/interface/iBoatraceRaceDataHtmlGateway';
import { MockBoatraceRaceDataHtmlGateway } from '../../../../lib/src/gateway/mock/mockBoatraceRaceDataHtmlGateway';
import { BoatracePlaceEntity } from '../../../../lib/src/repository/entity/boatracePlaceEntity';
import { SearchRaceFilterEntity } from '../../../../lib/src/repository/entity/searchRaceFilterEntity';
import { BoatraceRaceRepositoryFromHtmlImpl } from '../../../../lib/src/repository/implement/boatraceRaceRepositoryFromHtmlImpl';
import { getJSTDate } from '../../../../lib/src/utility/date';
import { allowedEnvs, ENV } from '../../../../lib/src/utility/env';

if (ENV !== allowedEnvs.githubActionsCi) {
    describe('BoatraceRaceRepositoryFromHtmlImpl', () => {
        let boatraceRaceDataHtmlGateway: IBoatraceRaceDataHtmlGateway;
        let repository: BoatraceRaceRepositoryFromHtmlImpl;

        beforeEach(() => {
            // gatwayのモックを作成
            boatraceRaceDataHtmlGateway = new MockBoatraceRaceDataHtmlGateway();

            // DIコンテナにモックを登録
            container.registerInstance(
                'BoatraceRaceDataHtmlGateway',
                boatraceRaceDataHtmlGateway,
            );

            // テスト対象のリポジトリを生成
            repository = container.resolve(BoatraceRaceRepositoryFromHtmlImpl);
        });

        describe('fetchPlaceList', () => {
            test('正しいボートレースデータを取得できる', async () => {
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
            test('htmlなので登録できない', async () => {
                // テスト実行
                await expect(
                    repository.registerRaceEntityList([]),
                ).rejects.toThrow('HTMLにはデータを登録出来ません');
            });
        });
    });
} else {
    describe('BoatraceRaceRepositoryFromHtmlImpl', () => {
        test('CI環境でテストをスキップ', () => {
            expect(true).toBe(true);
        });
    });
}
