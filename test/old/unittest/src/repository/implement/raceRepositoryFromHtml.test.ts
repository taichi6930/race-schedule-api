import 'reflect-metadata';

import { afterEach } from 'node:test';

import { container } from 'tsyringe';

import type { IRaceDataHtmlGatewayForAWS } from '../../../../../../lib/src/gateway/interface/iRaceDataHtmlGateway';
import { MockRaceDataHtmlGateway } from '../../../../../../lib/src/gateway/mock/mockRaceDataHtmlGateway';
import { SearchRaceFilterEntityForAWS } from '../../../../../../lib/src/repository/entity/searchRaceFilterEntity';
import { AutoraceRaceRepositoryFromHtmlForAWS } from '../../../../../../lib/src/repository/implement/raceRepositoryFromHtml/autoraceRaceRepositoryFromHtml';
import { BoatraceRaceRepositoryFromHtmlForAWS } from '../../../../../../lib/src/repository/implement/raceRepositoryFromHtml/boatraceRaceRepositoryFromHtml';
import { JraRaceRepositoryFromHtml } from '../../../../../../lib/src/repository/implement/raceRepositoryFromHtml/jraRaceRepositoryFromHtml';
import { KeirinRaceRepositoryFromHtmlForAWS } from '../../../../../../lib/src/repository/implement/raceRepositoryFromHtml/keirinRaceRepositoryFromHtml';
import { NarRaceRepositoryFromHtml } from '../../../../../../lib/src/repository/implement/raceRepositoryFromHtml/narRaceRepositoryFromHtml';
import { OverseasRaceRepositoryFromHtmlForAWS } from '../../../../../../lib/src/repository/implement/raceRepositoryFromHtml/overseasRaceRepositoryFromHtmlForAWS';
import type { IRaceRepositoryForAWS } from '../../../../../../lib/src/repository/interface/IRaceRepository';
import { allowedEnvs } from '../../../../../../lib/src/utility/env';
import { PlaceData } from '../../../../../../src/domain/placeData';
import { PlaceEntity } from '../../../../../../src/repository/entity/placeEntity';
import { RaceType } from '../../../../../../src/utility/raceType';
import {
    defaultHeldDayData,
    defaultPlaceGrade,
    testRaceTypeListAll,
} from '../../../../../unittest/src/mock/common/baseCommonData';
import { SkipEnv } from '../../../../../utility/testDecorators';
import { clearMocks } from '../../../../../utility/testSetupHelper';

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
            repositoryClass: OverseasRaceRepositoryFromHtmlForAWS,
            startDate: new Date('2025-05-01'),
            endDate: new Date('2025-06-30'),
            placeName: 'パリロンシャン',
            placeDate: new Date('2025-05-01'),
            expectedLength: 35,
        },
        {
            name: 'OverseasRaceRepositoryFromHtml',
            repositoryClass: OverseasRaceRepositoryFromHtmlForAWS,
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
            repositoryClass: KeirinRaceRepositoryFromHtmlForAWS,
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
            repositoryClass: AutoraceRaceRepositoryFromHtmlForAWS,
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
            repositoryClass: BoatraceRaceRepositoryFromHtmlForAWS,
            startDate: new Date('2024-11-01'),
            endDate: new Date('2024-11-30'),
            placeName: '下関',
            placeDate: new Date('2024-11-24'),
            expectedLength: 1,
        },
    ],
};

describe.each(testRaceTypeListAll)('RaceRepositoryFromHtml(%s)', (raceType) => {
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
            let raceDataHtmlGateway: IRaceDataHtmlGatewayForAWS;
            let repository: IRaceRepositoryForAWS;

            beforeEach(() => {
                raceDataHtmlGateway = new MockRaceDataHtmlGateway();
                container.registerInstance(
                    'RaceDataHtmlGateway',
                    raceDataHtmlGateway,
                );
                repository =
                    container.resolve<IRaceRepositoryForAWS>(repositoryClass);
            });

            afterEach(() => {
                clearMocks();
            });

            describe('fetchRaceList', () => {
                SkipEnv(
                    `正しいレース開催データを取得できる(${raceType})`,
                    [allowedEnvs.githubActionsCi],
                    async () => {
                        const raceEntityList =
                            await repository.fetchRaceEntityList(
                                new SearchRaceFilterEntityForAWS(
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
                                                  defaultPlaceGrade[raceType],
                                              ),
                                          ],
                                ),
                            );
                        expect(raceEntityList).toHaveLength(expectedLength);
                    },
                );
            });

            describe('upsertRaceList', () => {
                it('HTMLにはデータを登録できない', async () => {
                    await expect(
                        repository.upsertRaceEntityList(raceType, []),
                    ).rejects.toThrow('HTMLにはデータを登録出来ません');
                });
            });
        });
    }
});
