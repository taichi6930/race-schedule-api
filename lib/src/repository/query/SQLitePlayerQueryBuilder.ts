import { injectable } from 'tsyringe';

import { SearchPlayerFilterEntity } from '../entity/searchPlayerFilterEntity';
import { ValidationError } from '../error/RepositoryError';
import { IPlayerQueryBuilder } from './IPlayerQueryBuilder';

@injectable()
export class SQLitePlayerQueryBuilder implements IPlayerQueryBuilder {
    public buildFetchByRaceTypeQuery(): string {
        return `
            SELECT id, raceType, CAST(playerNumber AS INTEGER) as playerNumber, name, priority
            FROM player
            WHERE raceType = :raceType
            ORDER BY priority DESC, playerNumber
        `;
    }

    public getParams(filter: SearchPlayerFilterEntity): Record<string, string> {
        if (!this.isValidFilter(filter.raceType)) {
            throw new ValidationError('Invalid search filter');
        }
        return { raceType: filter.raceType };
    }

    private isValidFilter(raceType: string | undefined): raceType is string {
        return typeof raceType === 'string' && raceType.length > 0;
    }
}
