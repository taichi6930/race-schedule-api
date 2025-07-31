import { container } from 'tsyringe';

import { PublicGamblingCalendarUseCase } from '../../src/usecase/implement/publicGamblingCalendarUseCase';
import type { IRaceCalendarUseCase } from '../../src/usecase/interface/IRaceCalendarUseCase';

container.register<IRaceCalendarUseCase>('PublicGamblingCalendarUseCase', {
    useClass: PublicGamblingCalendarUseCase,
});
