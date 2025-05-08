import { inject, injectable } from 'tsyringe';

import { PlayerData } from '../../domain/playerData';
import { SearchPlayerFilterEntity } from '../../repository/entity/searchPlayerFilterEntity';
import { IPlayerRepository } from '../../repository/interface/IPlayerRepository';
import { RaceType } from '../../utility/sqlite';
import type { IPlayerDataService } from '../interface/IPlayerDataService';

@injectable()
export class PlayerDataService implements IPlayerDataService {
    public constructor(
        @inject('PlayerRepositoryFromSqlite')
        private readonly playerRepository: IPlayerRepository,
    ) {}

    /**
     * プレイヤーデータをRepositoryから取得します
     *
     * このメソッドは、指定されたレースタイプのプレイヤーデータを
     * Repositoryから取得します。データが存在しない場合は空の配列を返します。
     * @param type - レースタイプ
     */
    public async fetchPlayerDataList(type: RaceType): Promise<PlayerData[]> {
        const filter: SearchPlayerFilterEntity = {
            raceType: type,
        };

        const playerEntities =
            await this.playerRepository.fetchPlayerEntityList(filter);
        return playerEntities.map((entity) => entity.playerData);
    }
}
