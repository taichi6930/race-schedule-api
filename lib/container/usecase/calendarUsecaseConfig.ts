import { container } from 'tsyringe';

import { AutoraceRaceCalendarUseCase } from '../../src/usecase/implement/autoraceRaceCalendarUseCase';
import { BoatraceRaceCalendarUseCase } from '../../src/usecase/implement/boatraceRaceCalendarUseCase';
import { JraRaceCalendarUseCase } from '../../src/usecase/implement/jraRaceCalendarUseCase';
import { KeirinRaceCalendarUseCase } from '../../src/usecase/implement/keirinRaceCalendarUseCase';
import { NarRaceCalendarUseCase } from '../../src/usecase/implement/narRaceCalendarUseCase';
import { PublicGamblingCalendarUseCase } from '../../src/usecase/implement/publicGamblingCalendarUseCase';
import { WorldRaceCalendarUseCase } from '../../src/usecase/implement/worldRaceCalendarUseCase';
import type { IRaceCalendarUseCase } from '../../src/usecase/interface/IRaceCalendarUseCase';

container.register<IRaceCalendarUseCase>('NarRaceCalendarUseCase', {
    useClass: NarRaceCalendarUseCase,
});
container.register<IRaceCalendarUseCase>('JraRaceCalendarUseCase', {
    useClass: JraRaceCalendarUseCase,
});
container.register<IRaceCalendarUseCase>('WorldRaceCalendarUseCase', {
    useClass: WorldRaceCalendarUseCase,
});
container.register<IRaceCalendarUseCase>('KeirinRaceCalendarUseCase', {
    useClass: KeirinRaceCalendarUseCase,
});
container.register<IRaceCalendarUseCase>('AutoraceRaceCalendarUseCase', {
    useClass: AutoraceRaceCalendarUseCase,
});
container.register<IRaceCalendarUseCase>('BoatraceRaceCalendarUseCase', {
    useClass: BoatraceRaceCalendarUseCase,
});
container.register<IRaceCalendarUseCase>('PublicGamblingCalendarUseCase', {
    useClass: PublicGamblingCalendarUseCase,
});
