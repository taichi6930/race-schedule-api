import { RaceType } from '@race-schedule/shared/src/types/raceType';
import 'reflect-metadata';
import { describe, expect, it, vi } from 'vitest';

import { RaceHtmlR2Repository } from '../../src/repository/implement/raceHtmlRepository';

describe('RaceHtmlR2Repository', () => {
    // モックGatewayの作成
    const createMockGateways = (html: string = '<html></html>') => ({
        r2Gateway: {
            getObject: vi.fn().mockResolvedValue(html),
            putObject: vi.fn().mockResolvedValue(undefined),
        },
        raceDataHtmlGateway: {
            fetch: vi.fn().mockResolvedValue(html),
        },
    });

    describe('fetchRaceHtml', () => {
        it('raceDataHtmlGatewayからHTMLを取得し、R2に保存すること', async () => {
            const mockHtml = '<html><body>Race HTML</body></html>';
            const mocks = createMockGateways(mockHtml);
            const repository = new RaceHtmlR2Repository(
                mocks.r2Gateway as any,
                mocks.raceDataHtmlGateway as any,
            );

            const date = new Date(2024, 4, 26);
            const location = '東京';
            const result = await repository.fetchRaceHtml(
                RaceType.JRA,
                date,
                location,
            );

            expect(result).toBe(mockHtml);
            expect(mocks.raceDataHtmlGateway.fetch).toHaveBeenCalledWith(
                RaceType.JRA,
                date,
                location,
                undefined,
            );
            expect(mocks.r2Gateway.putObject).toHaveBeenCalled();
        });

        it('レース番号を指定して取得できること', async () => {
            const mockHtml = '<html><body>Race 10 HTML</body></html>';
            const mocks = createMockGateways(mockHtml);
            const repository = new RaceHtmlR2Repository(
                mocks.r2Gateway as any,
                mocks.raceDataHtmlGateway as any,
            );

            const date = new Date(2024, 4, 26);
            const location = '東京';
            const number = 10;
            const result = await repository.fetchRaceHtml(
                RaceType.JRA,
                date,
                location,
                number,
            );

            expect(result).toBe(mockHtml);
            expect(mocks.raceDataHtmlGateway.fetch).toHaveBeenCalledWith(
                RaceType.JRA,
                date,
                location,
                number,
            );
        });
    });

    describe('loadRaceHtml', () => {
        it('R2からJRAのHTMLを読み込むこと', async () => {
            const mockHtml = '<html><body>Cached Race HTML</body></html>';
            const mocks = createMockGateways(mockHtml);
            const repository = new RaceHtmlR2Repository(
                mocks.r2Gateway as any,
                mocks.raceDataHtmlGateway as any,
            );

            const date = new Date(2024, 4, 26);
            const location = '東京';
            const result = await repository.loadRaceHtml(
                RaceType.JRA,
                date,
                location,
            );

            expect(result).toBe(mockHtml);
            expect(mocks.r2Gateway.getObject).toHaveBeenCalled();
        });

        it('HTMLが存在しない場合はnullを返すこと', async () => {
            const mocks = createMockGateways();
            mocks.r2Gateway.getObject = vi.fn().mockResolvedValue(null);

            const repository = new RaceHtmlR2Repository(
                mocks.r2Gateway as any,
                mocks.raceDataHtmlGateway as any,
            );

            const date = new Date(2024, 4, 26);
            const location = '東京';
            const result = await repository.loadRaceHtml(
                RaceType.JRA,
                date,
                location,
            );

            expect(result).toBeNull();
        });
    });

    describe('saveRaceHtml', () => {
        it('HTMLをR2に保存すること', async () => {
            const mockHtml = '<html><body>Save Race Test</body></html>';
            const mocks = createMockGateways();
            const repository = new RaceHtmlR2Repository(
                mocks.r2Gateway as any,
                mocks.raceDataHtmlGateway as any,
            );

            const date = new Date(2024, 4, 26);
            const location = '東京';
            await repository.saveRaceHtml(
                RaceType.JRA,
                date,
                mockHtml,
                location,
            );

            expect(mocks.r2Gateway.putObject).toHaveBeenCalled();
        });
    });
});
