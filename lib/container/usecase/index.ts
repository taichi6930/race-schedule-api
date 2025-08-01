import { container } from 'tsyringe';

import { PublicGamblingCalendarUseCase } from '../../src/usecase/implement/publicGamblingCalendarUseCase';
import { PublicGamblingPlaceUseCase } from '../../src/usecase/implement/publicGamblingPlaceUseCase';
import { PublicGamblingPlayerUseCase } from '../../src/usecase/implement/publicGamblingPlayerUseCase';
import { PublicGamblingRaceDataUseCase } from '../../src/usecase/implement/publicGamblingRaceDataUseCase';
import type { IPlaceDataUseCase } from '../../src/usecase/interface/IPlaceDataUseCase';
import type { IPlayerDataUseCase } from '../../src/usecase/interface/IPlayerDataUseCase';
import type { IRaceCalendarUseCase } from '../../src/usecase/interface/IRaceCalendarUseCase';
import type { IRaceDataUseCase } from '../../src/usecase/interface/IRaceDataUseCase';

container.register<IRaceCalendarUseCase>('PublicGamblingCalendarUseCase', {
    useClass: PublicGamblingCalendarUseCase,
});
container.register<IPlaceDataUseCase>('PublicGamblingPlaceUseCase', {
    useClass: PublicGamblingPlaceUseCase,
});
container.register<IRaceDataUseCase>('PublicGamblingRaceDataUseCase', {
    useClass: PublicGamblingRaceDataUseCase,
});
container.register<IPlayerDataUseCase>('PublicGamblingPlayerUseCase', {
    useClass: PublicGamblingPlayerUseCase,
});
