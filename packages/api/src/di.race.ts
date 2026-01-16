import { container } from 'tsyringe';

import { RaceController } from './controller/raceController';
import { RaceRepositoryStub } from './repository/stub/raceRepositoryStub';
import { RaceService } from './service/implement/raceService';
import { RaceUsecase } from './usecase/implement/raceUsecase';

container.register('RaceRepository', { useClass: RaceRepositoryStub });
container.register('RaceService', { useClass: RaceService });
container.register('RaceUsecase', { useClass: RaceUsecase });

export const raceController = container.resolve(RaceController);
