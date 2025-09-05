import { CommonParameter } from '../..';
import { PlayerEntity } from '../../../lib/src/repository/entity/playerEntity';
import { PlayerRegisterDTO } from '../../repository/implement/playerRepository';

// Service層
export interface IPlayerService {
    fetchPlayerEntityList(
        commonParameter: CommonParameter,
    ): Promise<PlayerEntity[]>;

    upsertPlayerEntity(
        dto: PlayerRegisterDTO,
        commonParameter: CommonParameter,
    ): Promise<void>;
}
