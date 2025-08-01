/* eslint-disable @typescript-eslint/no-unnecessary-type-parameters */

import { injectable } from 'tsyringe';

import { Logger } from '../../utility/logger';
import type { ISQLiteGateway } from '../interface/ISQLiteGateway';

@injectable()
export class MockSQLiteGateway implements ISQLiteGateway {
    public constructor(dbPath: string) {
        console.log(`MockSQLiteGateway: Opening database at ${dbPath}`);
    }

    /**
     * トランザクションラップメソッド
     * @param fn - トランザクション内で実行する関数
     */
    @Logger
    public transaction<T>(fn: () => T): T {
        console.log(fn);
        throw new Error('MockSQLiteGateway does not support transactions');
    }

    @Logger
    public run(query: string, params: unknown[] = []): void {
        console.log(query, params);
        throw new Error('MockSQLiteGateway does not support run operation');
    }

    @Logger
    public get<T>(query: string, params: unknown[] = []): T | undefined {
        console.log(query, params);
        throw new Error('MockSQLiteGateway does not support get operation');
    }

    @Logger
    public all<T>(query: string, params: unknown[] = []): T[] {
        try {
            console.log(query, params);
            const rows = [
                {
                    id: 1,
                    race_type: 'KEIRIN',
                    player_no: '014396',
                    player_name: '脇本雄太',
                    priority: 6,
                    created_at: '2025-08-01 01:37:54',
                    updated_at: '2025-08-01 01:37:54',
                },
                {
                    id: 2,
                    race_type: 'KEIRIN',
                    player_no: '014838',
                    player_name: '古性優作',
                    priority: 6,
                    created_at: '2025-08-01 01:37:54',
                    updated_at: '2025-08-01 01:37:54',
                },
                {
                    id: 3,
                    race_type: 'KEIRIN',
                    player_no: '014681',
                    player_name: '松浦悠士',
                    priority: 6,
                    created_at: '2025-08-01 01:37:54',
                    updated_at: '2025-08-01 01:37:54',
                },
                {
                    id: 4,
                    race_type: 'KEIRIN',
                    player_no: '013162',
                    player_name: '佐藤慎太郎',
                    priority: 6,
                    created_at: '2025-08-01 01:37:54',
                    updated_at: '2025-08-01 01:37:54',
                },
                {
                    id: 5,
                    race_type: 'KEIRIN',
                    player_no: '014534',
                    player_name: '深谷知広',
                    priority: 6,
                    created_at: '2025-08-01 01:37:54',
                    updated_at: '2025-08-01 01:37:54',
                },
                {
                    id: 6,
                    race_type: 'KEIRIN',
                    player_no: '015242',
                    player_name: '眞杉匠',
                    priority: 5,
                    created_at: '2025-08-01 01:37:54',
                    updated_at: '2025-08-01 01:37:54',
                },
                {
                    id: 7,
                    race_type: 'KEIRIN',
                    player_no: '015009',
                    player_name: '清水裕友',
                    priority: 6,
                    created_at: '2025-08-01 01:37:54',
                    updated_at: '2025-08-01 01:37:54',
                },
                {
                    id: 8,
                    race_type: 'KEIRIN',
                    player_no: '014741',
                    player_name: '郡司浩平',
                    priority: 6,
                    created_at: '2025-08-01 01:37:54',
                    updated_at: '2025-08-01 01:37:54',
                },
                {
                    id: 9,
                    race_type: 'KEIRIN',
                    player_no: '015413',
                    player_name: '寺崎浩平',
                    priority: 3,
                    created_at: '2025-08-01 01:37:54',
                    updated_at: '2025-08-01 01:37:54',
                },
                {
                    id: 10,
                    race_type: 'KEIRIN',
                    player_no: '014054',
                    player_name: '新田祐大',
                    priority: 3,
                    created_at: '2025-08-01 01:37:54',
                    updated_at: '2025-08-01 01:37:54',
                },
                {
                    id: 11,
                    race_type: 'KEIRIN',
                    player_no: '015034',
                    player_name: '新山響平',
                    priority: 5,
                    created_at: '2025-08-01 01:37:54',
                    updated_at: '2025-08-01 01:37:54',
                },
                {
                    id: 12,
                    race_type: 'KEIRIN',
                    player_no: '015451',
                    player_name: '山口拳矢',
                    priority: 2,
                    created_at: '2025-08-01 01:37:54',
                    updated_at: '2025-08-01 01:37:54',
                },
                {
                    id: 13,
                    race_type: 'KEIRIN',
                    player_no: '015527',
                    player_name: '北井佑季',
                    priority: 4,
                    created_at: '2025-08-01 01:37:54',
                    updated_at: '2025-08-01 01:37:54',
                },
                {
                    id: 14,
                    race_type: 'KEIRIN',
                    player_no: '015597',
                    player_name: '太田海也',
                    priority: 4,
                    created_at: '2025-08-01 01:37:54',
                    updated_at: '2025-08-01 01:37:54',
                },
                {
                    id: 15,
                    race_type: 'KEIRIN',
                    player_no: '015553',
                    player_name: '犬伏湧也',
                    priority: 4,
                    created_at: '2025-08-01 01:37:54',
                    updated_at: '2025-08-01 01:37:54',
                },
                {
                    id: 16,
                    race_type: 'KEIRIN',
                    player_no: '015298',
                    player_name: '嘉永泰斗',
                    priority: 4,
                    created_at: '2025-08-01 01:37:54',
                    updated_at: '2025-08-01 01:37:54',
                },
                {
                    id: 17,
                    race_type: 'KEIRIN',
                    player_no: '015400',
                    player_name: '久米詩',
                    priority: 4,
                    created_at: '2025-08-01 01:37:54',
                    updated_at: '2025-08-01 01:37:54',
                },
                {
                    id: 18,
                    race_type: 'KEIRIN',
                    player_no: '015306',
                    player_name: '佐藤水菜',
                    priority: 4,
                    created_at: '2025-08-01 01:37:54',
                    updated_at: '2025-08-01 01:37:54',
                },
                {
                    id: 19,
                    race_type: 'KEIRIN',
                    player_no: '015219',
                    player_name: '梅川風子',
                    priority: 3,
                    created_at: '2025-08-01 01:37:54',
                    updated_at: '2025-08-01 01:37:54',
                },
                {
                    id: 20,
                    race_type: 'KEIRIN',
                    player_no: '015080',
                    player_name: '児玉碧衣',
                    priority: 4,
                    created_at: '2025-08-01 01:37:54',
                    updated_at: '2025-08-01 01:37:54',
                },
                {
                    id: 21,
                    race_type: 'KEIRIN',
                    player_no: '015587',
                    player_name: '吉川美穂',
                    priority: 3,
                    created_at: '2025-08-01 01:37:54',
                    updated_at: '2025-08-01 01:37:54',
                },
                {
                    id: 22,
                    race_type: 'KEIRIN',
                    player_no: '015218',
                    player_name: '太田りゆ',
                    priority: 3,
                    created_at: '2025-08-01 01:37:54',
                    updated_at: '2025-08-01 01:37:54',
                },
                {
                    id: 23,
                    race_type: 'KEIRIN',
                    player_no: '015679',
                    player_name: '又多風緑',
                    priority: 3,
                    created_at: '2025-08-01 01:37:54',
                    updated_at: '2025-08-01 01:37:54',
                },
                {
                    id: 24,
                    race_type: 'KEIRIN',
                    player_no: '015669',
                    player_name: '河内桜雪',
                    priority: 3,
                    created_at: '2025-08-01 01:37:54',
                    updated_at: '2025-08-01 01:37:54',
                },
                {
                    id: 25,
                    race_type: 'KEIRIN',
                    player_no: '999999',
                    player_name: 'test',
                    priority: 3,
                    created_at: '2025-08-01 01:37:54',
                    updated_at: '2025-08-01 01:37:54',
                },
                {
                    id: 26,
                    race_type: 'BOATRACE',
                    player_no: '4320',
                    player_name: '峰竜太',
                    priority: 6,
                    created_at: '2025-08-01 01:37:54',
                    updated_at: '2025-08-01 01:37:54',
                },
                {
                    id: 27,
                    race_type: 'BOATRACE',
                    player_no: '999999',
                    player_name: 'test',
                    priority: 3,
                    created_at: '2025-08-01 01:37:54',
                    updated_at: '2025-08-01 01:37:54',
                },
                {
                    id: 28,
                    race_type: 'AUTORACE',
                    player_no: '5954',
                    player_name: '青山周平',
                    priority: 6,
                    created_at: '2025-08-01 01:37:54',
                    updated_at: '2025-08-01 01:37:54',
                },
                {
                    id: 29,
                    race_type: 'AUTORACE',
                    player_no: '999999',
                    player_name: 'test',
                    priority: 3,
                    created_at: '2025-08-01 01:37:54',
                    updated_at: '2025-08-01 01:37:54',
                },
            ];
            // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
            return Array.isArray(rows) ? (rows as T[]) : [];
        } catch (error) {
            throw error instanceof Error ? error : new Error(String(error));
        }
    }
}
