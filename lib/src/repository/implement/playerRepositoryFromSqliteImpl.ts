import '../../utility/format';

import Database from 'better-sqlite3';
import { injectable } from 'tsyringe';

import { PlayerData } from '../../domain/playerData';
import { Logger } from '../../utility/logger';
import { SQLiteManager } from '../../utility/sqlite';
import { PlayerEntity } from '../entity/playerEntity';
import { SearchPlayerFilterEntity } from '../entity/searchPlayerFilterEntity';
import { IPlayerRepository } from '../interface/IPlayerRepository';

@injectable()
export class PlayerRepositoryFromSqliteImpl implements IPlayerRepository {
    private readonly db: Database.Database;

    public constructor() {
        this.db = SQLiteManager.getInstance().getDatabase();
    }

    /**
     * 開催データを取得する
     * このメソッドで日付の範囲を指定して開催データを取得する
     * @param searchFilter
     */
    @Logger
    public async fetchPlayerEntityList(
        searchFilter: SearchPlayerFilterEntity,
    ): Promise<PlayerEntity[]> {
        const query = this.db.prepare(`
            SELECT id, raceType, playerNumber, name, priority
            FROM player
            WHERE raceType = :raceType
            AND playerNumber = :playerNumber
            AND name = :name
            AND priority = :priority
        `);

        const params = {
            type: searchFilter.raceType,
        };

        const results = await new Promise<unknown[]>((resolve) => {
            resolve(query.all(params));
        });

        // 受け取ったPlayer情報を元にPlayerEntityを生成する
        const playerRows = results.filter((row): row is PlayerData => {
            if (typeof row !== 'object' || row === null) {
                return false;
            }
            const hasRequiredProperties =
                'raceType' in row &&
                'playerNumber' in row &&
                'name' in row &&
                'priority' in row;
            if (!hasRequiredProperties) {
                return false;
            }
            return (
                typeof (row as { raceType: unknown }).raceType === 'string' &&
                typeof (row as { playerNumber: unknown }).playerNumber ===
                    'number' &&
                typeof (row as { name: unknown }).name === 'string' &&
                typeof (row as { priority: unknown }).priority === 'number'
            );
        });

        const entities: PlayerEntity[] = playerRows.map((result) => {
            if (
                typeof result === 'object' &&
                'raceType' in result &&
                'playerNumber' in result &&
                'name' in result &&
                'priority' in result
            ) {
                const { raceType, playerNumber, name, priority } = result;
                const playerData = PlayerData.create(
                    raceType,
                    playerNumber,
                    name,
                    priority,
                );
                return PlayerEntity.createWithoutId(playerData);
            }
            throw new Error('Invalid result format');
        });
        return Promise.all(entities);
    }
}
