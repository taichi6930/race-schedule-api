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
                    id: 112,
                    race_type: 'KEIRIN',
                    player_no: '999999',
                    player_name: 'test',
                    priority: 3,
                    created_at: '2025-08-01 01:37:54',
                    updated_at: '2025-08-01 01:37:54',
                },
                {
                    id: 114,
                    race_type: 'BOATRACE',
                    player_no: '999999',
                    player_name: 'test',
                    priority: 3,
                    created_at: '2025-08-01 01:37:54',
                    updated_at: '2025-08-01 01:37:54',
                },
                {
                    id: 116,
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
