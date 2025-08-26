import { container } from 'tsyringe';

import { PublicGamblingCalendarUseCase } from '../../src/usecase/implement/publicGamblingCalendarUseCase';
import { PublicGamblingPlaceUseCase } from '../../src/usecase/implement/publicGamblingPlaceUseCase';
import { PublicGamblingPlayerUseCase } from '../../src/usecase/implement/publicGamblingPlayerUseCase';
import { PublicGamblingRaceUseCase } from '../../src/usecase/implement/publicGamblingRaceUseCase';
import type { IPlaceUseCase } from '../../src/usecase/interface/IPlaceUseCase';
import type { IPlayerDataUseCase } from '../../src/usecase/interface/IPlayerDataUseCase';
import type { IRaceCalendarUseCase } from '../../src/usecase/interface/IRaceCalendarUseCase';
import type { IRaceUseCase } from '../../src/usecase/interface/IRaceUseCase';

container.register<IRaceCalendarUseCase>('PublicGamblingCalendarUseCase', {
    useClass: PublicGamblingCalendarUseCase,
});
container.register<IPlaceUseCase>('PublicGamblingPlaceUseCase', {
    useClass: PublicGamblingPlaceUseCase,
});
container.register<IRaceUseCase>('PublicGamblingRaceUseCase', {
    useClass: PublicGamblingRaceUseCase,
});
container.register<IPlayerDataUseCase>('PublicGamblingPlayerUseCase', {
    useClass: PublicGamblingPlayerUseCase,
});
