import { injectable } from 'tsyringe';

import { EnvStore } from '../../utility/envStore';
import { Logger } from '../../utility/logger';
import type { IDBGateway } from '../interface/iDbGateway';

/**
 * D1データベースにアクセスするGateway
 */
@injectable()
export class DBGateway implements IDBGateway {
    /**
     * クエリを実行して全ての行を返します。
     * @param sql - SQL文字列
     * @param params - バインドパラメータ
     */
    @Logger
    public async queryAll(
        sql: string,
        params: any[],
    ): Promise<{ results: any[] }> {
        return EnvStore.env.DB.prepare(sql)
            .bind(...params)
            .all();
    }

    /**
     * 行を返さないステートメントを実行します。
     * @param sql - SQL文字列
     * @param params - バインドパラメータ
     */
    @Logger
    public async run(sql: string, params: any[]): Promise<any> {
        return EnvStore.env.DB.prepare(sql)
            .bind(...params)
            .run();
    }
}
