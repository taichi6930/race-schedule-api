import { injectable } from 'tsyringe';

import type { CloudFlareEnv } from '../../utility/commonParameter';
import { Logger } from '../../utility/logger';
import type { IDBGateway } from '../interface/iDbGateway';

/**
 * D1データベースにアクセスするGateway
 */
@injectable()
export class DBGateway implements IDBGateway {
    /**
     * クエリを実行して全ての行を返します。
     * @param env - D1データベースを含むCloudFlareのenv
     * @param sql - SQL文字列
     * @param params - バインドパラメータ
     */
    @Logger
    public async queryAll(
        env: CloudFlareEnv,
        sql: string,
        params: any[],
    ): Promise<{ results: any[] }> {
        return env.DB.prepare(sql)
            .bind(...params)
            .all();
    }

    /**
     * 行を返さないステートメントを実行します。
     * @param env - D1データベースを含むCloudFlareのenv
     * @param sql - SQL文字列
     * @param params - バインドパラメータ
     */
    @Logger
    public async run(
        env: CloudFlareEnv,
        sql: string,
        params: any[],
    ): Promise<any> {
        return env.DB.prepare(sql)
            .bind(...params)
            .run();
    }
}
