import { CommonParameter } from '../..';
import { PlayerEntity } from '../../../lib/src/repository/entity/playerEntity';

// Service層
export interface IPlayerService {
    getPlayerData(commonParameter: CommonParameter): Promise<PlayerEntity[]>;
}
