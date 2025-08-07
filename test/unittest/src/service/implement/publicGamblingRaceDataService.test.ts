import 'reflect-metadata'; // reflect-metadataをインポート

import { container } from 'tsyringe';

import type { AutoraceRaceEntity } from '../../../../../lib/src/repository/entity/autoraceRaceEntity';
import type { BoatraceRaceEntity } from '../../../../../lib/src/repository/entity/boatraceRaceEntity';
import type { JraPlaceEntity } from '../../../../../lib/src/repository/entity/jraPlaceEntity';
import type { JraRaceEntity } from '../../../../../lib/src/repository/entity/jraRaceEntity';
import type { KeirinRaceEntity } from '../../../../../lib/src/repository/entity/keirinRaceEntity';
import type { MechanicalRacingPlaceEntity } from '../../../../../lib/src/repository/entity/mechanicalRacingPlaceEntity';
import type { NarPlaceEntity } from '../../../../../lib/src/repository/entity/narPlaceEntity';
import type { NarRaceEntity } from '../../../../../lib/src/repository/entity/narRaceEntity';
import type { WorldPlaceEntity } from '../../../../../lib/src/repository/entity/worldPlaceEntity';
import type { WorldRaceEntity } from '../../../../../lib/src/repository/entity/worldRaceEntity';
import type { IPlaceRepository } from '../../../../../lib/src/repository/interface/IPlaceRepository';
import type { IRaceRepository } from '../../../../../lib/src/repository/interface/IRaceRepository';
import { PublicGamblingRaceDataService } from '../../../../../lib/src/service/implement/publicGamblingRaceDataService';
import type { IRaceDataService } from '../../../../../lib/src/service/interface/IRaceDataService';
import { DataLocation } from '../../../../../lib/src/utility/dataType';
import { RaceType } from '../../../../../lib/src/utility/raceType';
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
        IRaceRepository<KeirinRaceEntity, MechanicalRacingPlaceEntity>
    >;
    let keirinRaceRepositoryFromHtmlImpl: jest.Mocked<
        IRaceRepository<KeirinRaceEntity, MechanicalRacingPlaceEntity>
    >;
    let boatraceRaceRepositoryFromStorageImpl: jest.Mocked<
        IRaceRepository<BoatraceRaceEntity, MechanicalRacingPlaceEntity>
    >;
    let boatraceRaceRepositoryFromHtmlImpl: jest.Mocked<
        IRaceRepository<BoatraceRaceEntity, MechanicalRacingPlaceEntity>
    >;
    let autoraceRaceRepositoryFromStorageImpl: jest.Mocked<
        IRaceRepository<AutoraceRaceEntity, MechanicalRacingPlaceEntity>
    >;
    let autoraceRaceRepositoryFromHtmlImpl: jest.Mocked<
        IRaceRepository<AutoraceRaceEntity, MechanicalRacingPlaceEntity>
    >;
    let placeRepositoryFromStorageImpl: jest.Mocked<
        IPlaceRepository<MechanicalRacingPlaceEntity>
    >;
    let service: IRaceDataService;

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
            MechanicalRacingPlaceEntity
        >();
        container.registerInstance<
            IRaceRepository<KeirinRaceEntity, MechanicalRacingPlaceEntity>
        >(
            'KeirinRaceRepositoryFromStorage',
            keirinRaceRepositoryFromStorageImpl,
        );
        keirinRaceRepositoryFromHtmlImpl = mockRaceRepository<
            KeirinRaceEntity,
            MechanicalRacingPlaceEntity
        >();
        container.registerInstance<
            IRaceRepository<KeirinRaceEntity, MechanicalRacingPlaceEntity>
        >('KeirinRaceRepositoryFromHtml', keirinRaceRepositoryFromHtmlImpl);

        // boatrace
        boatraceRaceRepositoryFromStorageImpl = mockRaceRepository<
            BoatraceRaceEntity,
            MechanicalRacingPlaceEntity
        >();
        container.registerInstance<
            IRaceRepository<BoatraceRaceEntity, MechanicalRacingPlaceEntity>
        >(
            'BoatraceRaceRepositoryFromStorage',
            boatraceRaceRepositoryFromStorageImpl,
        );
        boatraceRaceRepositoryFromHtmlImpl = mockRaceRepository<
            BoatraceRaceEntity,
            MechanicalRacingPlaceEntity
        >();
        container.registerInstance<
            IRaceRepository<BoatraceRaceEntity, MechanicalRacingPlaceEntity>
        >('BoatraceRaceRepositoryFromHtml', boatraceRaceRepositoryFromHtmlImpl);

        autoraceRaceRepositoryFromStorageImpl = mockRaceRepository<
            AutoraceRaceEntity,
            MechanicalRacingPlaceEntity
        >();
        container.registerInstance<
            IRaceRepository<AutoraceRaceEntity, MechanicalRacingPlaceEntity>
        >(
            'AutoraceRaceRepositoryFromStorage',
            autoraceRaceRepositoryFromStorageImpl,
        );
        autoraceRaceRepositoryFromHtmlImpl = mockRaceRepository<
            AutoraceRaceEntity,
            MechanicalRacingPlaceEntity
        >();
        container.registerInstance<
            IRaceRepository<AutoraceRaceEntity, MechanicalRacingPlaceEntity>
        >('AutoraceRaceRepositoryFromHtml', autoraceRaceRepositoryFromHtmlImpl);

        placeRepositoryFromStorageImpl =
            mockPlaceRepository<MechanicalRacingPlaceEntity>();
        container.registerInstance<
            IPlaceRepository<MechanicalRacingPlaceEntity>
        >('AutoracePlaceRepositoryFromStorage', placeRepositoryFromStorageImpl);

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
                [
                    RaceType.JRA,
                    RaceType.NAR,
                    RaceType.WORLD,
                    RaceType.KEIRIN,
                    RaceType.BOATRACE,
                    RaceType.AUTORACE,
                ],
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
                [
                    RaceType.JRA,
                    RaceType.NAR,
                    RaceType.WORLD,
                    RaceType.KEIRIN,
                    RaceType.BOATRACE,
                    RaceType.AUTORACE,
                ],
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
                [
                    RaceType.JRA,
                    RaceType.NAR,
                    RaceType.WORLD,
                    RaceType.KEIRIN,
                    RaceType.BOATRACE,
                    RaceType.AUTORACE,
                ],
                DataLocation.Storage,
            );

            expect(consoleSpy).toHaveBeenCalled();
        });
    });

    describe('updateRaceEntityList', () => {
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
