import Database from 'better-sqlite3';
import { injectable } from 'tsyringe';

import { PlayerData } from '../../domain/playerData';
import { Logger } from '../../utility/logger';
import { RaceType, SQLiteManager } from '../../utility/sqlite';
import { PlayerEntity } from '../entity/playerEntity';
import { SearchPlayerFilterEntity } from '../entity/searchPlayerFilterEntity';

interface PlayerRow {
    id: string;
    raceType: string;
    playerNumber: string;
    name: string;
    priority: number;
}

function toPlayerRow(row: unknown): PlayerRow | undefined {
    if (
        typeof row !== 'object' ||
        row === null ||
        !('id' in row) ||
        !('raceType' in row) ||
        !('playerNumber' in row) ||
        !('name' in row) ||
        !('priority' in row)
    ) {
        return undefined;
    }
    const r = row as Record<string, unknown>;
    if (
        typeof r.id !== 'string' ||
        typeof r.raceType !== 'string' ||
        typeof r.playerNumber !== 'string' ||
        typeof r.name !== 'string' ||
        typeof r.priority !== 'number'
    ) {
        return undefined;
    }
    if (Number.isNaN(Number(r.playerNumber))) {
        return undefined;
    }
    if (!(Object.values(RaceType) as string[]).includes(r.raceType)) {
        return undefined;
    }
    return {
        id: r.id,
        raceType: r.raceType,
        playerNumber: r.playerNumber,
        name: r.name,
        priority: r.priority,
    };
}

@injectable()
export class PlayerRepositoryFromSqliteImpl {
    private readonly db: Database.Database;

    public constructor() {
        // race-setting.db（player_data用）を使う
        this.db = SQLiteManager.getInstanceForSetting().getDatabase();
    }

    /**
     * プレイヤーデータを取得する
     * @param searchFilter
     */
    @Logger
    // eslint-disable-next-line @typescript-eslint/require-await
    public async fetchPlayerEntityList(
        searchFilter: SearchPlayerFilterEntity,
    ): Promise<PlayerEntity[]> {
        // asyncのため将来的な拡張性を担保
        const query = this.db.prepare(`
            SELECT id, raceType, playerNumber, name, priority
            FROM player_data
            WHERE raceType = :raceType
        `);

        const params = {
            raceType: searchFilter.raceType,
        };

        const rows = query.all(params);
        const validatedRows: PlayerRow[] = [];
        for (const row of rows) {
            const valid = toPlayerRow(row);
            if (valid) {
                validatedRows.push(valid);
            } else {
                console.warn('Invalid player row structure detected:', row);
            }
        }
        const entities = validatedRows.map((row) => {
            if (!this.isRaceType(row.raceType)) {
                throw new Error(`Invalid race type: ${row.raceType}`);
            }
            const playerData = PlayerData.create(
                row.raceType,
                Number(row.playerNumber),
                row.name,
                row.priority,
            );
            return PlayerEntity.createWithoutId(playerData);
        });
        return entities;
    }

    private isRaceType(value: string): value is RaceType {
        return (Object.values(RaceType) as string[]).includes(value);
    }
}
