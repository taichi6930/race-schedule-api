import { EnvStore } from '@race-schedule/shared/src/utilities/envStore';

import type { IDBGateway } from '../interface/IDBGateway';

/**
 * D1データベースにアクセスするGateway
 */
export class DBGateway implements IDBGateway {
    /**
     * クエリを実行し、すべての行を返す
     * @param sql - SQL文字列
     * @param params - バインドパラメータ
     */
    public async queryAll(
        sql: string,
        params: any[],
    ): Promise<{ results: any[] }> {
        return EnvStore.env.DB.prepare(sql)
            .bind(...params)
            .all();
    }

    /**
     * 行を返さないステートメントを実行する
     * @param sql - SQL文字列
     * @param params - バインドパラメータ
     */
    public async run(sql: string, params: any[]): Promise<any> {
        return EnvStore.env.DB.prepare(sql)
            .bind(...params)
            .run();
    }
}
