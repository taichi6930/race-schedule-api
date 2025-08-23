import 'reflect-metadata'; // reflect-metadataをインポート

import { container } from 'tsyringe';
import { describe, expect, it } from 'vitest';

import type { PlaceEntity } from '../../../../../lib/src/repository/entity/placeEntity';
import type { SearchPlaceFilterEntity } from '../../../../../lib/src/repository/entity/searchPlaceFilterEntity';
import type { IPlaceRepository } from '../../../../../lib/src/repository/interface/IPlaceRepository';
import { PublicGamblingPlaceDataService } from '../../../../../lib/src/service/implement/publicGamblingPlaceDataService';
import type { IPlaceDataService } from '../../../../../lib/src/service/interface/IPlaceDataService';
import { DataLocation } from '../../../../../lib/src/utility/dataType';
import { RaceType } from '../../../../../lib/src/utility/raceType';
import type { TestSetup } from '../../../../utility/testSetupHelper';
import { setupTestMock } from '../../../../utility/testSetupHelper';
import {
    basePlaceEntity,
    mockPlaceEntityList,
    testRaceTypeListWithoutOverseas,
} from '../../mock/common/baseCommonData';

describe('PublicGamblingPlaceDataService', () => {
    let jraPlaceRepositoryFromHtml: jest.Mocked<IPlaceRepository>;
    let placeRepositoryFromStorage: jest.Mocked<IPlaceRepository>;
    let narPlaceRepositoryFromHtml: jest.Mocked<IPlaceRepository>;
    let keirinPlaceRepositoryFromHtml: jest.Mocked<IPlaceRepository>;
    let boatracePlaceRepositoryFromHtml: jest.Mocked<IPlaceRepository>;
    let autoracePlaceRepositoryFromHtml: jest.Mocked<IPlaceRepository>;
    let service: IPlaceDataService;

    beforeEach(() => {
        const setup: TestSetup = setupTestMock();
        ({
            placeRepositoryFromStorage,
            jraPlaceRepositoryFromHtml,
            narPlaceRepositoryFromHtml,
            keirinPlaceRepositoryFromHtml,
            boatracePlaceRepositoryFromHtml,
            autoracePlaceRepositoryFromHtml,
        } = setup);

        service = container.resolve(PublicGamblingPlaceDataService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('fetchRaceEntityList', () => {
        it('正常に開催場データが取得できること(storage)', async () => {
            // モックの戻り値を設定
            placeRepositoryFromStorage.fetchPlaceEntityList.mockImplementation(
                async (searchFilter: SearchPlaceFilterEntity) => {
                    switch (searchFilter.raceType) {
                        case RaceType.OVERSEAS: {
                            throw new Error('race type is not supported');
                        }
                        case RaceType.JRA:
                        case RaceType.NAR:
                        case RaceType.KEIRIN:
                        case RaceType.AUTORACE:
                        case RaceType.BOATRACE: {
                            return [basePlaceEntity(searchFilter.raceType)];
                        }
                    }
                },
            );

            const startDate = new Date('2024-06-01');
            const finishDate = new Date('2024-06-30');

            const result = await service.fetchPlaceEntityList(
                startDate,
                finishDate,
                testRaceTypeListWithoutOverseas,
                DataLocation.Storage,
            );

            expect(result).toEqual(mockPlaceEntityList);
        });

        it('正常に開催場データが取得できること（web）', async () => {
            // モックの戻り値を設定
            jraPlaceRepositoryFromHtml.fetchPlaceEntityList.mockResolvedValue([
                basePlaceEntity(RaceType.JRA),
            ]);
            narPlaceRepositoryFromHtml.fetchPlaceEntityList.mockResolvedValue([
                basePlaceEntity(RaceType.NAR),
            ]);
            keirinPlaceRepositoryFromHtml.fetchPlaceEntityList.mockResolvedValue(
                [basePlaceEntity(RaceType.KEIRIN)],
            );
            autoracePlaceRepositoryFromHtml.fetchPlaceEntityList.mockResolvedValue(
                [basePlaceEntity(RaceType.AUTORACE)],
            );
            boatracePlaceRepositoryFromHtml.fetchPlaceEntityList.mockResolvedValue(
                [basePlaceEntity(RaceType.BOATRACE)],
            );

            const startDate = new Date('2024-06-01');
            const finishDate = new Date('2024-06-30');

            const result = await service.fetchPlaceEntityList(
                startDate,
                finishDate,
                testRaceTypeListWithoutOverseas,
                DataLocation.Web,
            );

            expect(result).toEqual(mockPlaceEntityList);
        });

        it('開催場データが取得できない場合、エラーが発生すること', async () => {
            // モックの戻り値を設定（エラーが発生するように設定）
            placeRepositoryFromStorage.fetchPlaceEntityList.mockRejectedValue(
                new Error('開催場データの取得に失敗しました'),
            );

            const consoleSpy = jest
                .spyOn(console, 'error')
                .mockImplementation();

            const startDate = new Date('2024-06-01');
            const finishDate = new Date('2024-06-30');

            await service.fetchPlaceEntityList(
                startDate,
                finishDate,
                testRaceTypeListWithoutOverseas,
                DataLocation.Storage,
            );

            expect(consoleSpy).toHaveBeenCalled();
        });
    });

    describe('updatePlaceDataList', () => {
        it('正常に開催場データが更新されること', async () => {
            // モックの戻り値を設定
            placeRepositoryFromStorage.fetchPlaceEntityList.mockImplementation(
                async (searchFilter: SearchPlaceFilterEntity) => {
                    switch (searchFilter.raceType) {
                        case RaceType.OVERSEAS: {
                            throw new Error('race type is not supported');
                        }
                        case RaceType.JRA:
                        case RaceType.NAR:
                        case RaceType.KEIRIN:
                        case RaceType.AUTORACE:
                        case RaceType.BOATRACE: {
                            return [basePlaceEntity(searchFilter.raceType)];
                        }
                    }
                },
            );

            // registerPlaceEntityList の戻り値を正しい型でモック
            placeRepositoryFromStorage.registerPlaceEntityList.mockImplementation(
                async (raceType: RaceType, placeEntityList: PlaceEntity[]) => {
                    {
                        return {
                            code: 200,
                            message: '',
                            successData: placeEntityList,
                            failureData: [],
                        };
                    }
                },
            );

            await service.updatePlaceEntityList(mockPlaceEntityList);

            expect(
                placeRepositoryFromStorage.registerPlaceEntityList,
            ).toHaveBeenCalled();
        });

        it('開催場データの件数が0の場合、Repositoryを呼び出さないこと', async () => {
            await service.updatePlaceEntityList([]);

            expect(
                placeRepositoryFromStorage.registerPlaceEntityList,
            ).not.toHaveBeenCalled();
        });

        it('開催場データが更新できない場合、エラーが発生すること', async () => {
            // モックの戻り値を設定（エラーが発生するように設定）
            placeRepositoryFromStorage.registerPlaceEntityList.mockRejectedValue(
                new Error('開催場データの登録に失敗しました'),
            );

            const consoleSpy = jest
                .spyOn(console, 'error')
                .mockImplementation();

            await expect(
                service.updatePlaceEntityList(mockPlaceEntityList),
            ).rejects.toThrow('開催場データの登録に失敗しました');

            expect(consoleSpy).toHaveBeenCalled();
        });
    });
});
