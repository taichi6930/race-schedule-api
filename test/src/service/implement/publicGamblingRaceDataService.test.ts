import 'reflect-metadata'; // reflect-metadataをインポート

import { container } from 'tsyringe';

import type { AutoracePlaceEntity } from '../../../../lib/src/repository/entity/autoracePlaceEntity';
import type { AutoraceRaceEntity } from '../../../../lib/src/repository/entity/autoraceRaceEntity';
import type { BoatracePlaceEntity } from '../../../../lib/src/repository/entity/boatracePlaceEntity';
import type { BoatraceRaceEntity } from '../../../../lib/src/repository/entity/boatraceRaceEntity';
import type { JraPlaceEntity } from '../../../../lib/src/repository/entity/jraPlaceEntity';
import type { JraRaceEntity } from '../../../../lib/src/repository/entity/jraRaceEntity';
import type { KeirinPlaceEntity } from '../../../../lib/src/repository/entity/keirinPlaceEntity';
import type { KeirinRaceEntity } from '../../../../lib/src/repository/entity/keirinRaceEntity';
import type { NarPlaceEntity } from '../../../../lib/src/repository/entity/narPlaceEntity';
import type { NarRaceEntity } from '../../../../lib/src/repository/entity/narRaceEntity';
import type { WorldPlaceEntity } from '../../../../lib/src/repository/entity/worldPlaceEntity';
import type { WorldRaceEntity } from '../../../../lib/src/repository/entity/worldRaceEntity';
import type { IPlaceRepository } from '../../../../lib/src/repository/interface/IPlaceRepository';
import type { IRaceRepository } from '../../../../lib/src/repository/interface/IRaceRepository';
import { PublicGamblingRaceDataService } from '../../../../lib/src/service/implement/publicGamblingRaceDataService';
import { DataLocation } from '../../../../lib/src/utility/dataType';
import { baseAutoraceRaceEntityList } from '../../mock/common/baseAutoraceData';
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
        IRaceRepository<AutoraceRaceEntity, AutoracePlaceEntity>
    >;
    let autoraceRaceRepositoryFromHtmlImpl: jest.Mocked<
        IRaceRepository<AutoraceRaceEntity, AutoracePlaceEntity>
    >;
    let placeRepositoryFromStorageImpl: jest.Mocked<
        IPlaceRepository<AutoracePlaceEntity>
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
            AutoracePlaceEntity
        >();
        container.registerInstance<
            IRaceRepository<AutoraceRaceEntity, AutoracePlaceEntity>
        >(
            'AutoraceRaceRepositoryFromStorage',
            autoraceRaceRepositoryFromStorageImpl,
        );
        autoraceRaceRepositoryFromHtmlImpl = mockRaceRepository<
            AutoraceRaceEntity,
            AutoracePlaceEntity
        >();
        container.registerInstance<
            IRaceRepository<AutoraceRaceEntity, AutoracePlaceEntity>
        >('AutoraceRaceRepositoryFromHtml', autoraceRaceRepositoryFromHtmlImpl);

        placeRepositoryFromStorageImpl =
            mockPlaceRepository<AutoracePlaceEntity>();
        container.registerInstance<IPlaceRepository<AutoracePlaceEntity>>(
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
            const mockRaceEntity: AutoraceRaceEntity[] =
                baseAutoraceRaceEntityList;

            // モックの戻り値を設定
            autoraceRaceRepositoryFromStorageImpl.fetchRaceEntityList.mockResolvedValue(
                mockRaceEntity,
            );

            const startDate = new Date('2024-06-01');
            const finishDate = new Date('2024-06-30');

            const result = await service.fetchRaceEntityList(
                startDate,
                finishDate,
                ['autorace'],
                DataLocation.Storage,
            );
            expect(result.autorace).toEqual(mockRaceEntity);
        });
        it('正常にレース開催データが取得できること（web）', async () => {
            const mockRaceEntity: AutoraceRaceEntity[] =
                baseAutoraceRaceEntityList;

            // モックの戻り値を設定
            autoraceRaceRepositoryFromHtmlImpl.fetchRaceEntityList.mockResolvedValue(
                mockRaceEntity,
            );

            const startDate = new Date('2024-06-01');
            const finishDate = new Date('2024-06-30');

            const result = await service.fetchRaceEntityList(
                startDate,
                finishDate,
                ['autorace'],
                DataLocation.Web,
            );
            expect(result.autorace).toEqual(mockRaceEntity);
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
                ['autorace'],
                DataLocation.Storage,
            );

            expect(consoleSpy).toHaveBeenCalled();
        });
    });

    describe('updateRaceDataList', () => {
        it('正常にレース開催データが更新されること', async () => {
            const mockRaceEntity: AutoraceRaceEntity[] =
                baseAutoraceRaceEntityList;

            // モックの戻り値を設定
            autoraceRaceRepositoryFromStorageImpl.fetchRaceEntityList.mockResolvedValue(
                mockRaceEntity,
            );

            await service.updateRaceEntityList({ autorace: mockRaceEntity });

            expect(
                autoraceRaceRepositoryFromStorageImpl.registerRaceEntityList,
            ).toHaveBeenCalled();
        });

        it('レース開催データが0件の場合、更新処理が実行されないこと', async () => {
            const mockRaceEntity: AutoraceRaceEntity[] = [];

            await service.updateRaceEntityList({ autorace: mockRaceEntity });

            expect(
                autoraceRaceRepositoryFromStorageImpl.registerRaceEntityList,
            ).not.toHaveBeenCalled();
        });
    });
});
