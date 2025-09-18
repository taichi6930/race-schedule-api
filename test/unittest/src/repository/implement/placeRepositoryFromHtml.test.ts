import 'reflect-metadata';

import { container } from 'tsyringe';

import { MockPlaceDataHtmlGateway } from '../../../../../lib/src/gateway/mock/mockPlaceDataHtmlGateway';
import { allowedEnvs } from '../../../../../lib/src/utility/env';
import type { IPlaceDataHtmlGateway } from '../../../../../src/gateway/interface/iPlaceDataHtmlGateway';
import { SearchPlaceFilterEntity } from '../../../../../src/repository/entity/filter/searchPlaceFilterEntity';
import { PlaceRepositoryFromHtml } from '../../../../../src/repository/implement/placeRepositoryFromHtml';
import type { IPlaceRepository } from '../../../../../src/repository/interface/IPlaceRepository';
import { RaceType } from '../../../../../src/utility/raceType';
import { SkipEnv } from '../../../../utility/testDecorators';
import { clearMocks } from '../../../../utility/testSetupHelper';
import {
    basePlaceEntity,
    testRaceTypeListMechanicalRacing,
} from '../../mock/common/baseCommonData';
import { commonParameterMock } from './../../../../old/unittest/src/mock/common/commonParameterMock';

// テーブル駆動型テスト
const testCases = {
    [RaceType.JRA]: [
        {
            startDate: new Date('2024-01-01'),
            endDate: new Date('2024-12-31'),
            expectedLength: 288,
        },
    ],
    [RaceType.NAR]: [
        {
            startDate: new Date('2024-10-01'),
            endDate: new Date('2024-10-31'),
            expectedLength: 120,
        },
    ],
    [RaceType.OVERSEAS]: [
        {
            startDate: new Date('2024-10-01'),
            endDate: new Date('2024-10-31'),
            expectedLength: 0,
        },
    ],
    [RaceType.KEIRIN]: [
        {
            startDate: new Date('2024-10-01'),
            endDate: new Date('2024-10-31'),
            expectedLength: 233,
        },
    ],
    [RaceType.AUTORACE]: [
        {
            startDate: new Date('2024-11-01'),
            endDate: new Date('2024-11-30'),
            expectedLength: 60,
        },
    ],
    [RaceType.BOATRACE]: [
        {
            startDate: new Date('2025-04-01'),
            endDate: new Date('2025-06-30'),
            expectedLength: 0,
        },
    ],
};

describe.each(testRaceTypeListMechanicalRacing)(
    'PlaceRepositoryFromHtml',
    (raceType) => {
        for (const { startDate, endDate, expectedLength } of testCases[
            raceType
        ]) {
            describe(`PlaceRepositoryFromHtml(${raceType})`, () => {
                let placeDataHtmlGateway: IPlaceDataHtmlGateway;
                let repository: IPlaceRepository;

                beforeAll(() => {
                    placeDataHtmlGateway = new MockPlaceDataHtmlGateway();
                    container.registerInstance(
                        'PlaceDataHtmlGateway',
                        placeDataHtmlGateway,
                    );
                    repository = container.resolve<IPlaceRepository>(
                        PlaceRepositoryFromHtml,
                    );
                });

                afterAll(() => {
                    clearMocks();
                });

                describe('fetchPlaceList', () => {
                    SkipEnv(
                        `正しいレース開催データを取得できる(${raceType})`,
                        [allowedEnvs.githubActionsCi],
                        async () => {
                            const commonParameter = commonParameterMock();
                            const searchPlaceFilter =
                                new SearchPlaceFilterEntity(
                                    startDate,
                                    endDate,
                                    [raceType],
                                    [],
                                );
                            const placeEntityList =
                                await repository.fetchPlaceEntityList(
                                    commonParameter,
                                    searchPlaceFilter,
                                );
                            expect(placeEntityList).toHaveLength(
                                expectedLength,
                            );
                        },
                    );
                });

                describe('upsertPlaceList', () => {
                    it(`HTMLにはデータを登録できない(${raceType})`, async () => {
                        const commonParameter = commonParameterMock();
                        await expect(
                            repository.upsertPlaceEntityList(commonParameter, [
                                basePlaceEntity(raceType),
                            ]),
                        ).rejects.toThrow('Method not implemented.');
                    });
                });
            });
        }
    },
);
