import { CommonParameter } from '../..';
import { PlayerEntity } from '../../../lib/src/repository/entity/playerEntity';

// UseCase層
export interface IPlayerUseCase {
    getPlayerData(commonParameter: CommonParameter): Promise<PlayerEntity[]>;
}
