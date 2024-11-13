import 'reflect-metadata'; // reflect-metadataをインポート

import { container } from 'tsyringe';

import type { JraPlaceData } from '../../../../lib/src/domain/jraPlaceData';
import type { JraPlaceEntity } from '../../../../lib/src/repository/entity/jraPlaceEntity';
import type { IPlaceRepository } from '../../../../lib/src/repository/interface/IPlaceRepository';
import { FetchPlaceListResponse } from '../../../../lib/src/repository/response/fetchPlaceListResponse';
import { JraPlaceDataUseCase } from '../../../../lib/src/usecase/implement/jraPlaceDataUseCase';
import {
    baseJraPlaceData,
    baseJraPlaceEntity,
} from '../../mock/common/baseData';
import { mockJraPlaceRepositoryFromHtmlImpl } from '../../mock/repository/jraPlaceRepositoryFromHtmlImpl';
import { mockJraPlaceRepositoryFromS3Impl } from '../../mock/repository/jraPlaceRepositoryFromS3Impl';

describe('JraPlaceDataUseCase', () => {
    let jraPlaceRepositoryFromS3Impl: jest.Mocked<
        IPlaceRepository<JraPlaceEntity>
    >;
    let jraPlaceRepositoryFromHtmlImpl: jest.Mocked<
        IPlaceRepository<JraPlaceEntity>
    >;
    let useCase: JraPlaceDataUseCase;

    beforeEach(() => {
        // jraPlaceRepositoryFromS3Implをコンテナに登録
        jraPlaceRepositoryFromS3Impl = mockJraPlaceRepositoryFromS3Impl();
        container.register<IPlaceRepository<JraPlaceEntity>>(
            'JraPlaceRepositoryFromS3',
            {
                useValue: jraPlaceRepositoryFromS3Impl,
            },
        );

        jraPlaceRepositoryFromHtmlImpl = mockJraPlaceRepositoryFromHtmlImpl();
        container.register<IPlaceRepository<JraPlaceEntity>>(
            'JraPlaceRepositoryFromHtml',
            {
                useValue: jraPlaceRepositoryFromHtmlImpl,
            },
        );

        // JraPlaceCalendarUseCaseをコンテナから取得
        useCase = container.resolve(JraPlaceDataUseCase);
    });

    describe('fetchRaceDataList', () => {
        it('正常にレースデータが取得できること', async () => {
            const mockPlaceData: JraPlaceData[] = [baseJraPlaceData];
            const mockPlaceEntity: JraPlaceEntity[] = [baseJraPlaceEntity];

            // モックの戻り値を設定
            jraPlaceRepositoryFromS3Impl.fetchPlaceList.mockResolvedValue(
                new FetchPlaceListResponse<JraPlaceEntity>(mockPlaceEntity),
            );

            const startDate = new Date('2024-06-01');
            const finishDate = new Date('2024-06-30');

            const result = await useCase.fetchPlaceDataList(
                startDate,
                finishDate,
            );

            expect(result).toEqual(mockPlaceData);
        });
    });

    describe('updatePlaceDataList', () => {
        it('正常に競馬場データが更新されること', async () => {
            const mockPlaceEntity: JraPlaceEntity[] = [baseJraPlaceEntity];

            const startDate = new Date('2024-06-01');
            const finishDate = new Date('2024-06-30');

            // モックの戻り値を設定
            jraPlaceRepositoryFromS3Impl.fetchPlaceList.mockResolvedValue(
                new FetchPlaceListResponse<JraPlaceEntity>(mockPlaceEntity),
            );

            await useCase.updatePlaceDataList(startDate, finishDate);

            expect(
                jraPlaceRepositoryFromHtmlImpl.fetchPlaceList,
            ).toHaveBeenCalled();
            expect(
                jraPlaceRepositoryFromS3Impl.registerPlaceList,
            ).toHaveBeenCalled();
        });
    });
});
