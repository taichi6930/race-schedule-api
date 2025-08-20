import 'reflect-metadata';

import { container } from 'tsyringe';

import { HeldDayData } from '../../../../../lib/src/domain/heldDayData';
import { PlaceData } from '../../../../../lib/src/domain/placeData';
import type { IRaceDataHtmlGateway } from '../../../../../lib/src/gateway/interface/iRaceDataHtmlGateway';
import { MockRaceDataHtmlGateway } from '../../../../../lib/src/gateway/mock/mockRaceDataHtmlGateway';
import { PlaceEntity } from '../../../../../lib/src/repository/entity/placeEntity';
import type { RaceEntity } from '../../../../../lib/src/repository/entity/raceEntity';
import { SearchRaceFilterEntity } from '../../../../../lib/src/repository/entity/searchRaceFilterEntity';
import { AutoraceRaceRepositoryFromHtml } from '../../../../../lib/src/repository/implement/autoraceRaceRepositoryFromHtml';
import { BoatraceRaceRepositoryFromHtmlImpl } from '../../../../../lib/src/repository/implement/boatraceRaceRepositoryFromHtmlImpl';
import { JraRaceRepositoryFromHtmlImpl } from '../../../../../lib/src/repository/implement/jraRaceRepositoryFromHtmlImpl';
import { KeirinRaceRepositoryFromHtmlImpl } from '../../../../../lib/src/repository/implement/keirinRaceRepositoryFromHtmlImpl';
import { NarRaceRepositoryFromHtmlImpl } from '../../../../../lib/src/repository/implement/narRaceRepositoryFromHtmlImpl';
import type { IRaceRepository } from '../../../../../lib/src/repository/interface/IRaceRepository';
import { getJSTDate } from '../../../../../lib/src/utility/date';
import { allowedEnvs } from '../../../../../lib/src/utility/env';
import { RaceType } from '../../../../../lib/src/utility/raceType';
import { SkipEnv } from '../../../../utility/testDecorators';
import { OverseasRaceRepositoryFromHtmlImpl } from './../../../../../lib/src/repository/implement/overseasRaceRepositoryFromHtmlImpl';

// テーブル駆動型テスト
const testCases = [
    {
        name: 'JraRaceRepositoryFromHtmlImpl',
        repositoryClass: JraRaceRepositoryFromHtmlImpl,
        raceType: RaceType.JRA,
        startDate: new Date('2024-05-26'),
        endDate: new Date('2024-05-26'),
        placeName: '東京',
        heldDayData: HeldDayData.create(1, 1),
        grade: undefined,
        placeDate: new Date('2024-05-26'),
        expectedLength: 24,
    },
    {
        name: 'NarRaceRepositoryFromHtmlImpl',
        repositoryClass: NarRaceRepositoryFromHtmlImpl,
        raceType: RaceType.NAR,
        startDate: new Date('2024-10-02'),
        endDate: new Date('2024-10-02'),
        placeName: '大井',
        heldDayData: undefined,
        grade: undefined,
        placeDate: new Date('2024-10-02'),
        expectedLength: 12,
    },
    {
        name: 'NarRaceRepositoryFromHtmlImpl',
        repositoryClass: NarRaceRepositoryFromHtmlImpl,
        raceType: RaceType.NAR,
        startDate: new Date('2023-10-08'),
        endDate: new Date('2023-10-08'),
        placeName: '盛岡',
        heldDayData: undefined,
        grade: undefined,
        placeDate: new Date('2023-10-08'),
        expectedLength: 12,
    },
    {
        name: 'OverseasRaceRepositoryFromHtmlImpl',
        repositoryClass: OverseasRaceRepositoryFromHtmlImpl,
        raceType: RaceType.OVERSEAS,
        startDate: new Date('2025-05-01'),
        endDate: new Date('2025-06-30'),
        placeName: undefined,
        heldDayData: undefined,
        grade: undefined,
        placeDate: undefined,
        expectedLength: 35,
    },
    {
        name: 'OverseasRaceRepositoryFromHtmlImpl',
        repositoryClass: OverseasRaceRepositoryFromHtmlImpl,
        raceType: RaceType.OVERSEAS,
        startDate: new Date('2025-06-01'),
        endDate: new Date('2025-07-31'),
        placeName: undefined,
        heldDayData: undefined,
        grade: undefined,
        placeDate: undefined,
        expectedLength: 30,
    },
    {
        name: 'KeirinRaceRepositoryFromHtmlImpl',
        repositoryClass: KeirinRaceRepositoryFromHtmlImpl,
        raceType: RaceType.KEIRIN,
        startDate: new Date('2024-10-20'),
        endDate: new Date('2024-10-20'),
        placeName: '弥彦',
        heldDayData: undefined,
        grade: 'GⅠ',
        placeDate: new Date('2024-10-20'),
        expectedLength: 12,
    },
    {
        name: 'AutoraceRaceRepositoryFromHtml',
        repositoryClass: AutoraceRaceRepositoryFromHtml,
        raceType: RaceType.AUTORACE,
        startDate: new Date('2024-11-01'),
        endDate: new Date('2024-11-30'),
        placeName: '川口',
        heldDayData: undefined,
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
        heldDayData: undefined,
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
    heldDayData,
    grade,
    placeDate,
    expectedLength,
} of testCases) {
    describe(name, () => {
        let raceDataHtmlGateway: IRaceDataHtmlGateway;
        let repository: IRaceRepository<RaceEntity, PlaceEntity>;

        beforeEach(() => {
            raceDataHtmlGateway = new MockRaceDataHtmlGateway();
            container.registerInstance(
                'RaceDataHtmlGateway',
                raceDataHtmlGateway,
            );
            repository =
                container.resolve<IRaceRepository<RaceEntity, PlaceEntity>>(
                    repositoryClass,
                );
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
                            raceType === RaceType.OVERSEAS
                                ? []
                                : [
                                      PlaceEntity.createWithoutId(
                                          PlaceData.create(
                                              raceType,
                                              placeDate,
                                              placeName,
                                          ),
                                          heldDayData,
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
