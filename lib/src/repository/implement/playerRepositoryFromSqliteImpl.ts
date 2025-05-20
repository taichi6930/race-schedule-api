import type Database from 'better-sqlite3';
import { inject, injectable } from 'tsyringe';

import { SQLiteManager } from '../../utility/sqlite';
import { PlayerEntity } from '../entity/playerEntity';
import { SearchPlayerFilterEntity } from '../entity/searchPlayerFilterEntity';
import { RepositoryError } from '../error/RepositoryError';
import { IPlayerRepository } from '../interface/IPlayerRepository';
import { PlayerDataMapper } from '../mapper/PlayerDataMapper';
import { IPlayerQueryBuilder } from '../query/IPlayerQueryBuilder';

@injectable()
export class PlayerRepositoryFromSqliteImpl implements IPlayerRepository {
    private readonly db: Database.Database;

    public constructor(
        @inject('IPlayerQueryBuilder')
        private readonly queryBuilder: IPlayerQueryBuilder,
        @inject(PlayerDataMapper)
        private readonly mapper: PlayerDataMapper,
    ) {
        this.db = SQLiteManager.getInstance().getDatabase();
    }

    public async fetchPlayerEntityList(
        filter: SearchPlayerFilterEntity,
    ): Promise<PlayerEntity[]> {
        try {
            const rows = this.db
                .prepare(this.queryBuilder.buildFetchByRaceTypeQuery())
                .all(this.queryBuilder.getParams(filter));

            await Promise.resolve(); // 意図的な非同期ポイント
            return rows.map((row) => this.mapper.toEntity(row));
        } catch (error) {
            throw RepositoryError.fromError(error);
        }
    }
}
