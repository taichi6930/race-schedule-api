import 'reflect-metadata';

import { container } from 'tsyringe';

import type { IPlaceDataHtmlGatewayForAWS } from '../../../../../../lib/src/gateway/interface/iPlaceDataHtmlGateway';
import { MockPlaceDataHtmlGateway } from '../../../../../../lib/src/gateway/mock/mockPlaceDataHtmlGateway';
import { SearchPlaceFilterEntityForAWS } from '../../../../../../lib/src/repository/entity/searchPlaceFilterEntity';
import { PlaceRepositoryFromHtmlForAWS } from '../../../../../../lib/src/repository/implement/placeRepositoryFromHtml';
import type { IPlaceRepositoryForAWS } from '../../../../../../lib/src/repository/interface/IPlaceRepositoryForAWS';
import { allowedEnvs } from '../../../../../../lib/src/utility/env';
import { RaceType } from '../../../../../../src/utility/raceType';
import {
    basePlaceEntity,
    testRaceTypeListAll,
} from '../../../../../unittest/src/mock/common/baseCommonData';
import { SkipEnv } from '../../../../../utility/testDecorators';
import { clearMocks } from '../../../../../utility/testSetupHelper';

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
            expectedLength: 66,
        },
    ],
};

describe.each(testRaceTypeListAll)('PlaceRepositoryFromHtml', (raceType) => {
    for (const { startDate, endDate, expectedLength } of testCases[raceType]) {
        describe(`PlaceRepositoryFromHtml(${raceType})`, () => {
            let placeDataHtmlGateway: IPlaceDataHtmlGatewayForAWS;
            let repository: IPlaceRepositoryForAWS;

            beforeAll(() => {
                placeDataHtmlGateway = new MockPlaceDataHtmlGateway();
                container.registerInstance(
                    'PlaceDataHtmlGateway',
                    placeDataHtmlGateway,
                );
                repository = container.resolve<IPlaceRepositoryForAWS>(
                    PlaceRepositoryFromHtmlForAWS,
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
                        const placeEntityList =
                            await repository.fetchPlaceEntityList(
                                new SearchPlaceFilterEntityForAWS(
                                    startDate,
                                    endDate,
                                    raceType,
                                ),
                            );
                        expect(placeEntityList).toHaveLength(expectedLength);
                    },
                );
            });

            describe('upsertPlaceList', () => {
                it(`HTMLにはデータを登録できない(${raceType})`, async () => {
                    await expect(
                        repository.upsertPlaceEntityList(raceType, [
                            basePlaceEntity(raceType),
                        ]),
                    ).resolves.toEqual({
                        code: 500,
                        message: 'HTMLにはデータを登録出来ません',
                        successData: [],
                        failureData: [basePlaceEntity(raceType)],
                    });
                });
            });
        });
    }
});
