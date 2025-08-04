import 'reflect-metadata'; // reflect-metadataをインポート

import { container } from 'tsyringe';

import type { BoatracePlaceEntity } from '../../../../lib/src/repository/entity/boatracePlaceEntity';
import type { JraPlaceEntity } from '../../../../lib/src/repository/entity/jraPlaceEntity';
import type { KeirinPlaceEntity } from '../../../../lib/src/repository/entity/keirinPlaceEntity';
import type { NarPlaceEntity } from '../../../../lib/src/repository/entity/narPlaceEntity';
import type { PlaceEntity } from '../../../../lib/src/repository/entity/placeEntity';
import type { IPlaceRepository } from '../../../../lib/src/repository/interface/IPlaceRepository';
import { PublicGamblingPlaceDataService } from '../../../../lib/src/service/implement/publicGamblingPlaceDataService';
import { DataLocation } from '../../../../lib/src/utility/dataType';
import { baseAutoracePlaceEntity } from '../../mock/common/baseAutoraceData';
import { baseBoatracePlaceEntity } from '../../mock/common/baseBoatraceData';
import { baseJraPlaceEntity } from '../../mock/common/baseJraData';
import { baseKeirinPlaceEntity } from '../../mock/common/baseKeirinData';
import { baseNarPlaceEntity } from '../../mock/common/baseNarData';
import { mockPlaceRepository } from '../../mock/repository/mockPlaceRepository';

