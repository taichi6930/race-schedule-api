interface Env {
    DB: D1Database;
}

interface Player {
    race_type: string;
    player_no: string;
    player_name: string;
    priority: number;
    created_at: string;
    updated_at: string;
}

interface PlayerRequest {
    race_type: string;
    player_no: string;
    player_name: string;
    priority: number;
}

export default {
    async fetch(request: Request, env: Env): Promise<Response> {
        const url = new URL(request.url);
        const { pathname, searchParams } = url;

        // CORS設定
        const corsHeaders = {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
        };

        if (request.method === 'OPTIONS') {
            return new Response(null, { headers: corsHeaders });
        }

        try {
            if (pathname === '/player' && request.method === 'GET') {
                return Response.json(
                    { message: '選手一覧取得API' },
                    { headers: corsHeaders },
                );
            }

            // GET /players - 選手一覧取得（フィルタリング対応）
            if (pathname === '/players' && request.method === 'GET') {
                const page = parseInt(searchParams.get('page') || '1');
                const limit = parseInt(searchParams.get('limit') || '20');
                const raceType = searchParams.get('race_type'); // レース種別フィルタ
                const orderBy = searchParams.get('order_by') || 'priority'; // ソート項目
                const orderDir = searchParams.get('order_dir') || 'ASC'; // ソート方向
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
                const validOrderDir = ['ASC', 'DESC'].includes(
                    orderDir.toUpperCase(),
                )
                    ? orderDir.toUpperCase()
                    : 'ASC';

                // メインクエリ
                queryParams.push(limit, offset);
                const { results } = await env.DB.prepare(
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
                const { count } = (await env.DB.prepare(
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

            // // GET /players/:race_type/:player_no - 特定選手取得
            // if (pathname.match(/^\/players\/[^\/]+\/[^\/]+$/) && request.method === 'GET') {
            //   const pathParts = pathname.split('/');
            //   const raceType = decodeURIComponent(pathParts[2]);
            //   const playerNo = decodeURIComponent(pathParts[3]);

            //   const player = await env.DB.prepare(`
            //     SELECT * FROM player WHERE race_type = ? AND player_no = ?
            //   `).bind(raceType, playerNo).first();

            //   if (!player) {
            //     return Response.json(
            //       { error: '指定された選手が見つかりません', race_type: raceType, player_no: playerNo },
            //       { status: 404, headers: corsHeaders }
            //     );
            //   }

            //   return Response.json({ player }, { headers: corsHeaders });
            // }

            // // GET /players/search - 選手名検索
            // if (pathname === '/players/search' && request.method === 'GET') {
            //   const query = searchParams.get('q');
            //   const raceType = searchParams.get('race_type');

            //   if (!query || query.length < 2) {
            //     return Response.json(
            //       { error: '検索クエリは2文字以上で入力してください' },
            //       { status: 400, headers: corsHeaders }
            //     );
            //   }

            //   let whereClause = 'WHERE player_name LIKE ?';
            //   const params = [`%${query}%`];

            //   if (raceType) {
            //     whereClause += ' AND race_type = ?';
            //     params.push(raceType);
            //   }

            //   const { results } = await env.DB.prepare(`
            //     SELECT race_type, player_no, player_name, priority, created_at, updated_at
            //     FROM player
            //     ${whereClause}
            //     ORDER BY priority ASC, player_name ASC
            //     LIMIT 50
            //   `).bind(...params).all();

            //   return Response.json({
            //     players: results,
            //     query,
            //     race_type: raceType,
            //     count: results.length
            //   }, { headers: corsHeaders });
            // }

            // // GET /race-types - レース種別一覧
            // if (pathname === '/race-types' && request.method === 'GET') {
            //   const { results } = await env.DB.prepare(`
            //     SELECT race_type, COUNT(*) as player_count,
            //     MIN(priority) as min_priority, MAX(priority) as max_priority
            //     FROM player
            //     GROUP BY race_type
            //     ORDER BY race_type
            //   `).all();

            //   return Response.json({ race_types: results }, { headers: corsHeaders });
            // }

            // POST /players - 選手登録
            if (pathname === '/players' && request.method === 'POST') {
                const { race_type, player_no, player_name, priority } =
                    (await request.json()) as PlayerRequest;

                // バリデーション
                if (
                    !race_type ||
                    !player_no ||
                    !player_name ||
                    priority === undefined
                ) {
                    return Response.json(
                        {
                            error: 'レース種別、選手番号、選手名、優先度は必須です',
                        },
                        { status: 400, headers: corsHeaders },
                    );
                }

                if (typeof priority !== 'number' || priority < 0) {
                    return Response.json(
                        { error: '優先度は0以上の数値で指定してください' },
                        { status: 400, headers: corsHeaders },
                    );
                }

                try {
                    const result = await env.DB.prepare(
                        `
            INSERT INTO player (race_type, player_no, player_name, priority)
            VALUES (?, ?, ?, ?)
          `,
                    )
                        .bind(race_type, player_no, player_name, priority)
                        .run();

                    if (!result.success) {
                        return Response.json(
                            {
                                error: '選手の登録に失敗しました',
                                details: result,
                            },
                            { status: 500, headers: corsHeaders },
                        );
                    }

                    return Response.json(
                        {
                            message: '選手を登録しました',
                            player: {
                                race_type,
                                player_no,
                                player_name,
                                priority,
                            },
                        },
                        { status: 201, headers: corsHeaders },
                    );
                } catch (error: any) {
                    // 重複エラーをチェック
                    if (error.message?.includes('UNIQUE constraint failed')) {
                        return Response.json(
                            {
                                error: '指定されたレース種別・選手番号の組み合わせは既に存在します',
                            },
                            { status: 409, headers: corsHeaders },
                        );
                    }
                    throw error;
                }
            }

            // // PUT /players/:race_type/:player_no - 選手情報更新
            // if (pathname.match(/^\/players\/[^\/]+\/[^\/]+$/) && request.method === 'PUT') {
            //   const pathParts = pathname.split('/');
            //   const raceType = decodeURIComponent(pathParts[2]);
            //   const playerNo = decodeURIComponent(pathParts[3]);
            //   const { player_name, priority } = await request.json() as Partial<PlayerRequest>;

            //   // バリデーション
            //   if (!player_name || priority === undefined) {
            //     return Response.json(
            //       { error: '選手名と優先度は必須です' },
            //       { status: 400, headers: corsHeaders }
            //     );
            //   }

            //   if (typeof priority !== 'number' || priority < 0) {
            //     return Response.json(
            //       { error: '優先度は0以上の数値で指定してください' },
            //       { status: 400, headers: corsHeaders }
            //     );
            //   }

            //   // updated_atはトリガーで自動更新されるため手動設定不要
            //   const result = await env.DB.prepare(`
            //     UPDATE player
            //     SET player_name = ?, priority = ?
            //     WHERE race_type = ? AND player_no = ?
            //   `).bind(player_name, priority, raceType, playerNo).run();

            //   if (result.meta.changes === 0) {
            //     return Response.json(
            //       { error: '指定された選手が見つかりません' },
            //       { status: 404, headers: corsHeaders }
            //     );
            //   }

            //   return Response.json({
            //     message: '選手情報を更新しました',
            //     updated: { race_type: raceType, player_no: playerNo, player_name, priority }
            //   }, { headers: corsHeaders });
            // }

            // // DELETE /players/:race_type/:player_no - 選手削除
            // if (pathname.match(/^\/players\/[^\/]+\/[^\/]+$/) && request.method === 'DELETE') {
            //   const pathParts = pathname.split('/');
            //   const raceType = decodeURIComponent(pathParts[2]);
            //   const playerNo = decodeURIComponent(pathParts[3]);

            //   const result = await env.DB.prepare(`
            //     DELETE FROM player WHERE race_type = ? AND player_no = ?
            //   `).bind(raceType, playerNo).run();

            //   if (result.meta.changes === 0) {
            //     return Response.json(
            //       { error: '指定された選手が見つかりません' },
            //       { status: 404, headers: corsHeaders }
            //     );
            //   }

            //   return Response.json({
            //     message: '選手を削除しました',
            //     deleted: { race_type: raceType, player_no: playerNo }
            //   }, { headers: corsHeaders });
            // }

            // // POST /players/batch - 選手一括登録
            // if (pathname === '/players/batch' && request.method === 'POST') {
            //   const { players } = await request.json() as { players: PlayerRequest[] };

            //   if (!Array.isArray(players) || players.length === 0) {
            //     return Response.json(
            //       { error: '選手データの配列を指定してください' },
            //       { status: 400, headers: corsHeaders }
            //     );
            //   }

            //   // バリデーション
            //   for (const [index, player] of players.entries()) {
            //     if (!player.race_type || !player.player_no || !player.player_name || player.priority === undefined) {
            //       return Response.json(
            //         { error: `${index + 1}件目: レース種別、選手番号、選手名、優先度は必須です` },
            //         { status: 400, headers: corsHeaders }
            //       );
            //     }
            //   }

            //   try {
            //     // トランザクション的な処理（D1のbatch機能を使用）
            //     const statements = players.map(player =>
            //       env.DB.prepare(`
            //         INSERT INTO player (race_type, player_no, player_name, priority)
            //         VALUES (?, ?, ?, ?)
            //       `).bind(player.race_type, player.player_no, player.player_name, player.priority)
            //     );

            //     const results = await env.DB.batch(statements);

            //     const successful = results.filter(r => r.success).length;
            //     const failed = results.filter(r => !r.success).length;

            //     return Response.json({
            //       message: `一括登録完了: 成功${successful}件、失敗${failed}件`,
            //       successful,
            //       failed,
            //       total: players.length
            //     }, { status: 201, headers: corsHeaders });

            //   } catch (error: any) {
            //     return Response.json(
            //       { error: '一括登録に失敗しました', details: error.message },
            //       { status: 500, headers: corsHeaders }
            //     );
            //   }
            // }

            // ルートエンドポイント - API仕様表示
            if (pathname === '/' && request.method === 'GET') {
                return Response.json(
                    {
                        message: '選手管理システム API',
                        version: '1.0.0',
                        endpoints: {
                            'GET /players':
                                '選手一覧取得（?race_type, ?page, ?limit, ?order_by, ?order_dir）',
                            // 'GET /players/:race_type/:player_no': '特定選手取得',
                            // 'GET /players/search': '選手名検索（?q, ?race_type）',
                            // 'GET /race-types': 'レース種別一覧と統計',
                            'POST /players': '選手登録',
                            // 'PUT /players/:race_type/:player_no': '選手情報更新',
                            // 'DELETE /players/:race_type/:player_no': '選手削除',
                            // 'POST /players/batch': '選手一括登録'
                        },
                        race_types_examples: ['KEIRIN', 'AUTORACE', 'BOATRACE'],
                        priority_info:
                            '数値が大きいほど優先度高（0が最高優先度）',
                    },
                    { headers: corsHeaders },
                );
            }

            // 404 Not Found
            return Response.json(
                { error: 'エンドポイントが見つかりません' },
                { status: 404, headers: corsHeaders },
            );
        } catch (error: any) {
            console.error('Database error:', error);
            return Response.json(
                {
                    error: 'サーバーエラーが発生しました',
                    details: error.message,
                    timestamp: new Date().toISOString(),
                },
                { status: 500, headers: corsHeaders },
            );
        }
    },
};
