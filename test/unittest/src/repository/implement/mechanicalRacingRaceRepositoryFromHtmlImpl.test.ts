import 'reflect-metadata';

import { container } from 'tsyringe';

import { PlaceData } from '../../../../../lib/src/domain/placeData';
import type { IRaceDataHtmlGateway } from '../../../../../lib/src/gateway/interface/iRaceDataHtmlGateway';
import { MockRaceDataHtmlGateway } from '../../../../../lib/src/gateway/mock/mockRaceDataHtmlGateway';
import type { MechanicalRacingRaceEntity } from '../../../../../lib/src/repository/entity/mechanicalRacingRaceEntity';
import { PlaceEntity } from '../../../../../lib/src/repository/entity/placeEntity';
import { SearchRaceFilterEntity } from '../../../../../lib/src/repository/entity/searchRaceFilterEntity';
import { AutoraceRaceRepositoryFromHtmlImpl } from '../../../../../lib/src/repository/implement/autoraceRaceRepositoryFromHtmlImpl';
import { BoatraceRaceRepositoryFromHtmlImpl } from '../../../../../lib/src/repository/implement/boatraceRaceRepositoryFromHtmlImpl';
import { KeirinRaceRepositoryFromHtmlImpl } from '../../../../../lib/src/repository/implement/keirinRaceRepositoryFromHtmlImpl';
import type { IRaceRepository } from '../../../../../lib/src/repository/interface/IRaceRepository';
import { getJSTDate } from '../../../../../lib/src/utility/date';
import { allowedEnvs } from '../../../../../lib/src/utility/env';
import { RaceType } from '../../../../../lib/src/utility/raceType';
import { SkipEnv } from '../../../../utility/testDecorators';

// テーブル駆動型テスト
const testCases = [
    {
        name: 'KeirinRaceRepositoryFromHtmlImpl',
        repositoryClass: KeirinRaceRepositoryFromHtmlImpl,
        raceType: RaceType.KEIRIN,
        startDate: new Date('2024-10-20'),
        endDate: new Date('2024-10-20'),
        placeName: '弥彦',
        grade: 'GⅠ',
        placeDate: new Date('2024-10-20'),
        expectedLength: 12,
    },
    {
        name: 'AutoraceRaceRepositoryFromHtmlImpl',
        repositoryClass: AutoraceRaceRepositoryFromHtmlImpl,
        raceType: RaceType.AUTORACE,
        startDate: new Date('2024-11-01'),
        endDate: new Date('2024-11-30'),
        placeName: '川口',
        grade: 'SG',
        placeDate: new Date('2024-11-04'),
        expectedLength: 12,
    },
    {
        name: 'BoatraceRaceRepositoryFromHtmlImpl',
        repositoryClass: BoatraceRaceRepositoryFromHtmlImpl,
        raceType: RaceType.BOATRACE,
        startDate: new Date('2024-11-01'),
        endDate: new Date('2024-11-30'),
        placeName: '下関',
        grade: 'SG',
        placeDate: new Date('2024-11-24'),
        expectedLength: 1,
    },
];

for (const {
    name,
    repositoryClass,
    raceType,
    startDate,
    endDate,
    placeName,
    grade,
    placeDate,
    expectedLength,
} of testCases) {
    describe(name, () => {
        let raceDataHtmlGateway: IRaceDataHtmlGateway;
        let repository: IRaceRepository<
            MechanicalRacingRaceEntity,
            PlaceEntity
        >;

        beforeEach(() => {
            raceDataHtmlGateway = new MockRaceDataHtmlGateway();
            container.registerInstance(
                'RaceDataHtmlGateway',
                raceDataHtmlGateway,
            );
            repository =
                container.resolve<
                    IRaceRepository<MechanicalRacingRaceEntity, PlaceEntity>
                >(repositoryClass);
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
                            startDate,
                            endDate,
                            raceType,
                            [
                                PlaceEntity.createWithoutId(
                                    PlaceData.create(
                                        raceType,
                                        placeDate,
                                        placeName,
                                    ),
                                    undefined,
                                    grade,
                                    getJSTDate(new Date()),
                                ),
                            ],
                        ),
                    );
                    expect(raceEntityList).toHaveLength(expectedLength);
                },
            );
        });

        describe('registerRaceList', () => {
            it('HTMLにはデータを登録できない', async () => {
                await expect(
                    repository.registerRaceEntityList(raceType, []),
                ).rejects.toThrow('HTMLにはデータを登録出来ません');
            });
        });
    });
}
