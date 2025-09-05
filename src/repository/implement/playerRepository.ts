import { CommonParameter } from '../..';
import { IPlayerRepository } from '../interface/IPlayerRepository';

export class PlayerRepository implements IPlayerRepository {
    public async getPlayerDataList(commonParameter: CommonParameter): Promise<
        {
            race_type: string;
            player_no: string;
            player_name: string;
            priority: number;
            created_at: string;
            updated_at: string;
        }[]
    > {
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

        // resultsはany型なのでキャストする
        return results as {
            race_type: string;
            player_no: string;
            player_name: string;
            priority: number;
            created_at: string;
            updated_at: string;
        }[];
    }
}
