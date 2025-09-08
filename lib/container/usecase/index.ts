import { container } from 'tsyringe';

import { CalendarUseCaseForAWS } from '../../src/usecase/implement/calendarUseCase';
import { PlaceUseCaseForAWS } from '../../src/usecase/implement/placeUseCase';
import { PlayerUseCaseForAWS } from '../../src/usecase/implement/playerUseCase';
import { RaceUseCaseForAWS } from '../../src/usecase/implement/raceUseCase';
import type { IPlaceUseCaseForAWS } from '../../src/usecase/interface/IPlaceUseCase';
import type { IPlayerDataUseCaseForAWS } from '../../src/usecase/interface/IPlayerDataUseCase';
import type { IRaceCalendarUseCaseForAWS } from '../../src/usecase/interface/IRaceCalendarUseCase';
import type { IRaceUseCaseForAWS } from '../../src/usecase/interface/IRaceUseCase';

container.register<IRaceCalendarUseCaseForAWS>('CalendarUseCase', {
    useClass: CalendarUseCaseForAWS,
});
container.register<IPlaceUseCaseForAWS>('PlaceUseCase', {
    useClass: PlaceUseCaseForAWS,
});
container.register<IRaceUseCaseForAWS>('RaceUseCase', {
    useClass: RaceUseCaseForAWS,
});
container.register<IPlayerDataUseCaseForAWS>('PlayerUseCase', {
    useClass: PlayerUseCaseForAWS,
});
