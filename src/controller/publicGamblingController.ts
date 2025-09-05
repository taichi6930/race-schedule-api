import 'reflect-metadata';

import { injectable } from 'tsyringe';

/**
 * 公営競技のレース情報コントローラー
 */
@injectable()
export class PublicGamblingController {
    /**
     * 選手データを取得する
     * @param req - リクエスト
     * @param res - レスポンス
     */
    public async getPlayerDataList(
        searchParams: URLSearchParams,
        db: D1Database,
    ): Promise<Response> {
        // CORS設定
        const corsHeaders = {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
        };

        const page = Number.parseInt(searchParams.get('page') ?? '1');
        const limit = Number.parseInt(searchParams.get('limit') ?? '20');
        const raceType = searchParams.get('race_type'); // レース種別フィルタ
        const orderBy = searchParams.get('order_by') ?? 'priority'; // ソート項目
        const orderDir = searchParams.get('order_dir') ?? 'ASC'; // ソート方向
        const offset = (page - 1) * limit;

        // WHERE句とパラメータを動的構築
        let whereClause = '';
        let countWhereClause = '';
        const queryParams: any[] = [];
        const countParams: any[] = [];

        if (raceType) {
            whereClause = 'WHERE race_type = ?';
            countWhereClause = 'WHERE race_type = ?';
            queryParams.push(raceType);
            countParams.push(raceType);
        }

        // ソート項目のバリデーション
        const allowedOrderBy = [
            'priority',
            'player_name',
            'race_type',
            'created_at',
        ];
        const validOrderBy = allowedOrderBy.includes(orderBy)
            ? orderBy
            : 'priority';
        const validOrderDir = ['ASC', 'DESC'].includes(orderDir.toUpperCase())
            ? orderDir.toUpperCase()
            : 'ASC';

        // メインクエリ
        queryParams.push(limit, offset);
        const { results } = await db
            .prepare(
                `
                    SELECT race_type, player_no, player_name, priority, created_at, updated_at
                    FROM player
                    ${whereClause}
                    ORDER BY ${validOrderBy} ${validOrderDir}, player_no ASC
                    LIMIT ? OFFSET ?
                    `,
            )
            .bind(...queryParams)
            .all();

        // 件数取得
        const { count } = (await db
            .prepare(
                `
                SELECT COUNT(*) as count FROM player ${countWhereClause}
        `,
            )
            .bind(...countParams)
            .first()) as { count: number };

        return Response.json(
            {
                players: results,
                pagination: {
                    page,
                    limit,
                    total: count,
                    totalPages: Math.ceil(count / limit),
                },
                filters: {
                    race_type: raceType,
                    order_by: validOrderBy,
                    order_dir: validOrderDir,
                },
            },
            { headers: corsHeaders },
        );
    }
}
