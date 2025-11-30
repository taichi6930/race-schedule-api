/**
 * APIルーティングモジュール
 *
 * Cloudflare Workers上で動作するAPIのルーティングを管理します。
 * 各エンドポイントへのリクエストを適切なコントローラーに振り分けます。
 */

import { CalendarController } from './controller/calendarController';
import { PlaceController } from './controller/placeController';
import { PlayerController } from './controller/playerController';
import { RaceController } from './controller/raceController';
import { container } from './di';
import type { CloudFlareEnv } from './utility/cloudFlareEnv';
import { EnvStore } from './utility/envStore';

/**
 * CORSヘッダー設定
 */
const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
};

/**
 * CORSプリフライトリクエストに対するレスポンスを返す
 *
 * @returns CORSヘッダー付きの空レスポンス
 */
const responseCors = (): Response => {
    return new Response(null, { headers: corsHeaders });
};

/**
 * ヘルスチェックエンドポイントのレスポンスを返す
 *
 * @returns ヘルスチェック成功レスポンス
 */
const responseHealth = (): Response => {
    return new Response('ok health check', {
        status: 200,
        headers: corsHeaders,
    });
};

/**
 * 404 Not Foundレスポンスを返す
 *
 * @returns エンドポイントが見つからないエラーレスポンス
 */
const responseNotFound = (): Response => {
    return Response.json(
        { error: 'エンドポイントが見つかりません' },
        { status: 404, headers: corsHeaders },
    );
};

/**
 * 500 Internal Server Errorレスポンスを返す
 *
 * @param error - 発生したエラーオブジェクト
 * @returns サーバーエラーレスポンス
 */
const responseError = (error: any): Response => {
    console.error('Database error:', error);
    return Response.json(
        { error: 'サーバーエラーが発生しました', details: error.message },
        { status: 500, headers: corsHeaders },
    );
};

/**
 * プレイヤー関連のリクエストを処理する
 *
 * @param request - HTTPリクエスト
 * @param searchParams - URLクエリパラメータ
 * @returns HTTPレスポンス
 */
const handlePlayer = async (
    request: Request,
    searchParams: URLSearchParams,
): Promise<Response> => {
    const playerController = container.resolve(PlayerController);
    if (request.method === 'GET') {
        return playerController.getPlayerEntityList(searchParams);
    }
    if (request.method === 'POST') {
        return playerController.postUpsertPlayer(request);
    }
    return responseNotFound();
};

/**
 * レース関連のリクエストを処理する
 *
 * @param request - HTTPリクエスト
 * @param searchParams - URLクエリパラメータ
 * @returns HTTPレスポンス
 */
const handleRace = async (
    request: Request,
    searchParams: URLSearchParams,
): Promise<Response> => {
    const raceController = container.resolve(RaceController);
    if (request.method === 'GET') {
        return raceController.getRaceEntityList(searchParams);
    }
    if (request.method === 'POST') {
        return raceController.postUpsertRace(request);
    }
    return responseNotFound();
};

/**
 * カレンダー関連のリクエストを処理する
 *
 * @param request - HTTPリクエスト
 * @param searchParams - URLクエリパラメータ
 * @returns HTTPレスポンス
 */
const handleCalendar = async (
    request: Request,
    searchParams: URLSearchParams,
): Promise<Response> => {
    const calendarController = container.resolve(CalendarController);
    if (request.method === 'GET') {
        return calendarController.getCalendarEntityList(searchParams);
    }
    if (request.method === 'POST') {
        return calendarController.postUpsertCalendar(request);
    }
    return responseNotFound();
};

/**
 * 開催場所関連のリクエストを処理する
 *
 * @param request - HTTPリクエスト
 * @param searchParams - URLクエリパラメータ
 * @returns HTTPレスポンス
 */
const handlePlace = async (
    request: Request,
    searchParams: URLSearchParams,
): Promise<Response> => {
    const placeController = container.resolve(PlaceController);
    if (request.method === 'GET') {
        return placeController.getPlaceEntityList(searchParams);
    }
    if (request.method === 'POST') {
        return placeController.postUpsertPlace(request);
    }
    return responseNotFound();
};

/**
 * メインルーター関数
 *
 * すべてのHTTPリクエストを受け取り、適切なハンドラーに振り分けます
 *
 * @param request - HTTPリクエスト
 * @param env - Cloudflare環境変数
 * @returns HTTPレスポンス
 */
export async function router(
    request: Request,
    env: CloudFlareEnv,
): Promise<Response> {
    EnvStore.setEnv(env);

    const url = new URL(request.url);
    const { pathname, searchParams } = url;

    if (request.method === 'OPTIONS') return responseCors();
    try {
        if (pathname === '/health' && request.method === 'GET')
            return responseHealth();

        switch (pathname) {
            case '/player': {
                return await handlePlayer(request, searchParams);
            }
            case '/race': {
                return await handleRace(request, searchParams);
            }
            case '/calendar': {
                return await handleCalendar(request, searchParams);
            }
            case '/place': {
                return await handlePlace(request, searchParams);
            }
            default: {
                return responseNotFound();
            }
        }
    } catch (error: any) {
        return responseError(error);
    }
}
