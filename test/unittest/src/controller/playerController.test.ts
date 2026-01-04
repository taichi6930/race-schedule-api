import 'reflect-metadata';

import { container } from 'tsyringe';

import { RaceType } from '../../../../packages/shared/src/types/raceType';
import { PlayerController } from '../../../../src/controller/playerController';
import type { TestUsecaseSetup } from '../../../utility/testSetupHelper';
import {
    clearMocks,
    setupTestUsecaseMock,
} from '../../../utility/testSetupHelper';
import { mockPlayerEntityList } from '../mock/common/baseCommonData';

/*
ディシジョンテーブル: getPlayerEntityList

| No. | searchParams | parseRaceTypeListFromSearch | usecase.fetchPlayerEntityList | 期待レスポンス内容         | ステータス |
|-----|--------------|-----------------------------|------------------------------|----------------------------|----------|
| 1   | 正常         | 成功                        | 成功                         | players配列返却            | 200      |
| 2   | 正常         | 成功                        | 例外                         | Internal Server Error      | 500      |
| 3   | 不正         | ValidationError             | -                             | Bad Request: メッセージ    | 400      |

ディシジョンテーブル: postUpsertPlayer

| No. | request.body | parsePlayerUpsertPayload | usecase.upsertPlayerEntityList | 期待レスポンス内容         | ステータス |
|-----|--------------|--------------------------|--------------------------------|----------------------------|----------|
| 1   | 正常         | 成功                     | 成功                           | players返却                | 201      |
| 2   | 正常(配列)   | 成功                     | 成功                           | players返却                | 201      |
| 3   | 不正         | ValidationError          | -                              | Bad Request: メッセージ    | 400      |
| 4   | 正常         | 成功                     | PlayerEntity.createで例外       | Bad Request: メッセージ    | 400      |
| 5   | 正常         | 成功                     | 例外                           | Internal Server Error      | 500      |
*/

describe('PlayerControllerのテスト', () => {
    let controller: PlayerController;
    let usecaseSetUp: TestUsecaseSetup;

    beforeEach(() => {
        usecaseSetUp = setupTestUsecaseMock();
        controller = container.resolve(PlayerController);
    });

    afterEach(() => {
        clearMocks();
    });

    describe('getPlayerEntityList', () => {
        it('正常に選手データが取得でき、レスポンスが返却されること', async () => {
            usecaseSetUp.playerUsecase.fetchPlayerEntityList.mockResolvedValue(
                mockPlayerEntityList,
            );

            const searchParams = new URLSearchParams({
                raceType: RaceType.JRA,
            });

            const response = await controller.getPlayerEntityList(searchParams);

            expect(
                usecaseSetUp.playerUsecase.fetchPlayerEntityList,
            ).toHaveBeenCalled();
            expect(response.status).toBe(200);
            const responseBody = await response.json();
            expect(responseBody.count).toEqual(mockPlayerEntityList.length);
        });

        it('usecaseで例外が発生した場合、500エラーが返却されること', async () => {
            usecaseSetUp.playerUsecase.fetchPlayerEntityList.mockRejectedValue(
                new Error('Database error'),
            );

            const searchParams = new URLSearchParams({
                raceType: RaceType.JRA,
            });

            const response = await controller.getPlayerEntityList(searchParams);

            expect(
                usecaseSetUp.playerUsecase.fetchPlayerEntityList,
            ).toHaveBeenCalled();
            expect(response.status).toBe(500);
        });

        it('raceTypeが不正な場合、400エラーが返却されること', async () => {
            const invalidParams = new URLSearchParams();

            const response =
                await controller.getPlayerEntityList(invalidParams);

            expect(
                usecaseSetUp.playerUsecase.fetchPlayerEntityList,
            ).not.toHaveBeenCalled();
            expect(response.status).toBe(400);
        });
    });

    describe('postUpsertPlayer', () => {
        const validRequestBody = {
            race_type: RaceType.JRA,
            player_no: '1',
            player_name: 'テスト選手',
            priority: 1,
        };

        const createRequest = (body: unknown): Request =>
            new Request('http://localhost/api/player', {
                method: 'POST',
                body: JSON.stringify(body),
                headers: { 'Content-Type': 'application/json' },
            });

        it('単一の選手データが正常に登録・更新されること', async () => {
            usecaseSetUp.playerUsecase.upsertPlayerEntityList.mockResolvedValue(
                undefined,
            );

            const response = await controller.postUpsertPlayer(
                createRequest(validRequestBody),
            );

            expect(
                usecaseSetUp.playerUsecase.upsertPlayerEntityList,
            ).toHaveBeenCalledTimes(1);
            const [[playerEntities]] =
                usecaseSetUp.playerUsecase.upsertPlayerEntityList.mock.calls;
            expect(playerEntities).toHaveLength(1);
            expect(response.status).toBe(201);
            const responseBody = await response.json();
            expect(responseBody.playerEntities).toHaveLength(1);
            expect(responseBody.message).toBe('選手を登録/更新しました');
        });

        it('複数の選手データが配列で渡された場合でも処理できること', async () => {
            const requestBody = [
                validRequestBody,
                {
                    ...validRequestBody,
                    player_no: '2',
                    player_name: '別選手',
                },
            ];

            const response = await controller.postUpsertPlayer(
                createRequest(requestBody),
            );

            const [[playerEntities]] =
                usecaseSetUp.playerUsecase.upsertPlayerEntityList.mock.calls;
            expect(playerEntities).toHaveLength(2);
            expect(response.status).toBe(201);
        });

        it('リクエストボディが不正な場合、400エラーが返却されること', async () => {
            const invalidBody = { ...validRequestBody, player_name: '' };

            const response = await controller.postUpsertPlayer(
                createRequest(invalidBody),
            );

            expect(
                usecaseSetUp.playerUsecase.upsertPlayerEntityList,
            ).not.toHaveBeenCalled();
            expect(response.status).toBe(400);
        });

        it('PlayerEntity.createで例外が発生した場合、400エラーが返却されること', async () => {
            const invalidRaceTypeBody = {
                ...validRequestBody,
                race_type: 'INVALID',
            };

            const response = await controller.postUpsertPlayer(
                createRequest(invalidRaceTypeBody),
            );

            expect(
                usecaseSetUp.playerUsecase.upsertPlayerEntityList,
            ).not.toHaveBeenCalled();
            expect(response.status).toBe(400);
        });

        it('usecaseで例外が発生した場合、500エラーが返却されること', async () => {
            usecaseSetUp.playerUsecase.upsertPlayerEntityList.mockRejectedValue(
                new Error('Database error'),
            );

            const response = await controller.postUpsertPlayer(
                createRequest(validRequestBody),
            );

            expect(
                usecaseSetUp.playerUsecase.upsertPlayerEntityList,
            ).toHaveBeenCalled();
            expect(response.status).toBe(500);
        });
    });
});
