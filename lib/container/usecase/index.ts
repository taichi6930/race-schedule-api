import { container } from 'tsyringe';

import { CalendarUseCaseForAWS } from '../../src/usecase/implement/calendarUseCaseForAWS';
import { PlaceUseCaseForAWS } from '../../src/usecase/implement/placeUseCaseForAWS';
import { PlayerUseCaseForAWS } from '../../src/usecase/implement/playerUseCaseForAWS';
import { RaceUseCaseForAWS } from '../../src/usecase/implement/raceUseCaseForAWS';
import type { IPlaceUseCaseForAWS } from '../../src/usecase/interface/IPlaceUseCaseForAWS';
import type { IPlayerDataUseCaseForAWS } from '../../src/usecase/interface/IPlayerDataUseCaseForAWS';
import type { IRaceCalendarUseCaseForAWS } from '../../src/usecase/interface/IRaceCalendarUseCaseForAWS';
import type { IRaceUseCaseForAWS } from '../../src/usecase/interface/IRaceUseCaseForAWS';

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
