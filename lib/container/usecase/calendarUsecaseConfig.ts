import { container } from 'tsyringe';

import { AutoraceRaceCalendarUseCase } from '../../src/usecase/implement/autoraceRaceCalendarUseCase';
import { BoatraceRaceCalendarUseCase } from '../../src/usecase/implement/boatraceRaceCalendarUseCase';
import { KeirinRaceCalendarUseCase } from '../../src/usecase/implement/keirinRaceCalendarUseCase';
import { PublicGamblingCalendarUseCase } from '../../src/usecase/implement/publicGamblingCalendarUseCase';
import type { IOldRaceCalendarUseCase } from '../../src/usecase/interface/IOldRaceCalendarUseCase';
import type { IRaceCalendarUseCase } from '../../src/usecase/interface/IRaceCalendarUseCase';

container.register<IOldRaceCalendarUseCase>('KeirinRaceCalendarUseCase', {
    useClass: KeirinRaceCalendarUseCase,
});
container.register<IOldRaceCalendarUseCase>('AutoraceRaceCalendarUseCase', {
    useClass: AutoraceRaceCalendarUseCase,
});
container.register<IOldRaceCalendarUseCase>('BoatraceRaceCalendarUseCase', {
    useClass: BoatraceRaceCalendarUseCase,
});
container.register<IRaceCalendarUseCase>('PublicGamblingCalendarUseCase', {
    useClass: PublicGamblingCalendarUseCase,
});
