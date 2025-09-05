import { CommonParameter } from '../..';
import { PlayerEntity } from '../../../lib/src/repository/entity/playerEntity';
import { PlayerRegisterDTO } from '../../repository/implement/playerRepository';

// UseCase層
export interface IPlayerUseCase {
    fetchPlayerEntityList(
        commonParameter: CommonParameter,
    ): Promise<PlayerEntity[]>;

    upsertPlayerEntity(
        dto: PlayerRegisterDTO,
        commonParameter: CommonParameter,
    ): Promise<void>;
}
