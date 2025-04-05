import 'reflect-metadata';

import { container } from 'tsyringe';

import { NarPlaceData } from '../../../lib/src/domain/narPlaceData';
import type { IS3Gateway } from '../../../lib/src/gateway/interface/iS3Gateway';
import type { NarPlaceRecord } from '../../../lib/src/gateway/record/narPlaceRecord';
import { NarPlaceEntity } from '../../../lib/src/repository/entity/narPlaceEntity';
import { NarPlaceRepositoryFromStorageImpl } from '../../../lib/src/repository/implement/narPlaceRepositoryFromStorageImpl';
import type { IPlaceRepository } from '../../../lib/src/repository/interface/IPlaceRepository';
import { NarPlaceDataService } from '../../../lib/src/service/implement/narPlaceDataService';
import { NarPlaceDataUseCase } from '../../../lib/src/usecase/implement/narPlaceDataUseCase';
import type { IPlaceDataUseCase } from '../../../lib/src/usecase/interface/IPlaceDataUseCase';
import { mockS3Gateway } from '../mock/gateway/mockS3Gateway';

describe('UseCase-Service Integration Test', () => {
    describe('NarPlaceDataUseCase-NarPlaceDataService Integration', () => {
        let s3Gateway: jest.Mocked<IS3Gateway<NarPlaceRecord>>;
        let mockHtmlRepository: jest.Mocked<IPlaceRepository<NarPlaceEntity>>;
        let useCase: IPlaceDataUseCase<NarPlaceData>;

        beforeEach(() => {
            // S3Gatewayのモックを作成
            s3Gateway = mockS3Gateway<NarPlaceRecord>();
            mockHtmlRepository = {
                fetchPlaceEntityList: jest.fn(),
                registerPlaceEntityList: jest.fn(),
            };

            // DIコンテナの設定
            container.register('NarPlaceS3Gateway', {
                useValue: s3Gateway,
            });
            container.register('NarPlaceRepositoryFromHtml', {
                useValue: mockHtmlRepository,
            });
            container.register('NarPlaceRepositoryFromStorage', {
                useClass: NarPlaceRepositoryFromStorageImpl,
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
                // S3から取得するデータをCSV形式で返す
                s3Gateway.fetchDataFromS3.mockResolvedValue(
                    'id,dateTime,location,updateDate\n' +
                        `${testEntity.id},${testEntity.placeData.dateTime.toISOString()},${testEntity.placeData.location},${testEntity.updateDate.toISOString()}`,
                );

                // テスト実行
                const result = await useCase.fetchPlaceDataList(
                    startDate,
                    finishDate,
                );

                // 検証
                expect(result).toHaveLength(1);
                expect(result[0]).toEqual(testPlaceData);
                expect(s3Gateway.fetchDataFromS3).toHaveBeenCalled();
                expect(
                    mockHtmlRepository.fetchPlaceEntityList,
                ).not.toHaveBeenCalled();
            });

            it('should return empty array when storage fetch fails', async () => {
                // テストデータの準備
                const startDate = new Date('2024-01-01');
                const finishDate = new Date('2024-01-31');

                // モックの設定
                s3Gateway.fetchDataFromS3.mockRejectedValue(
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
                s3Gateway.uploadDataToS3.mockResolvedValue();

                // テスト実行
                await useCase.updatePlaceDataList(startDate, finishDate);

                // 検証
                expect(
                    mockHtmlRepository.fetchPlaceEntityList,
                ).toHaveBeenCalled();
                // アップロードされるデータを検証
                const [[uploadedData, fileName]] =
                    s3Gateway.uploadDataToS3.mock.calls;
                expect(uploadedData).toHaveLength(1);
                expect(uploadedData[0]).toMatchObject({
                    id: testEntity.id,
                    dateTime: testEntity.placeData.dateTime,
                    location: testEntity.placeData.location,
                });
                expect(uploadedData[0].updateDate).toBeInstanceOf(Date);
                expect(fileName).toBe('placeList.csv');
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
                expect(s3Gateway.uploadDataToS3).not.toHaveBeenCalled();
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
                expect(s3Gateway.uploadDataToS3).not.toHaveBeenCalled();
            });
        });
    });
});
