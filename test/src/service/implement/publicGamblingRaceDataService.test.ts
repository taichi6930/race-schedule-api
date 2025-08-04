import 'reflect-metadata'; // reflect-metadataをインポート

import { container } from 'tsyringe';

import type { AutoraceRaceEntity } from '../../../../lib/src/repository/entity/autoraceRaceEntity';
import type { BoatracePlaceEntity } from '../../../../lib/src/repository/entity/boatracePlaceEntity';
import type { BoatraceRaceEntity } from '../../../../lib/src/repository/entity/boatraceRaceEntity';
import type { JraPlaceEntity } from '../../../../lib/src/repository/entity/jraPlaceEntity';
import type { JraRaceEntity } from '../../../../lib/src/repository/entity/jraRaceEntity';
import type { KeirinPlaceEntity } from '../../../../lib/src/repository/entity/keirinPlaceEntity';
import type { KeirinRaceEntity } from '../../../../lib/src/repository/entity/keirinRaceEntity';
import type { NarPlaceEntity } from '../../../../lib/src/repository/entity/narPlaceEntity';
import type { NarRaceEntity } from '../../../../lib/src/repository/entity/narRaceEntity';
import type { PlaceEntity } from '../../../../lib/src/repository/entity/placeEntity';
import type { WorldPlaceEntity } from '../../../../lib/src/repository/entity/worldPlaceEntity';
import type { WorldRaceEntity } from '../../../../lib/src/repository/entity/worldRaceEntity';
import type { IPlaceRepository } from '../../../../lib/src/repository/interface/IPlaceRepository';
import type { IRaceRepository } from '../../../../lib/src/repository/interface/IRaceRepository';
import { PublicGamblingRaceDataService } from '../../../../lib/src/service/implement/publicGamblingRaceDataService';
import { DataLocation } from '../../../../lib/src/utility/dataType';
import { baseAutoraceRaceEntityList } from '../../mock/common/baseAutoraceData';
import { baseBoatraceRaceEntityList } from '../../mock/common/baseBoatraceData';
import { baseJraRaceEntityList } from '../../mock/common/baseJraData';
import { baseKeirinRaceEntityList } from '../../mock/common/baseKeirinData';
import { baseNarRaceEntityList } from '../../mock/common/baseNarData';
import { baseWorldRaceEntityList } from '../../mock/common/baseWorldData';
import { mockPlaceRepository } from '../../mock/repository/mockPlaceRepository';
import { mockRaceRepository } from '../../mock/repository/mockRaceRepository';

