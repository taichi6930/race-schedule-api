import { RaceType } from '@race-schedule/shared/src/types/raceType';
import 'reflect-metadata';
import { describe, expect, it, vi } from 'vitest';

import { PlaceHtmlR2Repository } from '../../src/repository/implement/placeHtmlRepository';

describe('PlaceHtmlR2Repository', () => {
    // モックGatewayの作成
    const createMockGateways = (html: string = '<html></html>') => ({
        r2Gateway: {
            getObject: vi.fn().mockResolvedValue(html),
            putObject: vi.fn().mockResolvedValue(undefined),
        },
        placeDataHtmlGateway: {
            fetch: vi.fn().mockResolvedValue(html),
        },
    });

    describe('fetchPlaceHtml', () => {
        it('placeDataHtmlGatewayからHTMLを取得し、R2に保存すること', async () => {
            const mockHtml = '<html><body>Test HTML</body></html>';
            const mocks = createMockGateways(mockHtml);
            const repository = new PlaceHtmlR2Repository(
                mocks.r2Gateway as any,
                mocks.placeDataHtmlGateway as any,
            );

            const date = new Date(2024, 0, 1);
            const result = await repository.fetchPlaceHtml(RaceType.JRA, date);

            expect(result).toBe(mockHtml);
            expect(mocks.placeDataHtmlGateway.fetch).toHaveBeenCalledWith(
                RaceType.JRA,
                date,
            );
            expect(mocks.r2Gateway.putObject).toHaveBeenCalled();
        });

        it('NAR/KEIRIN/AUTORACE等のレースタイプでも正しく動作すること', async () => {
            const mockHtml = '<html><body>NAR HTML</body></html>';
            const mocks = createMockGateways(mockHtml);
            const repository = new PlaceHtmlR2Repository(
                mocks.r2Gateway as any,
                mocks.placeDataHtmlGateway as any,
            );

            const date = new Date(2024, 5, 1);
            const result = await repository.fetchPlaceHtml(RaceType.NAR, date);

            expect(result).toBe(mockHtml);
            expect(mocks.placeDataHtmlGateway.fetch).toHaveBeenCalledWith(
                RaceType.NAR,
                date,
            );
        });
    });

    describe('loadPlaceHtml', () => {
        it('R2からJRAのHTMLを読み込むこと（年単位）', async () => {
            const mockHtml = '<html><body>Cached HTML</body></html>';
            const mocks = createMockGateways(mockHtml);
            const repository = new PlaceHtmlR2Repository(
                mocks.r2Gateway as any,
                mocks.placeDataHtmlGateway as any,
            );

            const date = new Date(2024, 0, 1);
            const result = await repository.loadPlaceHtml(RaceType.JRA, date);

            expect(result).toBe(mockHtml);
            expect(mocks.r2Gateway.getObject).toHaveBeenCalledWith(
                'place/JRA2024.html',
            );
        });

        it('R2からNARのHTMLを読み込むこと（月単位）', async () => {
            const mockHtml = '<html><body>NAR Cached HTML</body></html>';
            const mocks = createMockGateways(mockHtml);
            const repository = new PlaceHtmlR2Repository(
                mocks.r2Gateway as any,
                mocks.placeDataHtmlGateway as any,
            );

            const date = new Date(2024, 5, 1);
            const result = await repository.loadPlaceHtml(RaceType.NAR, date);

            expect(result).toBe(mockHtml);
            expect(mocks.r2Gateway.getObject).toHaveBeenCalledWith(
                'place/NAR202406.html',
            );
        });

        it('HTMLが存在しない場合はnullを返すこと', async () => {
            const mocks = createMockGateways();
            mocks.r2Gateway.getObject = vi.fn().mockResolvedValue(null);

            const repository = new PlaceHtmlR2Repository(
                mocks.r2Gateway as any,
                mocks.placeDataHtmlGateway as any,
            );

            const date = new Date(2024, 0, 1);
            const result = await repository.loadPlaceHtml(RaceType.JRA, date);

            expect(result).toBeNull();
        });
    });

    describe('savePlaceHtml', () => {
        it('HTMLをR2に保存すること', async () => {
            const mockHtml = '<html><body>Save Test</body></html>';
            const mocks = createMockGateways();
            const repository = new PlaceHtmlR2Repository(
                mocks.r2Gateway as any,
                mocks.placeDataHtmlGateway as any,
            );

            const date = new Date(2024, 0, 1);
            await repository.savePlaceHtml(RaceType.JRA, date, mockHtml);

            expect(mocks.r2Gateway.putObject).toHaveBeenCalledWith(
                'place/JRA2024.html',
                mockHtml,
            );
        });
    });
});
