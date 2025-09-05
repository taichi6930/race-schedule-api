import { PublicGamblingController } from './controller/publicGamblingController';

export interface Env {
    DB: D1Database;
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

        const controller = new PublicGamblingController();

        try {
            if (pathname === '/players' && request.method === 'GET') {
                return controller.getPlayerDataList(searchParams, env.DB);
            }

            //     // POST /players - 選手登録
            //     if (pathname === '/players' && request.method === 'POST') {
            //         const { race_type, player_no, player_name, priority } =
            //             (await request.json()) as PlayerRequest;

            //         // バリデーション
            //         if (
            //             !race_type ||
            //             !player_no ||
            //             !player_name ||
            //             priority === undefined
            //         ) {
            //             return Response.json(
            //                 {
            //                     error: 'レース種別、選手番号、選手名、優先度は必須です',
            //                 },
            //                 { status: 400, headers: corsHeaders },
            //             );
            //         }

            //         if (typeof priority !== 'number' || priority < 0) {
            //             return Response.json(
            //                 { error: '優先度は0以上の数値で指定してください' },
            //                 { status: 400, headers: corsHeaders },
            //             );
            //         }

            //         try {
            //             const result = await env.DB.prepare(
            //                 `
            //     INSERT INTO player (race_type, player_no, player_name, priority)
            //     VALUES (?, ?, ?, ?)
            //   `,
            //             )
            //                 .bind(race_type, player_no, player_name, priority)
            //                 .run();

            //             if (!result.success) {
            //                 return Response.json(
            //                     {
            //                         error: '選手の登録に失敗しました',
            //                         details: result,
            //                     },
            //                     { status: 500, headers: corsHeaders },
            //                 );
            //             }

            //             return Response.json(
            //                 {
            //                     message: '選手を登録しました',
            //                     player: {
            //                         race_type,
            //                         player_no,
            //                         player_name,
            //                         priority,
            //                     },
            //                 },
            //                 { status: 201, headers: corsHeaders },
            //             );
            //         } catch (error: any) {
            //             // 重複エラーをチェック
            //             if (error.message?.includes('UNIQUE constraint failed')) {
            //                 return Response.json(
            //                     {
            //                         error: '指定されたレース種別・選手番号の組み合わせは既に存在します',
            //                     },
            //                     { status: 409, headers: corsHeaders },
            //                 );
            //             }
            //             throw error;
            //         }
            //     }

            // ルートエンドポイント - API仕様表示
            if (pathname === '/' && request.method === 'GET') {
                return Response.json(
                    {
                        message: '選手管理システム API',
                        version: '1.0.0',
                        endpoints: {
                            'GET /players':
                                '選手一覧取得（?race_type, ?page, ?limit, ?order_by, ?order_dir）',
                            'POST /players': '選手登録',
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
