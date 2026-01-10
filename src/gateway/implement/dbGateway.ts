import { injectable } from 'tsyringe';

import { Logger } from '../../../packages/shared/src/utilities/logger';
import { OldEnvStore as EnvStore } from '../../utility/oldEnvStore';
import type { IDBGateway } from '../interface/iDbGateway';

/**
 * D1データベースにアクセスするGateway
 */
@injectable()
export class DBGateway implements IDBGateway {
    /**
     * クエリを実行し、すべての行を返す
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
     * 行を返さないステートメントを実行する
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
