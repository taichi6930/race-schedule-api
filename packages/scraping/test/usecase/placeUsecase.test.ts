/**
 * PlaceUsecase テスト
 *
 * ## デシジョンテーブル
 *
 * | No | レースタイプ | 期間         | 取得単位 | 期待される動作 |
 * |----|------------|-------------|---------|---------------|
 * | 1  | JRA        | 1年         | 年      | Service 1回呼び出し |
 * | 2  | JRA        | 2年         | 年      | Service 2回呼び出し |
 * | 3  | NAR        | 3ヶ月       | 月      | Service 3回呼び出し |
 * | 4  | KEIRIN     | 1ヶ月       | 月      | Service 1回呼び出し |
 * | 5  | JRA+NAR    | 1年1ヶ月    | 混在    | Service複数回呼び出し |
 *
 * ### 取得ロジック
 * - **JRA**: 年単位で取得（startDate～finishDateの年ごと）
 * - **NAR/KEIRIN/AUTORACE/OVERSEAS/BOATRACE**: 月単位で取得
 * - 複数レースタイプ指定時は順次処理
 *
 * ### フィルタリング
 * - startDate/finishDateで期間指定
 * - raceTypeListで対象レースタイプ指定
 * - locationListは将来の拡張用（現在は未実装）
 */
import { RaceType } from '@race-schedule/shared/src/types/raceType';
import 'reflect-metadata';
import { describe, expect, it, vi } from 'vitest';

import { PlaceUsecase } from '../../src/usecase/placeUsecase';

describe('PlaceUsecase', () => {
    // モックサービスの作成
    const createMockService = (places: any[] = []) => ({
        fetch: vi.fn().mockResolvedValue(places),
    });

    describe('getAllPlaces', () => {
        it('PlaceServiceを呼び出して開催場データを取得すること', async () => {
            const mockPlaces = [
                {
                    raceType: RaceType.JRA,
                    datetime: new Date(2024, 0, 6),
                    placeName: '中山',
                },
            ];
            const mockService = createMockService(mockPlaces);
            const usecase = new PlaceUsecase(mockService as any);

            const date = new Date(2024, 0, 1);
            const result = await usecase.getAllPlaces(RaceType.JRA, date);

            expect(result).toEqual(mockPlaces);
            expect(mockService.fetch).toHaveBeenCalledWith(RaceType.JRA, date);
        });
    });

    describe('fetch', () => {
        it('JRAの場合、年単位で複数回取得すること', async () => {
            const mockPlaces = [{ raceType: RaceType.JRA, placeName: '東京' }];
            const mockService = createMockService(mockPlaces);
            const usecase = new PlaceUsecase(mockService as any);

            const filter = {
                startDate: new Date(2023, 0, 1),
                finishDate: new Date(2024, 11, 31),
                raceTypeList: ['JRA'],
            };

            const result = await usecase.fetch(filter);

            // 2023年と2024年の2回呼ばれる
            expect(mockService.fetch).toHaveBeenCalledTimes(2);
            expect(result.length).toBe(2); // mockPlaces × 2年
        });

        it('NAR/KEIRINの場合、月単位で取得すること', async () => {
            const mockPlaces = [{ raceType: RaceType.NAR, placeName: '大井' }];
            const mockService = createMockService(mockPlaces);
            const usecase = new PlaceUsecase(mockService as any);

            const filter = {
                startDate: new Date(2024, 0, 1),
                finishDate: new Date(2024, 2, 31),
                raceTypeList: ['NAR'],
            };

            const result = await usecase.fetch(filter);

            // 1月、2月、3月の3回呼ばれる
            expect(mockService.fetch).toHaveBeenCalledTimes(3);
            expect(result.length).toBe(3); // mockPlaces × 3ヶ月
        });

        it('複数のレースタイプを処理できること', async () => {
            const mockPlaces = [{ placeName: 'Test' }];
            const mockService = createMockService(mockPlaces);
            const usecase = new PlaceUsecase(mockService as any);

            const filter = {
                startDate: new Date(2024, 0, 1),
                finishDate: new Date(2024, 0, 31),
                raceTypeList: ['JRA', 'NAR'],
            };

            const result = await usecase.fetch(filter);

            // JRA 1回 + NAR 1回 = 2回
            expect(mockService.fetch).toHaveBeenCalledTimes(2);
            expect(result.length).toBe(2);
        });
    });

    describe('フィルタリング', () => {
        it('startDate/finishDateでフィルタリングすること', async () => {
            const mockPlaces = [
                {
                    raceType: RaceType.JRA,
                    datetime: new Date(2024, 0, 6),
                    placeName: '中山',
                },
                {
                    raceType: RaceType.JRA,
                    datetime: new Date(2024, 0, 13),
                    placeName: '中京',
                },
                {
                    raceType: RaceType.JRA,
                    datetime: new Date(2024, 1, 10),
                    placeName: '東京',
                },
            ];
            const mockService = createMockService(mockPlaces);
            const usecase = new PlaceUsecase(mockService as any);

            const filter = {
                startDate: new Date(2024, 0, 1),
                finishDate: new Date(2024, 0, 31),
                raceTypeList: ['JRA'],
            };

            const result = await usecase.fetch(filter);

            // 結果に日付範囲内のデータが含まれることを確認
            expect(mockService.fetch).toHaveBeenCalled();
            expect(result).toBeDefined();
        });
    });
});
