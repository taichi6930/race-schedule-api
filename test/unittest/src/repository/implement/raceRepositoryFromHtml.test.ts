import 'reflect-metadata';

import { container } from 'tsyringe';

import { PlaceData } from '../../../../../lib/src/domain/placeData';
import type { IRaceDataHtmlGateway } from '../../../../../lib/src/gateway/interface/iRaceDataHtmlGateway';
import { MockRaceDataHtmlGateway } from '../../../../../lib/src/gateway/mock/mockRaceDataHtmlGateway';
import { PlaceEntity } from '../../../../../lib/src/repository/entity/placeEntity';
import { SearchRaceFilterEntity } from '../../../../../lib/src/repository/entity/searchRaceFilterEntity';
import { AutoraceRaceRepositoryFromHtml } from '../../../../../lib/src/repository/implement/autoraceRaceRepositoryFromHtml';
import { BoatraceRaceRepositoryFromHtml } from '../../../../../lib/src/repository/implement/boatraceRaceRepositoryFromHtml';
import { JraRaceRepositoryFromHtml } from '../../../../../lib/src/repository/implement/jraRaceRepositoryFromHtml';
import { KeirinRaceRepositoryFromHtml } from '../../../../../lib/src/repository/implement/keirinRaceRepositoryFromHtml';
import { NarRaceRepositoryFromHtml } from '../../../../../lib/src/repository/implement/narRaceRepositoryFromHtml';
import type { IRaceRepository } from '../../../../../lib/src/repository/interface/IRaceRepository';
import { getJSTDate } from '../../../../../lib/src/utility/date';
import { allowedEnvs } from '../../../../../lib/src/utility/env';
import { RaceType } from '../../../../../lib/src/utility/raceType';
import { SkipEnv } from '../../../../utility/testDecorators';
import { defaultHeldDayData } from '../../mock/common/baseCommonData';
import { OverseasRaceRepositoryFromHtml } from './../../../../../lib/src/repository/implement/overseasRaceRepositoryFromHtml';

// テーブル駆動型テスト
const testCases = [
    {
        name: 'JraRaceRepositoryFromHtml',
        repositoryClass: JraRaceRepositoryFromHtml,
        raceType: RaceType.JRA,
        startDate: new Date('2024-05-26'),
        endDate: new Date('2024-05-26'),
        placeName: '東京',
        grade: undefined,
        placeDate: new Date('2024-05-26'),
        expectedLength: 24,
    },
    {
        name: 'NarRaceRepositoryFromHtml',
        repositoryClass: NarRaceRepositoryFromHtml,
        raceType: RaceType.NAR,
        startDate: new Date('2024-10-02'),
        endDate: new Date('2024-10-02'),
        placeName: '大井',
        grade: undefined,
        placeDate: new Date('2024-10-02'),
        expectedLength: 12,
    },
    {
        name: 'NarRaceRepositoryFromHtml',
        repositoryClass: NarRaceRepositoryFromHtml,
        raceType: RaceType.NAR,
        startDate: new Date('2023-10-08'),
        endDate: new Date('2023-10-08'),
        placeName: '盛岡',
        grade: undefined,
        placeDate: new Date('2023-10-08'),
        expectedLength: 12,
    },
    {
        name: 'OverseasRaceRepositoryFromHtml',
        repositoryClass: OverseasRaceRepositoryFromHtml,
        raceType: RaceType.OVERSEAS,
        startDate: new Date('2025-05-01'),
        endDate: new Date('2025-06-30'),
        placeName: undefined,
        grade: undefined,
        placeDate: undefined,
        expectedLength: 35,
    },
    {
        name: 'OverseasRaceRepositoryFromHtml',
        repositoryClass: OverseasRaceRepositoryFromHtml,
        raceType: RaceType.OVERSEAS,
        startDate: new Date('2025-06-01'),
        endDate: new Date('2025-07-31'),
        placeName: undefined,
        grade: undefined,
        placeDate: undefined,
        expectedLength: 30,
    },
    {
        name: 'KeirinRaceRepositoryFromHtml',
        repositoryClass: KeirinRaceRepositoryFromHtml,
        raceType: RaceType.KEIRIN,
        startDate: new Date('2024-10-20'),
        endDate: new Date('2024-10-20'),
        placeName: '弥彦',
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
        grade: 'SG',
        placeDate: new Date('2024-11-04'),
        expectedLength: 12,
    },
    {
        name: 'BoatraceRaceRepositoryFromHtml',
        repositoryClass: BoatraceRaceRepositoryFromHtml,
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
        let repository: IRaceRepository;

        beforeEach(() => {
            raceDataHtmlGateway = new MockRaceDataHtmlGateway();
            container.registerInstance(
                'RaceDataHtmlGateway',
                raceDataHtmlGateway,
            );
            repository = container.resolve<IRaceRepository>(repositoryClass);
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
                        new SearchRaceFilterEntity(
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
                                          defaultHeldDayData[raceType],
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