describe('PublicGamblingPlaceDataService', () => {
    let jraPlaceRepositoryFromStorageImpl: jest.Mocked<
        IPlaceRepository<JraPlaceEntity>
    >;
    let jraPlaceRepositoryFromHtmlImpl: jest.Mocked<
        IPlaceRepository<JraPlaceEntity>
    >;
    let narPlaceRepositoryFromStorageImpl: jest.Mocked<
        IPlaceRepository<NarPlaceEntity>
    >;
    let narPlaceRepositoryFromHtmlImpl: jest.Mocked<
        IPlaceRepository<NarPlaceEntity>
    >;
    let keirinPlaceRepositoryFromStorageImpl: jest.Mocked<
        IPlaceRepository<KeirinPlaceEntity>
    >;
    let keirinPlaceRepositoryFromHtmlImpl: jest.Mocked<
        IPlaceRepository<KeirinPlaceEntity>
    >;
    let boatracePlaceRepositoryFromStorageImpl: jest.Mocked<
        IPlaceRepository<BoatracePlaceEntity>
    >;
    let boatracePlaceRepositoryFromHtmlImpl: jest.Mocked<
        IPlaceRepository<BoatracePlaceEntity>
    >;
    let autoracePlaceRepositoryFromStorageImpl: jest.Mocked<
        IPlaceRepository<PlaceEntity>
    >;
    let autoracePlaceRepositoryFromHtmlImpl: jest.Mocked<
        IPlaceRepository<PlaceEntity>
    >;
    let service: PublicGamblingPlaceDataService;

    beforeEach(() => {
        jraPlaceRepositoryFromStorageImpl =
            mockPlaceRepository<JraPlaceEntity>();
        container.registerInstance<IPlaceRepository<JraPlaceEntity>>(
            'JraPlaceRepositoryFromStorage',
            jraPlaceRepositoryFromStorageImpl,
        );

        jraPlaceRepositoryFromHtmlImpl = mockPlaceRepository();
        container.registerInstance<IPlaceRepository<JraPlaceEntity>>(
            'JraPlaceRepositoryFromHtml',
            jraPlaceRepositoryFromHtmlImpl,
        );
        narPlaceRepositoryFromStorageImpl =
            mockPlaceRepository<NarPlaceEntity>();
        container.registerInstance<IPlaceRepository<NarPlaceEntity>>(
            'NarPlaceRepositoryFromStorage',
            narPlaceRepositoryFromStorageImpl,
        );

        narPlaceRepositoryFromHtmlImpl = mockPlaceRepository();
        container.registerInstance<IPlaceRepository<NarPlaceEntity>>(
            'NarPlaceRepositoryFromHtml',
            narPlaceRepositoryFromHtmlImpl,
        );

        keirinPlaceRepositoryFromStorageImpl =
            mockPlaceRepository<KeirinPlaceEntity>();
        container.registerInstance<IPlaceRepository<KeirinPlaceEntity>>(
            'KeirinPlaceRepositoryFromStorage',
            keirinPlaceRepositoryFromStorageImpl,
        );

        keirinPlaceRepositoryFromHtmlImpl = mockPlaceRepository();
        container.registerInstance<IPlaceRepository<KeirinPlaceEntity>>(
            'KeirinPlaceRepositoryFromHtml',
            keirinPlaceRepositoryFromHtmlImpl,
        );

        boatracePlaceRepositoryFromStorageImpl =
            mockPlaceRepository<BoatracePlaceEntity>();
        container.registerInstance<IPlaceRepository<BoatracePlaceEntity>>(
            'BoatracePlaceRepositoryFromStorage',
            boatracePlaceRepositoryFromStorageImpl,
        );

        boatracePlaceRepositoryFromHtmlImpl = mockPlaceRepository();
        container.registerInstance<IPlaceRepository<BoatracePlaceEntity>>(
            'BoatracePlaceRepositoryFromHtml',
            boatracePlaceRepositoryFromHtmlImpl,
        );

        autoracePlaceRepositoryFromStorageImpl =
            mockPlaceRepository<PlaceEntity>();
        container.registerInstance<IPlaceRepository<PlaceEntity>>(
            'AutoracePlaceRepositoryFromStorage',
            autoracePlaceRepositoryFromStorageImpl,
        );

        autoracePlaceRepositoryFromHtmlImpl = mockPlaceRepository();
        container.registerInstance<IPlaceRepository<PlaceEntity>>(
            'AutoracePlaceRepositoryFromHtml',
            autoracePlaceRepositoryFromHtmlImpl,
        );

        service = container.resolve(PublicGamblingPlaceDataService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('fetchRaceDataList', () => {
        it('正常に開催場データが取得できること(storage)', async () => {
            const mockPlaceEntity = {
                jra: [baseJraPlaceEntity],
                nar: [baseNarPlaceEntity],
                keirin: [baseKeirinPlaceEntity],
                autorace: [baseAutoracePlaceEntity],
                boatrace: [baseBoatracePlaceEntity],
            };

            // モックの戻り値を設定
            jraPlaceRepositoryFromStorageImpl.fetchPlaceEntityList.mockResolvedValue(
                [baseJraPlaceEntity],
            );
            narPlaceRepositoryFromStorageImpl.fetchPlaceEntityList.mockResolvedValue(
                [baseNarPlaceEntity],
            );
            keirinPlaceRepositoryFromStorageImpl.fetchPlaceEntityList.mockResolvedValue(
                [baseKeirinPlaceEntity],
            );
            autoracePlaceRepositoryFromStorageImpl.fetchPlaceEntityList.mockResolvedValue(
                [baseAutoracePlaceEntity],
            );
            boatracePlaceRepositoryFromStorageImpl.fetchPlaceEntityList.mockResolvedValue(
                [baseBoatracePlaceEntity],
            );

            const startDate = new Date('2024-06-01');
            const finishDate = new Date('2024-06-30');

            const result = await service.fetchPlaceEntityList(
                startDate,
                finishDate,
                ['jra', 'nar', 'keirin', 'boatrace', 'autorace'],
                DataLocation.Storage,
            );

            expect(result).toEqual(mockPlaceEntity);
        });

        it('正常に開催場データが取得できること（web）', async () => {
            const mockPlaceEntity = {
                jra: [baseJraPlaceEntity],
                nar: [baseNarPlaceEntity],
                keirin: [baseKeirinPlaceEntity],
                autorace: [baseAutoracePlaceEntity],
                boatrace: [baseBoatracePlaceEntity],
            };

            // モックの戻り値を設定
            jraPlaceRepositoryFromHtmlImpl.fetchPlaceEntityList.mockResolvedValue(
                [baseJraPlaceEntity],
            );
            narPlaceRepositoryFromHtmlImpl.fetchPlaceEntityList.mockResolvedValue(
                [baseNarPlaceEntity],
            );
            keirinPlaceRepositoryFromHtmlImpl.fetchPlaceEntityList.mockResolvedValue(
                [baseKeirinPlaceEntity],
            );
            autoracePlaceRepositoryFromHtmlImpl.fetchPlaceEntityList.mockResolvedValue(
                [baseAutoracePlaceEntity],
            );
            boatracePlaceRepositoryFromHtmlImpl.fetchPlaceEntityList.mockResolvedValue(
                [baseBoatracePlaceEntity],
            );

            const startDate = new Date('2024-06-01');
            const finishDate = new Date('2024-06-30');

            const result = await service.fetchPlaceEntityList(
                startDate,
                finishDate,
                ['jra', 'nar', 'keirin', 'boatrace', 'autorace'],
                DataLocation.Web,
            );

            expect(result).toEqual(mockPlaceEntity);
        });

        it('開催場データが取得できない場合、エラーが発生すること', async () => {
            // モックの戻り値を設定（エラーが発生するように設定）
            autoracePlaceRepositoryFromStorageImpl.fetchPlaceEntityList.mockRejectedValue(
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
                ['jra', 'nar', 'keirin', 'boatrace', 'autorace'],
                DataLocation.Storage,
            );

            expect(consoleSpy).toHaveBeenCalled();
        });
    });

    describe('updatePlaceDataList', () => {
        it('正常に開催場データが更新されること', async () => {
            const mockPlaceEntity = {
                jra: [baseJraPlaceEntity],
                nar: [baseNarPlaceEntity],
                keirin: [baseKeirinPlaceEntity],
                autorace: [baseAutoracePlaceEntity],
                boatrace: [baseBoatracePlaceEntity],
            };

            // モックの戻り値を設定
            jraPlaceRepositoryFromStorageImpl.fetchPlaceEntityList.mockResolvedValue(
                [baseJraPlaceEntity],
            );
            narPlaceRepositoryFromStorageImpl.fetchPlaceEntityList.mockResolvedValue(
                [baseNarPlaceEntity],
            );
            keirinPlaceRepositoryFromStorageImpl.fetchPlaceEntityList.mockResolvedValue(
                [baseKeirinPlaceEntity],
            );
            autoracePlaceRepositoryFromStorageImpl.fetchPlaceEntityList.mockResolvedValue(
                [baseAutoracePlaceEntity],
            );
            boatracePlaceRepositoryFromStorageImpl.fetchPlaceEntityList.mockResolvedValue(
                [baseBoatracePlaceEntity],
            );

            await service.updatePlaceEntityList(mockPlaceEntity);

            expect(
                autoracePlaceRepositoryFromStorageImpl.registerPlaceEntityList,
            ).toHaveBeenCalled();
        });

        it('開催場データの件数が0の場合、Repositoryを呼び出さないこと', async () => {
            await service.updatePlaceEntityList({
                jra: [],
                nar: [],
                keirin: [],
                boatrace: [],
                autorace: [],
            });

            expect(
                autoracePlaceRepositoryFromStorageImpl.registerPlaceEntityList,
            ).not.toHaveBeenCalled();
        });

        it('開催場データが更新できない場合、エラーが発生すること', async () => {
            const mockPlaceEntity = {
                jra: [baseJraPlaceEntity],
                nar: [baseNarPlaceEntity],
                keirin: [baseKeirinPlaceEntity],
                autorace: [baseAutoracePlaceEntity],
                boatrace: [baseBoatracePlaceEntity],
            };
            // モックの戻り値を設定（エラーが発生するように設定）
            jraPlaceRepositoryFromStorageImpl.registerPlaceEntityList.mockRejectedValue(
                new Error('開催場データの登録に失敗しました'),
            );
            narPlaceRepositoryFromStorageImpl.registerPlaceEntityList.mockRejectedValue(
                new Error('開催場データの登録に失敗しました'),
            );
            keirinPlaceRepositoryFromStorageImpl.registerPlaceEntityList.mockRejectedValue(
                new Error('開催場データの登録に失敗しました'),
            );
            boatracePlaceRepositoryFromStorageImpl.registerPlaceEntityList.mockRejectedValue(
                new Error('開催場データの登録に失敗しました'),
            );
            autoracePlaceRepositoryFromStorageImpl.registerPlaceEntityList.mockRejectedValue(
                new Error('開催場データの登録に失敗しました'),
            );

            const consoleSpy = jest
                .spyOn(console, 'error')
                .mockImplementation();

            await expect(
                service.updatePlaceEntityList(mockPlaceEntity),
            ).rejects.toThrow('開催場データの登録に失敗しました');

            expect(consoleSpy).toHaveBeenCalled();
        });
    });
});
