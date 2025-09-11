import { injectable } from 'tsyringe';

import type { CloudFlareEnv } from '../../utility/commonParameter';
import { Logger } from '../../utility/logger';
import type { IDBGateway } from '../interface/iDbGateway';

@injectable()
export class DBGateway implements IDBGateway {
    /**
     * Execute a query and return all rows.
     * @param env - CloudFlare env that contains D1 database
     * @param sql - SQL string
     * @param params - bind parameters
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
     * Execute a statement that doesn't return rows.
     * @param env - CloudFlare env that contains D1 database
     * @param sql - SQL string
     * @param params - bind parameters
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
