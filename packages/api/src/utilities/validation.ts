import { RaceType } from '@race-schedule/shared/src/types/raceType';

/**
 * バリデーション結果の型定義
 */
export type ValidationResult<T> =
    | { success: true; value: T }
    | { success: false; error: Response };

/**
 * 必須パラメータの存在チェック
 */
export function validateRequiredParams(
    searchParams: URLSearchParams,
    requiredKeys: string[],
): ValidationResult<Record<string, string>> {
    const values: Record<string, string> = {};

    for (const key of requiredKeys) {
        const value = searchParams.get(key);
        if (!value) {
            return {
                success: false,
                error: Response.json(
                    { error: `${requiredKeys.join(', ')}は必須です` },
                    {
                        status: 400,
                        headers: { 'Content-Type': 'application/json' },
                    },
                ),
            };
        }
        values[key] = value;
    }

    return { success: true, value: values };
}

/**
 * raceTypeListの妥当性チェック
 */
export function validateRaceTypeList(
    raceTypeListRaw: string,
): ValidationResult<Array<(typeof RaceType)[keyof typeof RaceType]>> {
    const raceTypeList = raceTypeListRaw
        .split(',')
        .filter((v): v is (typeof RaceType)[keyof typeof RaceType] =>
            Object.values(RaceType).includes(v as any),
        );

    if (raceTypeList.length === 0) {
        return {
            success: false,
            error: Response.json(
                { error: 'raceTypeListに有効な値がありません' },
                {
                    status: 400,
                    headers: { 'Content-Type': 'application/json' },
                },
            ),
        };
    }

    return { success: true, value: raceTypeList };
}

/**
 * 日付範囲の妥当性チェック
 */
export function validateDateRange(
    startDateStr: string,
    finishDateStr: string,
): ValidationResult<{ startDate: Date; finishDate: Date }> {
    const startDate = new Date(startDateStr);
    const finishDate = new Date(finishDateStr);

    if (Number.isNaN(startDate.getTime()) || Number.isNaN(finishDate.getTime())) {
        return {
            success: false,
            error: Response.json(
                {
                    error: 'startDate, finishDateは有効な日付文字列で指定してください',
                },
                {
                    status: 400,
                    headers: { 'Content-Type': 'application/json' },
                },
            ),
        };
    }

    return { success: true, value: { startDate, finishDate } };
}

/**
 * locationListのパース（カンマ区切り → 配列）
 */
export function parseLocationList(locationListRaw: string | null): string[] | undefined {
    if (!locationListRaw) {
        return undefined;
    }

    const locationList = locationListRaw
        .split(',')
        .map((v) => v.trim())
        .filter((v) => v.length > 0);

    return locationList.length > 0 ? locationList : undefined;
}

/**
 * エラーレスポンスの生成
 */
export function createErrorResponse(message: string, status: number = 400): Response {
    return Response.json(
        { error: message },
        {
            status,
            headers: { 'Content-Type': 'application/json' },
        },
    );
}

/**
 * 内部サーバーエラーレスポンスの生成
 */
export function createInternalServerErrorResponse(): Response {
    return new Response('Internal Server Error', { status: 500 });
}
