import { container } from 'tsyringe';

import { RaceController } from './controller/raceController';
import { RaceRepository } from './repository/implement/raceRepository';
import { RaceService } from './service/implement/raceService';
import { RaceUsecase } from './usecase/implement/raceUsecase';

container.register('RaceRepository', { useClass: RaceRepository });
container.register('RaceService', { useClass: RaceService });
container.register('RaceUsecase', { useClass: RaceUsecase });

export const raceController = container.resolve(RaceController);
