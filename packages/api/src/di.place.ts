import { container } from 'tsyringe';

import { PlaceController } from './controller/placeController';
import { DBGateway } from './gateway/implement/dbGateway';
import { PlaceRepository } from './repository/implement/placeRepository';
import { PlaceService } from './service/implement/placeService';
import { PlaceUsecase } from './usecase/implement/placeUsecase';

container.register('DBGateway', { useClass: DBGateway });
container.register('PlaceRepositoryDb', { useClass: PlaceRepository });
container.register('PlaceService', { useClass: PlaceService });
container.register('PlaceUsecase', { useClass: PlaceUsecase });

export const placeController = container.resolve(PlaceController);
