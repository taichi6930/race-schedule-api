import 'reflect-metadata';

import { container } from 'tsyringe';

import { NarPlaceData } from '../../../../lib/src/domain/narPlaceData';
import { NarRaceData } from '../../../../lib/src/domain/narRaceData';
import { INarRaceDataHtmlGateway } from '../../../../lib/src/gateway/interface/iNarRaceDataHtmlGateway';
import { MockNarRaceDataHtmlGateway } from '../../../../lib/src/gateway/mock/mockNarRaceDataHtmlGateway';
import { NarRaceRepositoryFromHtmlImpl } from '../../../../lib/src/repository/implement/narRaceRepositoryFromHtmlImpl';
import { FetchRaceListRequest } from '../../../../lib/src/repository/request/fetchRaceListRequest';
import { RegisterRaceListRequest } from '../../../../lib/src/repository/request/registerRaceListRequest';

if (process.env.ENV !== 'GITHUB_ACTIONS_CI') {
    describe('NarRaceRepositoryFromHtmlImpl', () => {
        let narRaceDataHtmlGateway: INarRaceDataHtmlGateway;
        let repository: NarRaceRepositoryFromHtmlImpl;

        beforeEach(() => {
            // gatwayのモックを作成
            narRaceDataHtmlGateway = new MockNarRaceDataHtmlGateway();

            // DIコンテナにモックを登録
            container.registerInstance(
                'NarRaceDataHtmlGateway',
                narRaceDataHtmlGateway,
            );

            // テスト対象のリポジトリを生成
            repository = container.resolve(NarRaceRepositoryFromHtmlImpl);
        });

        describe('fetchPlaceList', () => {
            test('正しい競馬場データを取得できる', async () => {
                const response = await repository.fetchRaceList(
                    new FetchRaceListRequest<NarPlaceData>(
                        new Date('2024-10-02'),
                        new Date('2024-10-02'),
                        [new NarPlaceData(new Date('2024-10-02'), '大井')],
                    ),
                );
                expect(response.raceDataList).toHaveLength(12);
            });
        });

        describe('registerRaceList', () => {
            test('htmlなので登録できない', async () => {
                // リクエストの作成
                const request = new RegisterRaceListRequest<NarRaceData>([]);
                // テスト実行
                await expect(
                    repository.registerRaceList(request),
                ).rejects.toThrow('HTMLにはデータを登録出来ません');
            });
        });
    });
} else {
    describe('NarRaceRepositoryFromHtmlImpl', () => {
        test('CI環境でテストをスキップ', () => {
            expect(true).toBe(true);
        });
    });
}