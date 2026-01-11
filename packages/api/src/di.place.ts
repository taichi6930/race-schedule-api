import { container } from 'tsyringe';

import { PlaceController } from './controller/placeController';
import { PlaceRepositoryStub } from './repository/implement/placeRepositoryStub';
import { PlaceService } from './service/implement/placeService';
import { PlaceUsecase } from './usecase/implement/placeUsecase';

container.register('PlaceRepository', { useClass: PlaceRepositoryStub });
container.register('PlaceService', { useClass: PlaceService });
container.register('PlaceUsecase', { useClass: PlaceUsecase });

export const placeController = container.resolve(PlaceController);
