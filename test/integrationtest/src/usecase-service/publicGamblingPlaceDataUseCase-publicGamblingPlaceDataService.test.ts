import 'reflect-metadata'; // reflect-metadataをインポート

import { container } from 'tsyringe';

import type { JraPlaceEntity } from '../../../../lib/src/repository/entity/jraPlaceEntity';
import type { MechanicalRacingPlaceEntity } from '../../../../lib/src/repository/entity/mechanicalRacingPlaceEntity';
import type { NarPlaceEntity } from '../../../../lib/src/repository/entity/narPlaceEntity';
import type { IPlaceRepository } from '../../../../lib/src/repository/interface/IPlaceRepository';
import { PublicGamblingPlaceDataService } from '../../../../lib/src/service/implement/publicGamblingPlaceDataService';
import type { IPlaceDataService } from '../../../../lib/src/service/interface/IPlaceDataService';
import { PublicGamblingPlaceUseCase } from '../../../../lib/src/usecase/implement/publicGamblingPlaceUseCase';
import type { IPlaceDataUseCase } from '../../../../lib/src/usecase/interface/IPlaceDataUseCase';
import { RaceType } from '../../../../lib/src/utility/raceType';
import {
    baseAutoracePlaceData,
    baseAutoracePlaceEntity,
} from '../../../unittest/src/mock/common/baseAutoraceData';
import {
    baseBoatracePlaceData,
    baseBoatracePlaceEntity,
} from '../../../unittest/src/mock/common/baseBoatraceData';
import {
    baseJraPlaceData,
    baseJraPlaceEntity,
} from '../../../unittest/src/mock/common/baseJraData';
import {
    baseKeirinPlaceData,
    baseKeirinPlaceEntity,
} from '../../../unittest/src/mock/common/baseKeirinData';
import {
    baseNarPlaceData,
    baseNarPlaceEntity,
} from '../../../unittest/src/mock/common/baseNarData';
import { mockPlaceRepository } from '../../../unittest/src/mock/repository/mockPlaceRepository';

describe('PublicGamblingPlaceDataUseCase-publicGamblingPlaceDataService', () => {
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
        IPlaceRepository<MechanicalRacingPlaceEntity>
    >;
    let keirinPlaceRepositoryFromHtmlImpl: jest.Mocked<
        IPlaceRepository<MechanicalRacingPlaceEntity>
    >;
    let boatracePlaceRepositoryFromStorageImpl: jest.Mocked<
        IPlaceRepository<MechanicalRacingPlaceEntity>
    >;
    let boatracePlaceRepositoryFromHtmlImpl: jest.Mocked<
        IPlaceRepository<MechanicalRacingPlaceEntity>
    >;
    let autoracePlaceRepositoryFromStorageImpl: jest.Mocked<
        IPlaceRepository<MechanicalRacingPlaceEntity>
    >;
    let autoracePlaceRepositoryFromHtmlImpl: jest.Mocked<
        IPlaceRepository<MechanicalRacingPlaceEntity>
    >;
    let service: IPlaceDataService;
    let useCase: IPlaceDataUseCase;

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
            mockPlaceRepository<MechanicalRacingPlaceEntity>();
        container.registerInstance<
            IPlaceRepository<MechanicalRacingPlaceEntity>
        >(
            'KeirinPlaceRepositoryFromStorage',
            keirinPlaceRepositoryFromStorageImpl,
        );

        keirinPlaceRepositoryFromHtmlImpl = mockPlaceRepository();
        container.registerInstance<
            IPlaceRepository<MechanicalRacingPlaceEntity>
        >('KeirinPlaceRepositoryFromHtml', keirinPlaceRepositoryFromHtmlImpl);

        boatracePlaceRepositoryFromStorageImpl =
            mockPlaceRepository<MechanicalRacingPlaceEntity>();
        container.registerInstance<
            IPlaceRepository<MechanicalRacingPlaceEntity>
        >(
            'BoatracePlaceRepositoryFromStorage',
            boatracePlaceRepositoryFromStorageImpl,
        );

        boatracePlaceRepositoryFromHtmlImpl = mockPlaceRepository();
        container.registerInstance<
            IPlaceRepository<MechanicalRacingPlaceEntity>
        >(
            'BoatracePlaceRepositoryFromHtml',
            boatracePlaceRepositoryFromHtmlImpl,
        );

        autoracePlaceRepositoryFromStorageImpl =
            mockPlaceRepository<MechanicalRacingPlaceEntity>();
        container.registerInstance<
            IPlaceRepository<MechanicalRacingPlaceEntity>
        >(
            'AutoracePlaceRepositoryFromStorage',
            autoracePlaceRepositoryFromStorageImpl,
        );

        autoracePlaceRepositoryFromHtmlImpl = mockPlaceRepository();
        container.registerInstance<
            IPlaceRepository<MechanicalRacingPlaceEntity>
        >(
            'AutoracePlaceRepositoryFromHtml',
            autoracePlaceRepositoryFromHtmlImpl,
        );

        service = container.resolve(PublicGamblingPlaceDataService);
        container.registerInstance<IPlaceDataService>(
            'PublicGamblingPlaceDataService',
            service,
        );
        useCase = container.resolve(PublicGamblingPlaceUseCase);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('fetchRaceEntityList', () => {
        it('正常に開催場データが取得できること', async () => {
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

            const result = await useCase.fetchPlaceDataList(
                startDate,
                finishDate,
                [
                    RaceType.JRA,
                    RaceType.NAR,
                    RaceType.KEIRIN,
                    RaceType.AUTORACE,
                    RaceType.BOATRACE,
                ],
            );

            expect(result).toEqual([
                baseJraPlaceData,
                baseNarPlaceData,
                baseKeirinPlaceData,
                baseAutoracePlaceData,
                baseBoatracePlaceData,
            ]);
        });
    });

    describe('updatePlaceDataList', () => {
        it('正常に開催場データが更新されること', async () => {
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

            await useCase.updatePlaceDataList(startDate, finishDate, [
                RaceType.JRA,
                RaceType.NAR,
                RaceType.KEIRIN,
                RaceType.AUTORACE,
                RaceType.BOATRACE,
            ]);

            expect(
                autoracePlaceRepositoryFromStorageImpl.registerPlaceEntityList,
            ).toHaveBeenCalled();
        });
    });
});
