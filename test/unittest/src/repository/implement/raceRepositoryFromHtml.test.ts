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
import {
    defaultHeldDayData,
    defaultPlaceGrade,
    testRaceTypeListAll,
} from '../../mock/common/baseCommonData';
import { OverseasRaceRepositoryFromHtml } from './../../../../../lib/src/repository/implement/overseasRaceRepositoryFromHtml';

// テーブル駆動型テスト
const testCases = {
    [RaceType.JRA]: [
        {
            name: 'JraRaceRepositoryFromHtml',
            repositoryClass: JraRaceRepositoryFromHtml,
            startDate: new Date('2024-05-26'),
            endDate: new Date('2024-05-26'),
            placeName: '東京',
            placeDate: new Date('2024-05-26'),
            expectedLength: 24,
        },
    ],
    [RaceType.NAR]: [
        {
            name: 'NarRaceRepositoryFromHtml',
            repositoryClass: NarRaceRepositoryFromHtml,
            startDate: new Date('2024-10-02'),
            endDate: new Date('2024-10-02'),
            placeName: '大井',
            placeDate: new Date('2024-10-02'),
            expectedLength: 12,
        },
        {
            name: 'NarRaceRepositoryFromHtml',
            repositoryClass: NarRaceRepositoryFromHtml,
            startDate: new Date('2023-10-08'),
            endDate: new Date('2023-10-08'),
            placeName: '盛岡',
            placeDate: new Date('2023-10-08'),
            expectedLength: 12,
        },
    ],
    [RaceType.OVERSEAS]: [
        {
            name: 'OverseasRaceRepositoryFromHtml',
            repositoryClass: OverseasRaceRepositoryFromHtml,
            startDate: new Date('2025-05-01'),
            endDate: new Date('2025-06-30'),
            placeName: 'パリロンシャン',
            placeDate: new Date('2025-05-01'),
            expectedLength: 35,
        },
        {
            name: 'OverseasRaceRepositoryFromHtml',
            repositoryClass: OverseasRaceRepositoryFromHtml,
            startDate: new Date('2025-06-01'),
            endDate: new Date('2025-07-31'),
            placeName: 'パリロンシャン',
            placeDate: new Date('2025-06-01'),
            expectedLength: 30,
        },
    ],
    [RaceType.KEIRIN]: [
        {
            name: 'KeirinRaceRepositoryFromHtml',
            repositoryClass: KeirinRaceRepositoryFromHtml,
            startDate: new Date('2024-10-20'),
            endDate: new Date('2024-10-20'),
            placeName: '弥彦',
            placeDate: new Date('2024-10-20'),
            expectedLength: 12,
        },
    ],
    [RaceType.AUTORACE]: [
        {
            name: 'AutoraceRaceRepositoryFromHtml',
            repositoryClass: AutoraceRaceRepositoryFromHtml,
            startDate: new Date('2024-11-01'),
            endDate: new Date('2024-11-30'),
            placeName: '川口',
            placeDate: new Date('2024-11-04'),
            expectedLength: 12,
        },
    ],
    [RaceType.BOATRACE]: [
        {
            name: 'BoatraceRaceRepositoryFromHtml',
            repositoryClass: BoatraceRaceRepositoryFromHtml,
            startDate: new Date('2024-11-01'),
            endDate: new Date('2024-11-30'),
            placeName: '下関',
            placeDate: new Date('2024-11-24'),
            expectedLength: 1,
        },
    ],
};

describe.each(testRaceTypeListAll)(
    'RaceRepositoryFromHtml - %s',
    (raceType) => {
        for (const {
            name,
            repositoryClass,
            startDate,
            endDate,
            placeName,
            placeDate,
            expectedLength,
        } of testCases[raceType]) {
            describe(name, () => {
                let raceDataHtmlGateway: IRaceDataHtmlGateway;
                let repository: IRaceRepository;

                beforeEach(() => {
                    raceDataHtmlGateway = new MockRaceDataHtmlGateway();
                    container.registerInstance(
                        'RaceDataHtmlGateway',
                        raceDataHtmlGateway,
                    );
                    repository =
                        container.resolve<IRaceRepository>(repositoryClass);
                });

                afterEach(() => {
                    jest.clearAllMocks();
                });

                describe('fetchRaceList', () => {
                    SkipEnv(
                        `正しいレース開催データを取得できる(${raceType})`,
                        [allowedEnvs.githubActionsCi],
                        async () => {
                            const raceEntityList =
                                await repository.fetchRaceEntityList(
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
                                                      defaultHeldDayData[
                                                          raceType
                                                      ],
                                                      defaultPlaceGrade[
                                                          raceType
                                                      ],
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
    },
);