describe('PublicGamblingRaceDataService', () => {
    let jraRaceRepositoryFromStorageImpl: jest.Mocked<
        IRaceRepository<JraRaceEntity, JraPlaceEntity>
    >;
    let jraRaceRepositoryFromHtmlImpl: jest.Mocked<
        IRaceRepository<JraRaceEntity, JraPlaceEntity>
    >;
    let narRaceRepositoryFromStorageImpl: jest.Mocked<
        IRaceRepository<NarRaceEntity, NarPlaceEntity>
    >;
    let narRaceRepositoryFromHtmlImpl: jest.Mocked<
        IRaceRepository<NarRaceEntity, NarPlaceEntity>
    >;
    let worldRaceRepositoryFromStorageImpl: jest.Mocked<
        IRaceRepository<WorldRaceEntity, WorldPlaceEntity>
    >;
    let worldRaceRepositoryFromHtmlImpl: jest.Mocked<
        IRaceRepository<WorldRaceEntity, WorldPlaceEntity>
    >;
    let keirinRaceRepositoryFromStorageImpl: jest.Mocked<
        IRaceRepository<KeirinRaceEntity, KeirinPlaceEntity>
    >;
    let keirinRaceRepositoryFromHtmlImpl: jest.Mocked<
        IRaceRepository<KeirinRaceEntity, KeirinPlaceEntity>
    >;
    let boatraceRaceRepositoryFromStorageImpl: jest.Mocked<
        IRaceRepository<BoatraceRaceEntity, BoatracePlaceEntity>
    >;
    let boatraceRaceRepositoryFromHtmlImpl: jest.Mocked<
        IRaceRepository<BoatraceRaceEntity, BoatracePlaceEntity>
    >;
    let autoraceRaceRepositoryFromStorageImpl: jest.Mocked<
        IRaceRepository<AutoraceRaceEntity, PlaceEntity>
    >;
    let autoraceRaceRepositoryFromHtmlImpl: jest.Mocked<
        IRaceRepository<AutoraceRaceEntity, PlaceEntity>
    >;
    let placeRepositoryFromStorageImpl: jest.Mocked<
        IPlaceRepository<PlaceEntity>
    >;
    let service: PublicGamblingRaceDataService;

    beforeEach(() => {
        jraRaceRepositoryFromStorageImpl = mockRaceRepository<
            JraRaceEntity,
            JraPlaceEntity
        >();
        container.registerInstance<
            IRaceRepository<JraRaceEntity, JraPlaceEntity>
        >('JraRaceRepositoryFromStorage', jraRaceRepositoryFromStorageImpl);
        jraRaceRepositoryFromHtmlImpl = mockRaceRepository<
            JraRaceEntity,
            JraPlaceEntity
        >();
        container.registerInstance<
            IRaceRepository<JraRaceEntity, JraPlaceEntity>
        >('JraRaceRepositoryFromHtml', jraRaceRepositoryFromHtmlImpl);
        narRaceRepositoryFromStorageImpl = mockRaceRepository<
            NarRaceEntity,
            NarPlaceEntity
        >();
        container.registerInstance<
            IRaceRepository<NarRaceEntity, NarPlaceEntity>
        >('NarRaceRepositoryFromStorage', narRaceRepositoryFromStorageImpl);

        narRaceRepositoryFromHtmlImpl = mockRaceRepository<
            NarRaceEntity,
            NarPlaceEntity
        >();
        container.registerInstance<
            IRaceRepository<NarRaceEntity, NarPlaceEntity>
        >('NarRaceRepositoryFromHtml', narRaceRepositoryFromHtmlImpl);

        // world
        worldRaceRepositoryFromStorageImpl = mockRaceRepository<
            WorldRaceEntity,
            WorldPlaceEntity
        >();
        container.registerInstance<
            IRaceRepository<WorldRaceEntity, WorldPlaceEntity>
        >('WorldRaceRepositoryFromStorage', worldRaceRepositoryFromStorageImpl);
        worldRaceRepositoryFromHtmlImpl = mockRaceRepository<
            WorldRaceEntity,
            WorldPlaceEntity
        >();
        container.registerInstance<
            IRaceRepository<WorldRaceEntity, WorldPlaceEntity>
        >('WorldRaceRepositoryFromHtml', worldRaceRepositoryFromHtmlImpl);

        // keirin
        keirinRaceRepositoryFromStorageImpl = mockRaceRepository<
            KeirinRaceEntity,
            KeirinPlaceEntity
        >();
        container.registerInstance<
            IRaceRepository<KeirinRaceEntity, KeirinPlaceEntity>
        >(
            'KeirinRaceRepositoryFromStorage',
            keirinRaceRepositoryFromStorageImpl,
        );
        keirinRaceRepositoryFromHtmlImpl = mockRaceRepository<
            KeirinRaceEntity,
            KeirinPlaceEntity
        >();
        container.registerInstance<
            IRaceRepository<KeirinRaceEntity, KeirinPlaceEntity>
        >('KeirinRaceRepositoryFromHtml', keirinRaceRepositoryFromHtmlImpl);

        // boatrace
        boatraceRaceRepositoryFromStorageImpl = mockRaceRepository<
            BoatraceRaceEntity,
            BoatracePlaceEntity
        >();
        container.registerInstance<
            IRaceRepository<BoatraceRaceEntity, BoatracePlaceEntity>
        >(
            'BoatraceRaceRepositoryFromStorage',
            boatraceRaceRepositoryFromStorageImpl,
        );
        boatraceRaceRepositoryFromHtmlImpl = mockRaceRepository<
            BoatraceRaceEntity,
            BoatracePlaceEntity
        >();
        container.registerInstance<
            IRaceRepository<BoatraceRaceEntity, BoatracePlaceEntity>
        >('BoatraceRaceRepositoryFromHtml', boatraceRaceRepositoryFromHtmlImpl);

        autoraceRaceRepositoryFromStorageImpl = mockRaceRepository<
            AutoraceRaceEntity,
            PlaceEntity
        >();
        container.registerInstance<
            IRaceRepository<AutoraceRaceEntity, PlaceEntity>
        >(
            'AutoraceRaceRepositoryFromStorage',
            autoraceRaceRepositoryFromStorageImpl,
        );
        autoraceRaceRepositoryFromHtmlImpl = mockRaceRepository<
            AutoraceRaceEntity,
            PlaceEntity
        >();
        container.registerInstance<
            IRaceRepository<AutoraceRaceEntity, PlaceEntity>
        >('AutoraceRaceRepositoryFromHtml', autoraceRaceRepositoryFromHtmlImpl);

        placeRepositoryFromStorageImpl = mockPlaceRepository<PlaceEntity>();
        container.registerInstance<IPlaceRepository<PlaceEntity>>(
            'AutoracePlaceRepositoryFromStorage',
            placeRepositoryFromStorageImpl,
        );

        // AutoraceRaceCalendarServiceをコンテナから取得
        service = container.resolve(PublicGamblingRaceDataService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('fetchRaceEntityList', () => {
        it('正常にレース開催データが取得できること（storage）', async () => {
            // モックの戻り値を設定
            jraRaceRepositoryFromStorageImpl.fetchRaceEntityList.mockResolvedValue(
                baseJraRaceEntityList,
            );
            narRaceRepositoryFromStorageImpl.fetchRaceEntityList.mockResolvedValue(
                baseNarRaceEntityList,
            );
            worldRaceRepositoryFromStorageImpl.fetchRaceEntityList.mockResolvedValue(
                baseWorldRaceEntityList,
            );
            keirinRaceRepositoryFromStorageImpl.fetchRaceEntityList.mockResolvedValue(
                baseKeirinRaceEntityList,
            );
            boatraceRaceRepositoryFromStorageImpl.fetchRaceEntityList.mockResolvedValue(
                baseBoatraceRaceEntityList,
            );
            autoraceRaceRepositoryFromStorageImpl.fetchRaceEntityList.mockResolvedValue(
                baseAutoraceRaceEntityList,
            );

            const startDate = new Date('2024-06-01');
            const finishDate = new Date('2024-06-30');

            const result = await service.fetchRaceEntityList(
                startDate,
                finishDate,
                ['jra', 'nar', 'world', 'keirin', 'boatrace', 'autorace'],
                DataLocation.Storage,
            );
            expect(result.jra).toEqual(baseJraRaceEntityList);
            expect(result.nar).toEqual(baseNarRaceEntityList);
            expect(result.world).toEqual(baseWorldRaceEntityList);
            expect(result.keirin).toEqual(baseKeirinRaceEntityList);
            expect(result.boatrace).toEqual(baseBoatraceRaceEntityList);
            expect(result.autorace).toEqual(baseAutoraceRaceEntityList);
        });

        it('正常にレース開催データが取得できること（web）', async () => {
            // モックの戻り値を設定
            jraRaceRepositoryFromHtmlImpl.fetchRaceEntityList.mockResolvedValue(
                baseJraRaceEntityList,
            );
            narRaceRepositoryFromHtmlImpl.fetchRaceEntityList.mockResolvedValue(
                baseNarRaceEntityList,
            );
            worldRaceRepositoryFromHtmlImpl.fetchRaceEntityList.mockResolvedValue(
                baseWorldRaceEntityList,
            );
            keirinRaceRepositoryFromHtmlImpl.fetchRaceEntityList.mockResolvedValue(
                baseKeirinRaceEntityList,
            );
            boatraceRaceRepositoryFromHtmlImpl.fetchRaceEntityList.mockResolvedValue(
                baseBoatraceRaceEntityList,
            );
            autoraceRaceRepositoryFromHtmlImpl.fetchRaceEntityList.mockResolvedValue(
                baseAutoraceRaceEntityList,
            );

            const startDate = new Date('2024-06-01');
            const finishDate = new Date('2024-06-30');

            const result = await service.fetchRaceEntityList(
                startDate,
                finishDate,
                ['jra', 'nar', 'world', 'keirin', 'boatrace', 'autorace'],
                DataLocation.Web,
            );

            expect(result.jra).toEqual(baseJraRaceEntityList);
            expect(result.nar).toEqual(baseNarRaceEntityList);
            expect(result.world).toEqual(baseWorldRaceEntityList);
            expect(result.keirin).toEqual(baseKeirinRaceEntityList);
            expect(result.boatrace).toEqual(baseBoatraceRaceEntityList);
            expect(result.autorace).toEqual(baseAutoraceRaceEntityList);
        });

        it('レース開催データが取得できない場合、エラーが発生すること', async () => {
            // モックの戻り値を設定（エラーが発生するように設定）
            autoraceRaceRepositoryFromStorageImpl.fetchRaceEntityList.mockRejectedValue(
                new Error('レース開催データの取得に失敗しました'),
            );

            const consoleSpy = jest
                .spyOn(console, 'error')
                .mockImplementation();

            const startDate = new Date('2024-06-01');
            const finishDate = new Date('2024-06-30');

            await service.fetchRaceEntityList(
                startDate,
                finishDate,
                ['jra', 'nar', 'world', 'keirin', 'boatrace', 'autorace'],
                DataLocation.Storage,
            );

            expect(consoleSpy).toHaveBeenCalled();
        });
    });

    describe('updateRaceDataList', () => {
        it('正常にレース開催データが更新されること', async () => {
            // モックの戻り値を設定
            jraRaceRepositoryFromStorageImpl.fetchRaceEntityList.mockResolvedValue(
                baseJraRaceEntityList,
            );
            narRaceRepositoryFromStorageImpl.fetchRaceEntityList.mockResolvedValue(
                baseNarRaceEntityList,
            );
            worldRaceRepositoryFromStorageImpl.fetchRaceEntityList.mockResolvedValue(
                baseWorldRaceEntityList,
            );
            keirinRaceRepositoryFromStorageImpl.fetchRaceEntityList.mockResolvedValue(
                baseKeirinRaceEntityList,
            );
            boatraceRaceRepositoryFromStorageImpl.fetchRaceEntityList.mockResolvedValue(
                baseBoatraceRaceEntityList,
            );
            autoraceRaceRepositoryFromStorageImpl.fetchRaceEntityList.mockResolvedValue(
                baseAutoraceRaceEntityList,
            );

            await service.updateRaceEntityList({
                jra: baseJraRaceEntityList,
                nar: baseNarRaceEntityList,
                world: baseWorldRaceEntityList,
                keirin: baseKeirinRaceEntityList,
                boatrace: baseBoatraceRaceEntityList,
                autorace: baseAutoraceRaceEntityList,
            });

            expect(
                jraRaceRepositoryFromStorageImpl.registerRaceEntityList,
            ).toHaveBeenCalledWith(baseJraRaceEntityList);
            expect(
                narRaceRepositoryFromStorageImpl.registerRaceEntityList,
            ).toHaveBeenCalledWith(baseNarRaceEntityList);
            expect(
                worldRaceRepositoryFromStorageImpl.registerRaceEntityList,
            ).toHaveBeenCalledWith(baseWorldRaceEntityList);
            expect(
                keirinRaceRepositoryFromStorageImpl.registerRaceEntityList,
            ).toHaveBeenCalledWith(baseKeirinRaceEntityList);
            expect(
                boatraceRaceRepositoryFromStorageImpl.registerRaceEntityList,
            ).toHaveBeenCalledWith(baseBoatraceRaceEntityList);
            expect(
                autoraceRaceRepositoryFromStorageImpl.registerRaceEntityList,
            ).toHaveBeenCalled();
        });

        it('レース開催データが0件の場合、更新処理が実行されないこと', async () => {
            await service.updateRaceEntityList({
                jra: [],
                nar: [],
                world: [],
                keirin: [],
                autorace: [],
                boatrace: [],
            });

            expect(
                jraRaceRepositoryFromStorageImpl.registerRaceEntityList,
            ).not.toHaveBeenCalled();
            expect(
                narRaceRepositoryFromStorageImpl.registerRaceEntityList,
            ).not.toHaveBeenCalled();
            expect(
                worldRaceRepositoryFromStorageImpl.registerRaceEntityList,
            ).not.toHaveBeenCalled();
            expect(
                keirinRaceRepositoryFromStorageImpl.registerRaceEntityList,
            ).not.toHaveBeenCalled();
            expect(
                autoraceRaceRepositoryFromStorageImpl.registerRaceEntityList,
            ).not.toHaveBeenCalled();
            expect(
                boatraceRaceRepositoryFromStorageImpl.registerRaceEntityList,
            ).not.toHaveBeenCalled();
        });
    });
});
