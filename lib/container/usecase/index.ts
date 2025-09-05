import { container } from 'tsyringe';

import { CalendarUseCase } from '../../src/usecase/implement/calendarUseCase';
import { PlaceUseCase } from '../../src/usecase/implement/placeUseCase';
import { PlayerUseCaseForAWS } from '../../src/usecase/implement/playerUseCase';
import { RaceUseCase } from '../../src/usecase/implement/raceUseCase';
import type { IPlaceUseCase } from '../../src/usecase/interface/IPlaceUseCase';
import type { IPlayerDataUseCaseForAWS } from '../../src/usecase/interface/IPlayerDataUseCase';
import type { IRaceCalendarUseCase } from '../../src/usecase/interface/IRaceCalendarUseCase';
import type { IRaceUseCase } from '../../src/usecase/interface/IRaceUseCase';

container.register<IRaceCalendarUseCase>('CalendarUseCase', {
    useClass: CalendarUseCase,
});
container.register<IPlaceUseCase>('PlaceUseCase', {
    useClass: PlaceUseCase,
});
container.register<IRaceUseCase>('RaceUseCase', {
    useClass: RaceUseCase,
});
container.register<IPlayerDataUseCaseForAWS>('PlayerUseCase', {
    useClass: PlayerUseCaseForAWS,
});
