import 'reflect-metadata';

import { container } from 'tsyringe';

import { PlaceController } from '../../../../src/controller/placeController';
import { RaceType } from '../../../../src/utility/raceType';
import type { TestUsecaseSetup } from '../../../utility/testSetupHelper';
import {
    clearMocks,
    setupTestUsecaseMock,
} from '../../../utility/testSetupHelper';
import { mockPlaceEntityList } from '../mock/common/baseCommonData';
import { commonParameterMock } from '../mock/common/commonParameterMock';
/*
ディシジョンテーブル: getPlaceEntityList

| No. | searchParams | parseQueryToFilter | usecase.fetchRaceEntityList | 期待レスポンス内容         | ステータス |
|-----|--------------|--------------------|----------------------------|----------------------------|----------|
| 1   | 正常         | 成功               | 成功                       | races配列返却              | 200      |
| 2   | 正常         | 成功               | 例外                       | Internal Server Error      | 500      |
| 3   | 正常         | ValidationError    | -                          | Bad Request: メッセージ    | 400      |
| 4   | 不正         | ValidationError    | -                          | Bad Request: メッセージ    | 400      |

ディシジョンテーブル: postUpsertPlace

| No. | request.body | parseBodyToFilter | usecase.upsertRaceEntityList | 期待レスポンス内容         | ステータス |
|-----|--------------|-------------------|-----------------------------|----------------------------|----------|
| 1   | 正常         | 成功              | 成功                        | Upsert completed, successCount, failureCount, failures | 200 |
| 2   | 正常         | 成功              | 例外                        | Internal Server Error      | 500      |
| 3   | 正常         | ValidationError   | -                           | Bad Request: メッセージ    | 400      |
| 4   | 正常         | その他例外        | -                           | Internal Server Error      | 500      |
| 5   | 不正         | ValidationError   | -                           | Bad Request: メッセージ    | 400      |
*/

describe('PlaceControllerのテスト', () => {
    let controller: PlaceController;
    let usecaseSetUp: TestUsecaseSetup;

    beforeEach(() => {
        usecaseSetUp = setupTestUsecaseMock();
        controller = container.resolve(PlaceController);
    });

    afterEach(() => {
        clearMocks();
    });

    describe('getPlaceEntityList', () => {
        const mockSearchParams = new URLSearchParams({
            startDate: '2024-06-01',
            finishDate: '2024-06-30',
            raceType: RaceType.JRA,
        });

        it('正常に開催データが取得でき、レスポンスが返却されること', async () => {
            usecaseSetUp.placeUsecase.fetchPlaceEntityList.mockResolvedValue(
                mockPlaceEntityList,
            );

            const response =
                await controller.getPlaceEntityList(mockSearchParams);

            expect(
                usecaseSetUp.placeUsecase.fetchPlaceEntityList,
            ).toHaveBeenCalled();
            expect(response.status).toBe(200);
            const responseBody = await response.json();
            expect(responseBody.count).toEqual(mockPlaceEntityList.length);
        });

        it('usecaseで例外が発生した場合、500エラーが返却されること', async () => {
            usecaseSetUp.placeUsecase.fetchPlaceEntityList.mockRejectedValue(
                new Error('Database error'),
            );

            const response =
                await controller.getPlaceEntityList(mockSearchParams);

            expect(
                usecaseSetUp.placeUsecase.fetchPlaceEntityList,
            ).toHaveBeenCalled();
            expect(response.status).toBe(500);
        });

        it('parseQueryToFilterでValidationErrorが発生した場合、400エラーが返却されること', async () => {
            usecaseSetUp.placeUsecase.fetchPlaceEntityList.mockResolvedValue(
                mockPlaceEntityList,
            );

            // 不正なパラメータを設定
            const invalidSearchParams = new URLSearchParams({
                startDate: 'invalid-date',
                finishDate: '2024-06-30',
                raceType: RaceType.JRA,
            });

            const response =
                await controller.getPlaceEntityList(invalidSearchParams);

            expect(
                usecaseSetUp.placeUsecase.fetchPlaceEntityList,
            ).not.toHaveBeenCalled();
            expect(response.status).toBe(400);
        });
    });

    describe('postUpsertPlace', () => {
        const validRequestBody = {
            startDate: '2024-06-01',
            finishDate: '2024-06-30',
            raceType: [RaceType.JRA],
        };

        it('正常に開催場データが登録・更新され、レスポンスが返却されること', async () => {
            usecaseSetUp.placeUsecase.upsertPlaceEntityList.mockResolvedValue({
                successCount: 10,
                failureCount: 0,
                failures: [],
            });

            const mockRequest = new Request('http://localhost/api/race', {
                method: 'POST',
                body: JSON.stringify(validRequestBody),
                headers: { 'Content-Type': 'application/json' },
            });

            const response = await controller.postUpsertPlace(
                mockRequest,
                commonParameterMock(),
            );

            expect(
                usecaseSetUp.placeUsecase.upsertPlaceEntityList,
            ).toHaveBeenCalled();
            expect(response.status).toBe(200);
            const responseBody = await response.json();
            expect(responseBody.successCount).toBe(10);
            expect(responseBody.failureCount).toBe(0);
        });

        it('usecaseで例外が発生した場合、500エラーが返却されること', async () => {
            usecaseSetUp.placeUsecase.upsertPlaceEntityList.mockRejectedValue(
                new Error('Database error'),
            );

            const mockRequest = new Request('http://localhost/api/race', {
                method: 'POST',
                body: JSON.stringify(validRequestBody),
                headers: { 'Content-Type': 'application/json' },
            });

            const response = await controller.postUpsertPlace(
                mockRequest,
                commonParameterMock(),
            );

            expect(
                usecaseSetUp.placeUsecase.upsertPlaceEntityList,
            ).toHaveBeenCalled();
            expect(response.status).toBe(500);
        });

        it('parseQueryToFilterでValidationErrorが発生した場合、400エラーが返却されること', async () => {
            usecaseSetUp.raceUsecase.upsertRaceEntityList.mockResolvedValue({
                successCount: 10,
                failureCount: 0,
                failures: [],
            });

            // 不正なリクエストボディを設定
            const invalidRequestBody = {
                startDate: 'invalid-date',
                finishDate: '2024-06-30',
                raceType: [RaceType.JRA],
            };

            const mockRequest = new Request('http://localhost/api/race', {
                method: 'POST',
                body: JSON.stringify(invalidRequestBody),
                headers: { 'Content-Type': 'application/json' },
            });

            const response = await controller.postUpsertPlace(
                mockRequest,
                commonParameterMock(),
            );

            expect(
                usecaseSetUp.raceUsecase.upsertRaceEntityList,
            ).not.toHaveBeenCalled();
            expect(response.status).toBe(400);
        });
    });
});
