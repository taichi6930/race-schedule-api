import 'reflect-metadata';
import { CommonParameter } from './../index';

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
        commonParameter: CommonParameter,
    ): Promise<Response> {
        const { results } =
            await this.usecase.getPlayerDataCount(commonParameter);

        // CORS設定
        const corsHeaders = {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
        };

        return Response.json(
            {
                players: results,
                total: results.length,
            },
            { headers: corsHeaders },
        );
    }
}

class PlayerUseCase {
    constructor(private service = new PlayerService()) {}

    public async getPlayerDataCount(
        commonParameter: CommonParameter,
    ): Promise<{ results: any[] }> {
        return await this.service.getPlayerData(commonParameter);
    }
}

class PlayerService {
    constructor(private repository = new PlayerRepository()) {}

    public async getPlayerData(
        commonParameter: CommonParameter,
    ): Promise<{ results: any[] }> {
        const results =
            await this.repository.getPlayerDataList(commonParameter);
        return { results };
    }
}

class PlayerRepository {
    public async getPlayerDataList(
        commonParameter: CommonParameter,
    ): Promise<any[]> {
        const raceType = commonParameter.searchParams.get('race_type'); // レース種別フィルタ
        // WHERE句とパラメータを動的構築
        let whereClause = '';
        const queryParams: any[] = [];

        const orderBy =
            commonParameter.searchParams.get('order_by') ?? 'priority'; // ソート項目
        const orderDir = commonParameter.searchParams.get('order_dir') ?? 'ASC'; // ソート方向

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
        // LIMITは必ず渡す
        queryParams.push(
            Number.parseInt(
                commonParameter.searchParams.get('limit') ?? '10000',
            ),
        );

        const { results } = await commonParameter.env.DB.prepare(
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
}
