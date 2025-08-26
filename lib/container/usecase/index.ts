import { container } from 'tsyringe';

import { PublicGamblingCalendarUseCase } from '../../src/usecase/implement/calendarUseCase';
import { PublicGamblingPlaceUseCase } from '../../src/usecase/implement/placeUseCase';
import { PublicGamblingPlayerUseCase } from '../../src/usecase/implement/playerUseCase';
import { PublicGamblingRaceUseCase } from '../../src/usecase/implement/raceUseCase';
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
