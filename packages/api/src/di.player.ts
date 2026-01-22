import { container } from 'tsyringe';

import { PlayerController } from './controller/playerController';
import { DBGateway } from './gateway/implement/dbGateway';
import { PlayerRepository } from './repository/implement/playerRepository';
import { PlayerService } from './service/implement/playerService';
import { PlayerUseCase } from './usecase/implement/playerUsecase';

container.register('DBGateway', { useClass: DBGateway });
container.register('PlayerRepository', { useClass: PlayerRepository });
container.register('PlayerService', { useClass: PlayerService });
container.register('PlayerUsecase', { useClass: PlayerUseCase });

export const playerController = container.resolve(PlayerController);
