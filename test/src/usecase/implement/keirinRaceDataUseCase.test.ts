import 'reflect-metadata'; // reflect-metadataをインポート

import { container } from 'tsyringe';

import { KeirinRaceData } from '../../../../lib/src/domain/keirinRaceData';
import type { KeirinPlaceEntity } from '../../../../lib/src/repository/entity/keirinPlaceEntity';
import type { KeirinRaceEntity } from '../../../../lib/src/repository/entity/keirinRaceEntity';
import type { IPlaceRepository } from '../../../../lib/src/repository/interface/IPlaceRepository';
import type { IRaceRepository } from '../../../../lib/src/repository/interface/IRaceRepository';
import { FetchRaceListResponse } from '../../../../lib/src/repository/response/fetchRaceListResponse';
import { KeirinRaceDataUseCase } from '../../../../lib/src/usecase/implement/keirinRaceDataUseCase';
import { baseKeirinRaceEntity } from '../../mock/common/baseData';
import { mockKeirinPlaceRepositoryFromStorageImpl } from '../../mock/repository/keirinPlaceRepositoryFromStorageImpl';
import { mockKeirinRaceRepositoryFromHtmlImpl } from '../../mock/repository/keirinRaceRepositoryFromHtmlImpl';
import { mockKeirinRaceRepositoryFromStorageImpl } from '../../mock/repository/keirinRaceRepositoryFromStorageImpl';

describe('KeirinRaceDataUseCase', () => {
    let keirinRaceRepositoryFromStorageImpl: jest.Mocked<
        IRaceRepository<KeirinRaceEntity, KeirinPlaceEntity>
    >;
    let keirinRaceRepositoryFromHtmlImpl: jest.Mocked<
        IRaceRepository<KeirinRaceEntity, KeirinPlaceEntity>
    >;
    let keirinPlaceRepositoryFromStorageImpl: jest.Mocked<
        IPlaceRepository<KeirinPlaceEntity>
    >;
    let useCase: KeirinRaceDataUseCase;

    beforeEach(() => {
        // IRaceRepositoryインターフェースの依存関係を登録
        keirinRaceRepositoryFromStorageImpl =
            mockKeirinRaceRepositoryFromStorageImpl();
        container.register<
            IRaceRepository<KeirinRaceEntity, KeirinPlaceEntity>
        >('KeirinRaceRepositoryFromStorage', {
            useValue: keirinRaceRepositoryFromStorageImpl,
        });
        keirinRaceRepositoryFromHtmlImpl =
            mockKeirinRaceRepositoryFromHtmlImpl();
        container.register<
            IRaceRepository<KeirinRaceEntity, KeirinPlaceEntity>
        >('KeirinRaceRepositoryFromHtml', {
            useValue: keirinRaceRepositoryFromHtmlImpl,
        });

        // keirinPlaceRepositoryFromStorageImplをコンテナに登録
        keirinPlaceRepositoryFromStorageImpl =
            mockKeirinPlaceRepositoryFromStorageImpl();
        container.register<IPlaceRepository<KeirinPlaceEntity>>(
            'KeirinPlaceRepositoryFromStorage',
            {
                useValue: keirinPlaceRepositoryFromStorageImpl,
            },
        );

        // KeirinRaceCalendarUseCaseをコンテナから取得
        useCase = container.resolve(KeirinRaceDataUseCase);
    });

    const baseRaceData = new KeirinRaceData(
        'KEIRINグランプリ',
        'グランプリ',
        new Date('2025-12-30 16:30'),
        '平塚',
        'GP',
        11,
    );
    const baseRaceEntity = baseKeirinRaceEntity;

    describe('fetchRaceDataList', () => {
        it('正常にレースデータが取得できること', async () => {
            const mockRaceData: KeirinRaceData[] = [baseRaceData];
            const mockRaceEntity: KeirinRaceEntity[] = [baseRaceEntity];

            // モックの戻り値を設定
            keirinRaceRepositoryFromStorageImpl.fetchRaceList.mockResolvedValue(
                new FetchRaceListResponse<KeirinRaceEntity>(mockRaceEntity),
            );

            const startDate = new Date('2025-12-01');
            const finishDate = new Date('2025-12-31');

            const result = await useCase.fetchRaceDataList(
                startDate,
                finishDate,
            );

            expect(result).toEqual(mockRaceData);
        });
    });

    describe('updateRaceDataList', () => {
        it('正常にレースデータが更新されること', async () => {
            const mockRaceEntity: KeirinRaceEntity[] = [baseRaceEntity];

            const startDate = new Date('2025-12-01');
            const finishDate = new Date('2025-12-31');

            // モックの戻り値を設定
            keirinRaceRepositoryFromStorageImpl.fetchRaceList.mockResolvedValue(
                new FetchRaceListResponse<KeirinRaceEntity>(mockRaceEntity),
            );

            await useCase.updateRaceDataList(startDate, finishDate);

            expect(
                keirinPlaceRepositoryFromStorageImpl.fetchPlaceList,
            ).toHaveBeenCalled();
            expect(
                keirinRaceRepositoryFromHtmlImpl.fetchRaceList,
            ).toHaveBeenCalled();
            expect(
                keirinRaceRepositoryFromStorageImpl.registerRaceList,
            ).toHaveBeenCalled();
        });

        it('レースデータが取得できない場合、エラーが発生すること', async () => {
            const startDate = new Date('2025-12-01');
            const finishDate = new Date('2025-12-31');

            // モックの戻り値を設定（エラーが発生するように設定）
            keirinRaceRepositoryFromHtmlImpl.fetchRaceList.mockRejectedValue(
                new Error('レースデータの取得に失敗しました'),
            );

            const consoleSpy = jest
                .spyOn(console, 'error')
                .mockImplementation();

            await useCase.updateRaceDataList(startDate, finishDate);

            expect(consoleSpy).toHaveBeenCalled();
        });
    });
});
