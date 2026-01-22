type HeaderRecord = Record<string, string>;

const BASE_CORS_HEADERS: HeaderRecord = Object.freeze({
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
});

const normalizeHeaders = (headers?: HeadersInit): HeaderRecord => {
    if (!headers) {
        return {};
    }
    if (typeof Headers !== 'undefined' && headers instanceof Headers) {
        const record: HeaderRecord = {};
        // eslint-disable-next-line unicorn/no-array-for-each -- Headers.forEach is the most reliable API in the Workers runtime
        headers.forEach((value, key) => {
            record[key] = value;
        });
        return record;
    }
    if (Array.isArray(headers)) {
        return headers.reduce<HeaderRecord>((acc, [key, value]) => {
            acc[key] = value;
            return acc;
        }, {});
    }
    return Object.fromEntries(
        Object.entries(headers).map(([key, value]) => [key, `${value}`]),
    );
};

export const corsHeaders = (): HeaderRecord => ({ ...BASE_CORS_HEADERS });

export const withCorsHeaders = (headers?: HeadersInit): HeaderRecord => ({
    ...BASE_CORS_HEADERS,
    ...normalizeHeaders(headers),
});

export const createCorsResponse = (
    body: BodyInit | null,
    init?: ResponseInit,
): Response => {
    const { headers, ...rest } = init ?? {};
    return new Response(body, {
        ...rest,
        headers: withCorsHeaders(headers),
    });
};
