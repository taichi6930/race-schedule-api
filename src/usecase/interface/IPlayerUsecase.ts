import { CommonParameter } from '../..';
import { PlayerEntity } from '../../../lib/src/repository/entity/playerEntity';

// UseCase層
export interface IPlayerUseCase {
    fetchPlayerEntityList(
        commonParameter: CommonParameter,
    ): Promise<PlayerEntity[]>;

    upsertPlayerEntity(
        commonParameter: CommonParameter,
        entity: PlayerEntity,
    ): Promise<void>;
}
