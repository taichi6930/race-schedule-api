import '../../utility/format';

import Database from 'better-sqlite3';
import { injectable } from 'tsyringe';

import { PlayerData } from '../../domain/playerData';
import { Logger } from '../../utility/logger';
import { SQLiteManager } from '../../utility/sqlite';
import { PlayerEntity } from '../entity/playerEntity';
import { SearchPlayerFilterEntity } from '../entity/searchPlayerFilterEntity';
import { IPlayerRepository } from '../interface/IPlayerRepository';

export class PlayerRepositoryError extends Error {
    public constructor(
        message: string,
        public readonly cause?: unknown,
        public readonly code?: string,
    ) {
        super(message);
        this.name = 'PlayerRepositoryError';
    }

    public static fromError(
        error: unknown,
        code?: string,
    ): PlayerRepositoryError {
        if (error instanceof PlayerRepositoryError) {
            return error;
        }
        const message = error instanceof Error ? error.message : String(error);
        return new PlayerRepositoryError(message, error, code);
    }
}

interface SQLitePlayerRow {
    raceType: string;
    playerNumber: string;
    name: string;
    priority: number;
}

// 型ガード関数
function isValidPlayerRow(row: unknown): row is SQLitePlayerRow {
    if (typeof row !== 'object' || row === null) {
        return false;
    }

    if (
        !(
            'raceType' in row &&
            'playerNumber' in row &&
            'name' in row &&
            'priority' in row
        )
    ) {
        return false;
    }

    const { raceType } = row as Record<string, unknown>;
    const { playerNumber } = row as Record<string, unknown>;
    const { name } = row as Record<string, unknown>;
    const { priority } = row as Record<string, unknown>;

    if (
        typeof raceType !== 'string' ||
        typeof playerNumber !== 'string' ||
        typeof name !== 'string' ||
        typeof priority !== 'number'
    ) {
        return false;
    }

    return raceType.length > 0 && playerNumber.length > 0 && name.length > 0;
}

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
        try {
            // パラメータのバリデーション
            this.validateSearchFilter(searchFilter);

            // クエリの準備と実行
            const query = this.db.prepare(`
                SELECT id, raceType, playerNumber, name, priority
                FROM player
                WHERE raceType = :raceType
                ORDER BY priority DESC, playerNumber
            `);

            const params = { raceType: searchFilter.raceType };
            const results = await this.executeQuery(query, params);

            // データの変換と検証
            const playerRows = this.validateAndTransformResults(results);
            return this.createEntities(playerRows, searchFilter.raceType);
        } catch (error) {
            throw PlayerRepositoryError.fromError(error);
        }
    }

    private validateSearchFilter(searchFilter: SearchPlayerFilterEntity): void {
        if (
            typeof searchFilter.raceType !== 'string' ||
            searchFilter.raceType.length === 0
        ) {
            throw new PlayerRepositoryError(
                'Invalid raceType provided',
                undefined,
                'INVALID_PARAM',
            );
        }
    }

    private async executeQuery(
        query: Database.Statement,
        params: { raceType: string },
    ): Promise<unknown[]> {
        try {
            return await new Promise<unknown[]>((resolve, reject) => {
                try {
                    const queryResults = query.all(params);
                    resolve(queryResults);
                } catch (error) {
                    reject(
                        new PlayerRepositoryError(
                            'Failed to execute query',
                            error,
                            'DB_ERROR',
                        ),
                    );
                }
            });
        } catch (error) {
            throw PlayerRepositoryError.fromError(error, 'DB_ERROR');
        }
    }

    private validateAndTransformResults(results: unknown[]): PlayerData[] {
        const playerRows = results.filter((row): row is PlayerData =>
            isValidPlayerRow(row),
        );

        if (playerRows.length === 0) {
            console.warn('No valid player data found');
        }

        return playerRows;
    }

    private createEntities(
        playerRows: PlayerData[],
        targetRaceType: string,
    ): PlayerEntity[] {
        try {
            const entities = playerRows.map((result) => {
                const playerData = PlayerData.create(
                    result.raceType,
                    result.playerNumber,
                    result.name,
                    result.priority,
                );
                return PlayerEntity.createWithoutId(playerData);
            });

            if (entities.length === 0) {
                console.warn(
                    `No entities created for race type: ${targetRaceType}`,
                );
            }

            return entities;
        } catch (error) {
            throw new PlayerRepositoryError(
                'Failed to create player entity',
                error,
                'ENTITY_ERROR',
            );
        }
    }
}
