import 'reflect-metadata';

import { container } from 'tsyringe';

import { PlaceData } from '../../../../../src/domain/placeData';
import type { IRaceDataHtmlGateway } from '../../../../../src/gateway/interface/iRaceDataHtmlGateway';
import { MockRaceDataHtmlGateway } from '../../../../../src/gateway/mock/mockRaceDataHtmlGateway';
import { SearchRaceFilterEntity } from '../../../../../src/repository/entity/filter/searchRaceFilterEntity';
import { PlaceEntity } from '../../../../../src/repository/entity/placeEntity';
import { RaceRepositoryFromHtml } from '../../../../../src/repository/implement/raceRepositoryFromHtml';
import type { IRaceRepository } from '../../../../../src/repository/interface/IRaceRepository';
import { allowedEnvs } from '../../../../../src/utility/env';
import { RaceType } from '../../../../../src/utility/raceType';
import { SkipEnv } from '../../../../utility/testDecorators';
import { clearMocks } from '../../../../utility/testSetupHelper';
import {
    defaultHeldDayData,
    defaultPlaceGrade,
    testRaceTypeListAll,
} from '../../mock/common/baseCommonData';
import { commonParameterMock } from './../../mock/common/commonParameterMock';

// Minimal smoke test so test suite contains at least one test
describe('Smoke test', () => {
    it('runs a trivial assertion', () => {
        expect(1 + 1).toBe(2);
    });
});

// テーブル駆動型テスト
const testCases = {
    [RaceType.JRA]: [
        {
            name: 'JraRaceRepositoryFromHtml',
            startDate: new Date('2024-05-26'),
            endDate: new Date('2024-05-26'),
            placeName: '東京',
            placeDate: new Date('2024-05-26'),
            expectedLength: 12,
        },
    ],
    [RaceType.NAR]: [
        {
            name: 'NarRaceRepositoryFromHtml',
            startDate: new Date('2024-10-02'),
            endDate: new Date('2024-10-02'),
            placeName: '大井',
            placeDate: new Date('2024-10-02'),
            expectedLength: 12,
        },
        {
            name: 'NarRaceRepositoryFromHtml',
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
            startDate: new Date('2025-05-01'),
            endDate: new Date('2025-05-31'),
            placeName: 'パリロンシャン',
            placeDate: new Date('2025-05-01'),
            expectedLength: 16,
        },
        {
            name: 'OverseasRaceRepositoryFromHtml',
            startDate: new Date('2025-07-01'),
            endDate: new Date('2025-07-31'),
            placeName: 'パリロンシャン',
            placeDate: new Date('2025-07-01'),
            expectedLength: 11,
        },
    ],
    [RaceType.KEIRIN]: [
        {
            name: 'KeirinRaceRepositoryFromHtml',
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
        startDate,
        endDate,
        placeName,
        placeDate,
        expectedLength,
    } of testCases[raceType]) {
        console.log(
            name,
            raceType,
            startDate,
            endDate,
            placeName,
            placeDate,
            expectedLength,
        );
        describe(name, () => {
            let raceDataHtmlGateway: IRaceDataHtmlGateway;
            let repository: IRaceRepository;

            beforeEach(() => {
                raceDataHtmlGateway = new MockRaceDataHtmlGateway();
                container.registerInstance(
                    'RaceDataHtmlGateway',
                    raceDataHtmlGateway,
                );
                repository = container.resolve<IRaceRepository>(
                    RaceRepositoryFromHtml,
                );
            });

            afterEach(() => {
                clearMocks();
            });

            describe('fetchRaceList', () => {
                SkipEnv(
                    `正しいレース開催データを取得できる(${raceType})`,
                    [allowedEnvs.githubActionsCi],
                    async () => {
                        const commonParameter = commonParameterMock();
                        const raceEntityList =
                            await repository.fetchRaceEntityList(
                                commonParameter,
                                new SearchRaceFilterEntity(
                                    startDate,
                                    endDate,
                                    [raceType],
                                    [],
                                    [],
                                    [],
                                ),
                                [
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
                            );
                        expect(raceEntityList).toHaveLength(expectedLength);
                    },
                );
            });

            describe('upsertRaceList', () => {
                it('HTMLにはデータを登録できない', async () => {
                    const commonParameter = commonParameterMock();
                    await expect(
                        repository.upsertRaceEntityList(commonParameter, []),
                    ).resolves.toEqual({
                        successCount: 0,
                        failureCount: 0,
                        failures: [],
                    });
                });
            });
        });
    }
});
