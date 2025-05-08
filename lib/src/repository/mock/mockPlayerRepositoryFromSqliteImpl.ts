import { injectable } from 'tsyringe';

import { TestPlayerList } from '../../../scripts/testData/playerTestData';
import { PlayerData } from '../../domain/playerData';
import { PlayerEntity } from '../entity/playerEntity';
import { SearchPlayerFilterEntity } from '../entity/searchPlayerFilterEntity';
import { RepositoryError } from '../error/RepositoryError';
import { IPlayerRepository } from '../interface/IPlayerRepository';

@injectable()
export class MockPlayerRepositoryFromSqliteImpl implements IPlayerRepository {
    public async fetchPlayerEntityList(
        filter: SearchPlayerFilterEntity,
    ): Promise<PlayerEntity[]> {
        try {
            return await new Promise((resolve, reject) => {
                try {
                    const filteredPlayers = TestPlayerList.filter((player) => {
                        return (
                            filter.raceType.toString() ===
                            player.raceType.toString()
                        );
                    }).map((player) => {
                        return PlayerEntity.createWithoutId(
                            PlayerData.create(
                                player.raceType,
                                Number.parseInt(player.playerNumber),
                                player.name,
                                player.priority,
                            ),
                        );
                    });
                    resolve(filteredPlayers);
                } catch (error) {
                    reject(
                        error instanceof Error
                            ? error
                            : new Error(String(error)),
                    );
                }
            });
        } catch (error) {
            throw RepositoryError.fromError(error);
        }
    }
}
