import { container } from 'tsyringe';

import { AutoraceRaceCalendarUseCase } from '../../src/usecase/implement/autoraceRaceCalendarUseCase';
import { BoatraceRaceCalendarUseCase } from '../../src/usecase/implement/boatraceRaceCalendarUseCase';
import { JraRaceCalendarUseCase } from '../../src/usecase/implement/jraRaceCalendarUseCase';
import { KeirinRaceCalendarUseCase } from '../../src/usecase/implement/keirinRaceCalendarUseCase';
import { NarRaceCalendarUseCase } from '../../src/usecase/implement/narRaceCalendarUseCase';
import { PublicGamblingCalendarUseCase } from '../../src/usecase/implement/publicGamblingCalendarUseCase';
import { WorldRaceCalendarUseCase } from '../../src/usecase/implement/worldRaceCalendarUseCase';
import type { IOldRaceCalendarUseCase } from '../../src/usecase/interface/IOldRaceCalendarUseCase';

container.register<IOldRaceCalendarUseCase>('NarRaceCalendarUseCase', {
    useClass: NarRaceCalendarUseCase,
});
container.register<IOldRaceCalendarUseCase>('JraRaceCalendarUseCase', {
    useClass: JraRaceCalendarUseCase,
});
container.register<IOldRaceCalendarUseCase>('WorldRaceCalendarUseCase', {
    useClass: WorldRaceCalendarUseCase,
});
container.register<IOldRaceCalendarUseCase>('KeirinRaceCalendarUseCase', {
    useClass: KeirinRaceCalendarUseCase,
});
container.register<IOldRaceCalendarUseCase>('AutoraceRaceCalendarUseCase', {
    useClass: AutoraceRaceCalendarUseCase,
});
container.register<IOldRaceCalendarUseCase>('BoatraceRaceCalendarUseCase', {
    useClass: BoatraceRaceCalendarUseCase,
});
container.register<IOldRaceCalendarUseCase>('PublicGamblingCalendarUseCase', {
    useClass: PublicGamblingCalendarUseCase,
});
