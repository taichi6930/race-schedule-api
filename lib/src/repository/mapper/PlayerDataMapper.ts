import { injectable } from 'tsyringe';

import { PlayerData } from '../../domain/playerData';
import { RaceType, RaceTypeList } from '../../utility/sqlite';
import { PlayerEntity } from '../entity/playerEntity';
import { ValidationError } from '../error/RepositoryError';

interface SQLitePlayerRow {
    raceType: RaceType;
    playerNumber: number;
    name: string;
    priority: number;
}

@injectable()
export class PlayerDataMapper {
    public toEntity(row: unknown): PlayerEntity {
        if (!this.isValidPlayerRow(row)) {
            throw new ValidationError('Invalid player data format');
        }

        const playerData = PlayerData.create(
            row.raceType,
            row.playerNumber,
            row.name,
            row.priority,
        );
        return PlayerEntity.createWithoutId(playerData);
    }

    private isValidPlayerRow(row: unknown): row is SQLitePlayerRow {
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

        const record = row as Record<string, unknown>;
        if (!this.isValidRaceType(record.raceType)) {
            return false;
        }

        return (
            typeof record.name === 'string' &&
            typeof record.priority === 'number' &&
            typeof record.playerNumber === 'number' &&
            record.name.length > 0 &&
            record.playerNumber > 0
        );
    }

    private isValidRaceType(value: unknown): boolean {
        if (typeof value !== 'string') {
            return false;
        }
        // valueがRaceTypeStringのいずれかであることを確認
        const raceTypeValues = RaceTypeList;
        for (const raceTypeValue of raceTypeValues) {
            if (value === raceTypeValue.toString()) {
                return true;
            }
        }
        return false;
    }
}
