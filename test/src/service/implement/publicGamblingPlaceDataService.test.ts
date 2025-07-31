import 'reflect-metadata'; // reflect-metadataをインポート

import { container } from 'tsyringe';

import type { AutoracePlaceEntity } from '../../../../lib/src/repository/entity/autoracePlaceEntity';
import type { BoatracePlaceEntity } from '../../../../lib/src/repository/entity/boatracePlaceEntity';
import type { JraPlaceEntity } from '../../../../lib/src/repository/entity/jraPlaceEntity';
import type { KeirinPlaceEntity } from '../../../../lib/src/repository/entity/keirinPlaceEntity';
import type { NarPlaceEntity } from '../../../../lib/src/repository/entity/narPlaceEntity';
import type { WorldPlaceEntity } from '../../../../lib/src/repository/entity/worldPlaceEntity';
import type { IPlaceRepository } from '../../../../lib/src/repository/interface/IPlaceRepository';
import { PublicGamblingPlaceDataService } from '../../../../lib/src/service/implement/publicGamblingPlaceDataService';
import { DataLocation } from '../../../../lib/src/utility/dataType';
import { baseAutoracePlaceEntity } from '../../mock/common/baseAutoraceData';
import { baseBoatracePlaceEntity } from '../../mock/common/baseBoatraceData';
import { baseJraPlaceEntity } from '../../mock/common/baseJraData';
import { baseKeirinPlaceEntity } from '../../mock/common/baseKeirinData';
import { baseNarPlaceEntity } from '../../mock/common/baseNarData';
import { baseWorldPlaceEntity } from '../../mock/common/baseWorldData';
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
    let worldPlaceRepositoryFromStorageImpl: jest.Mocked<
        IPlaceRepository<WorldPlaceEntity>
    >;
    let worldPlaceRepositoryFromHtmlImpl: jest.Mocked<
        IPlaceRepository<WorldPlaceEntity>
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
        IPlaceRepository<AutoracePlaceEntity>
    >;
    let autoracePlaceRepositoryFromHtmlImpl: jest.Mocked<
        IPlaceRepository<AutoracePlaceEntity>
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

        worldPlaceRepositoryFromStorageImpl =
            mockPlaceRepository<WorldPlaceEntity>();
        container.registerInstance<IPlaceRepository<WorldPlaceEntity>>(
            'WorldPlaceRepositoryFromStorage',
            worldPlaceRepositoryFromStorageImpl,
        );

        worldPlaceRepositoryFromHtmlImpl = mockPlaceRepository();
        container.registerInstance<IPlaceRepository<WorldPlaceEntity>>(
            'WorldPlaceRepositoryFromHtml',
            worldPlaceRepositoryFromHtmlImpl,
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
            mockPlaceRepository<AutoracePlaceEntity>();
        container.registerInstance<IPlaceRepository<AutoracePlaceEntity>>(
            'AutoracePlaceRepositoryFromStorage',
            autoracePlaceRepositoryFromStorageImpl,
        );

        autoracePlaceRepositoryFromHtmlImpl = mockPlaceRepository();
        container.registerInstance<IPlaceRepository<AutoracePlaceEntity>>(
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
                world: [baseWorldPlaceEntity],
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
            worldPlaceRepositoryFromStorageImpl.fetchPlaceEntityList.mockResolvedValue(
                [baseWorldPlaceEntity],
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
                ['jra', 'nar', 'world', 'keirin', 'boatrace', 'autorace'],
                DataLocation.Storage,
            );

            expect(result).toEqual(mockPlaceEntity);
        });

        it('正常に開催場データが取得できること（web）', async () => {
            const mockPlaceEntity = {
                jra: [baseJraPlaceEntity],
                nar: [baseNarPlaceEntity],
                world: [baseWorldPlaceEntity],
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
            worldPlaceRepositoryFromHtmlImpl.fetchPlaceEntityList.mockResolvedValue(
                [baseWorldPlaceEntity],
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
                ['jra', 'nar', 'world', 'keirin', 'boatrace', 'autorace'],
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
                ['jra', 'nar', 'world', 'keirin', 'boatrace', 'autorace'],
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
                world: [baseWorldPlaceEntity],
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
            worldPlaceRepositoryFromHtmlImpl.fetchPlaceEntityList.mockResolvedValue(
                [baseWorldPlaceEntity],
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
                world: [],
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
                world: [baseWorldPlaceEntity],
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
            worldPlaceRepositoryFromStorageImpl.registerPlaceEntityList.mockRejectedValue(
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
