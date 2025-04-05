import 'reflect-metadata';

import { container } from 'tsyringe';

import { NarPlaceData } from '../../../lib/src/domain/narPlaceData';
import { NarPlaceEntity } from '../../../lib/src/repository/entity/narPlaceEntity';
import type { IPlaceRepository } from '../../../lib/src/repository/interface/IPlaceRepository';
import { NarPlaceDataService } from '../../../lib/src/service/implement/narPlaceDataService';
import { NarPlaceDataUseCase } from '../../../lib/src/usecase/implement/narPlaceDataUseCase';
import type { IPlaceDataUseCase } from '../../../lib/src/usecase/interface/IPlaceDataUseCase';

describe('UseCase-Service Integration Test', () => {
    describe('NarPlaceDataUseCase-NarPlaceDataService Integration', () => {
        let mockStorageRepository: jest.Mocked<
            IPlaceRepository<NarPlaceEntity>
        >;
        let mockHtmlRepository: jest.Mocked<IPlaceRepository<NarPlaceEntity>>;
        let useCase: IPlaceDataUseCase<NarPlaceData>;

        beforeEach(() => {
            // モックリポジトリの作成
            mockStorageRepository = {
                fetchPlaceEntityList: jest.fn(),
                registerPlaceEntityList: jest.fn(),
            };
            mockHtmlRepository = {
                fetchPlaceEntityList: jest.fn(),
                registerPlaceEntityList: jest.fn(),
            };

            // DIコンテナの設定
            container.register('NarPlaceRepositoryFromStorage', {
                useValue: mockStorageRepository,
            });
            container.register('NarPlaceRepositoryFromHtml', {
                useValue: mockHtmlRepository,
            });
            container.register('NarPlaceDataService', {
                useClass: NarPlaceDataService,
            });
            container.register('NarPlaceDataUseCase', {
                useClass: NarPlaceDataUseCase,
            });

            // インスタンスの取得
            useCase = container.resolve('NarPlaceDataUseCase');
        });

        afterEach(() => {
            container.clearInstances();
        });

        describe('fetchPlaceDataList', () => {
            it('should fetch place data from storage correctly', async () => {
                // テストデータの準備
                const startDate = new Date('2024-01-01');
                const finishDate = new Date('2024-01-31');
                const testPlaceData = NarPlaceData.create(startDate, '船橋');
                const testEntity = NarPlaceEntity.createWithoutId(
                    testPlaceData,
                    new Date(),
                );

                // モックの設定
                mockStorageRepository.fetchPlaceEntityList.mockResolvedValue([
                    testEntity,
                ]);

                // テスト実行
                const result = await useCase.fetchPlaceDataList(
                    startDate,
                    finishDate,
                );

                // 検証
                expect(result).toHaveLength(1);
                expect(result[0]).toEqual(testPlaceData);
                expect(
                    mockStorageRepository.fetchPlaceEntityList,
                ).toHaveBeenCalled();
                expect(
                    mockHtmlRepository.fetchPlaceEntityList,
                ).not.toHaveBeenCalled();
            });

            it('should return empty array when storage fetch fails', async () => {
                // テストデータの準備
                const startDate = new Date('2024-01-01');
                const finishDate = new Date('2024-01-31');

                // モックの設定
                mockStorageRepository.fetchPlaceEntityList.mockRejectedValue(
                    new Error('Fetch failed'),
                );

                // テスト実行
                const result = await useCase.fetchPlaceDataList(
                    startDate,
                    finishDate,
                );

                // 検証
                expect(result).toEqual([]);
            });
        });

        describe('updatePlaceDataList', () => {
            it('should update place data correctly', async () => {
                // テストデータの準備
                const startDate = new Date('2024-01-15');
                const finishDate = new Date('2024-01-31');
                const testPlaceData = NarPlaceData.create(startDate, '船橋');
                const testEntity = NarPlaceEntity.createWithoutId(
                    testPlaceData,
                    new Date(),
                );

                // モックの設定
                mockHtmlRepository.fetchPlaceEntityList.mockResolvedValue([
                    testEntity,
                ]);
                mockStorageRepository.registerPlaceEntityList.mockResolvedValue();

                // テスト実行
                await useCase.updatePlaceDataList(startDate, finishDate);

                // 検証
                expect(
                    mockHtmlRepository.fetchPlaceEntityList,
                ).toHaveBeenCalled();
                expect(
                    mockStorageRepository.registerPlaceEntityList,
                ).toHaveBeenCalledWith([testEntity]);
            });

            it('should handle empty data during update', async () => {
                // テストデータの準備
                const startDate = new Date('2024-01-15');
                const finishDate = new Date('2024-01-31');

                // モックの設定
                mockHtmlRepository.fetchPlaceEntityList.mockResolvedValue([]);

                // テスト実行
                await useCase.updatePlaceDataList(startDate, finishDate);

                // 検証
                expect(
                    mockHtmlRepository.fetchPlaceEntityList,
                ).toHaveBeenCalled();
                expect(
                    mockStorageRepository.registerPlaceEntityList,
                ).not.toHaveBeenCalled();
            });

            it('should handle fetch error during update', async () => {
                // テストデータの準備
                const startDate = new Date('2024-01-15');
                const finishDate = new Date('2024-01-31');

                // モックの設定
                mockHtmlRepository.fetchPlaceEntityList.mockRejectedValue(
                    new Error('Fetch failed'),
                );

                // テスト実行
                await useCase.updatePlaceDataList(startDate, finishDate);

                // 検証
                expect(
                    mockHtmlRepository.fetchPlaceEntityList,
                ).toHaveBeenCalled();
                expect(
                    mockStorageRepository.registerPlaceEntityList,
                ).not.toHaveBeenCalled();
            });
        });
    });
});
