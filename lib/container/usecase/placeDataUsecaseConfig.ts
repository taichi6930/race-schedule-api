import { container } from 'tsyringe';

import { PublicGamblingPlaceUseCase } from '../../src/usecase/implement/publicGamblingPlaceUseCase';
import type { IPlaceDataUseCase } from '../../src/usecase/interface/IPlaceDataUseCase';

container.register<IPlaceDataUseCase>('PublicGamblingPlaceUseCase', {
    useClass: PublicGamblingPlaceUseCase,
});
