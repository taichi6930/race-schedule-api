import { EnvStore } from '@race-schedule/shared/src/utilities/envStore';
import { Logger } from '@race-schedule/shared/src/utilities/logger';

import type {
    IDBGateway,
    QueryResult,
    SqlParameter,
} from '../interface/IDBGateway';

/**
 * D1データベースにアクセスするGateway
 */
export class DBGateway implements IDBGateway {
    /**
     * クエリを実行し、全ての行を返す
     * @param sql - SQL文字列
     * @param params - バインドパラメータ
     */
    @Logger
    public async queryAll(
        sql: string,
        params: SqlParameter[],
    ): Promise<{ results: unknown[] }> {
        return EnvStore.env.DB.prepare(sql)
            .bind(...params)
            .all();
    }

    /**
     * 行を返さないステートメントを実行する
     * @param sql - SQL文字列
     * @param params - バインドパラメータ
     */
    @Logger
    public async run(sql: string, params: SqlParameter[]): Promise<QueryResult> {
        return EnvStore.env.DB.prepare(sql)
            .bind(...params)
            .run();
    }
}
