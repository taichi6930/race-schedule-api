import 'reflect-metadata';

import { injectable } from 'tsyringe';

/**
 * 公営競技のレース情報コントローラー
 */
@injectable()
export class PublicGamblingController {
    constructor(private usecase = new PlayerUseCase()) {}

    /**
     * 選手データを取得する
     * @param req - リクエスト
     * @param res - レスポンス
     */
    public async getPlayerDataList(
        searchParams: URLSearchParams,
        db: D1Database,
    ): Promise<Response> {
        const limit = Number.parseInt(searchParams.get('limit') ?? '10000');
        const raceType = searchParams.get('race_type'); // レース種別フィルタ

        // WHERE句とパラメータを動的構築
        let whereClause = '';
        const queryParams: any[] = [];

        if (raceType) {
            whereClause = 'WHERE race_type = ?';
            queryParams.push(raceType);
        }

        // メインクエリ
        queryParams.push(limit);

        const { count } = await this.usecase.getPlayerDataCount(
            searchParams,
            db,
        );

        // CORS設定
        const corsHeaders = {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
        };

        return Response.json(
            {
                // players: results,
                pagination: {
                    limit,
                    total: count,
                },
            },
            { headers: corsHeaders },
        );
    }
}

class PlayerUseCase {
    constructor(private service = new PlayerService()) {}

    public async getPlayerDataCount(
        searchParams: URLSearchParams,
        db: D1Database,
    ): Promise<{ count: number }> {
        const { count } = await this.service.getPlayerData(searchParams, db);
        return { count };
    }
}

class PlayerService {
    constructor(private repository = new PlayerRepository()) {}

    public async getPlayerData(
        searchParams: URLSearchParams,
        db: D1Database,
    ): Promise<{ count: number; results: any[] }> {
        const count = await this.repository.getPlayerDataCount(
            searchParams,
            db,
        );
        const results = await this.repository.getPlayerDataList(
            searchParams,
            db,
        );
        return { count, results };
    }
}

class PlayerRepository {
    public async getPlayerDataList(
        searchParams: URLSearchParams,
        db: D1Database,
    ): Promise<any[]> {
        const raceType = searchParams.get('race_type'); // レース種別フィルタ
        // WHERE句とパラメータを動的構築
        let whereClause = '';
        const queryParams: any[] = [];

        const orderBy = searchParams.get('order_by') ?? 'priority'; // ソート項目
        const orderDir = searchParams.get('order_dir') ?? 'ASC'; // ソート方向

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

        if (raceType) {
            whereClause = 'WHERE race_type = ?';
            queryParams.push(raceType);
        }

        // 件数取得
        const { results } = await db
            .prepare(
                `
                    SELECT race_type, player_no, player_name, priority, created_at, updated_at
                    FROM player
                    ${whereClause}
                    ORDER BY ${validOrderBy} ${validOrderDir}, player_no ASC
                    LIMIT ?
                    `,
            )
            .bind(...queryParams)
            .all();

        return results;
    }

    public async getPlayerDataCount(
        searchParams: URLSearchParams,
        db: D1Database,
    ): Promise<number> {
        const raceType = searchParams.get('race_type'); // レース種別フィルタ
        // WHERE句とパラメータを動的構築
        let countWhereClause = '';
        const countParams: any[] = [];

        if (raceType) {
            countWhereClause = 'WHERE race_type = ?';
            countParams.push(raceType);
        }

        // 件数取得
        const { count } = (await db
            .prepare(
                `
                SELECT COUNT(*) as count FROM player ${countWhereClause}
        `,
            )
            .bind(...countParams)
            .first()) as { count: number };

        return count;
    }
}
