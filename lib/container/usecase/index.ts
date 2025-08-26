import { container } from 'tsyringe';

import { CalendarUseCase } from '../../src/usecase/implement/calendarUseCase';
import { PlaceUseCase } from '../../src/usecase/implement/placeUseCase';
import { PlayerUseCase } from '../../src/usecase/implement/playerUseCase';
import { RaceUseCase } from '../../src/usecase/implement/raceUseCase';
import type { IPlaceUseCase } from '../../src/usecase/interface/IPlaceUseCase';
import type { IPlayerDataUseCase } from '../../src/usecase/interface/IPlayerDataUseCase';
import type { IRaceCalendarUseCase } from '../../src/usecase/interface/IRaceCalendarUseCase';
import type { IRaceUseCase } from '../../src/usecase/interface/IRaceUseCase';

container.register<IRaceCalendarUseCase>('PublicGamblingCalendarUseCase', {
    useClass: CalendarUseCase,
});
container.register<IPlaceUseCase>('PublicGamblingPlaceUseCase', {
    useClass: PlaceUseCase,
});
container.register<IRaceUseCase>('PublicGamblingRaceUseCase', {
    useClass: RaceUseCase,
});
container.register<IPlayerDataUseCase>('PublicGamblingPlayerUseCase', {
    useClass: PlayerUseCase,
});
