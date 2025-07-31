import { container } from 'tsyringe';

import type { AutoraceRaceData } from '../../src/domain/autoraceRaceData';
import type { BoatraceRaceData } from '../../src/domain/boatraceRaceData';
import type { JraRaceData } from '../../src/domain/jraRaceData';
import type { KeirinRaceData } from '../../src/domain/keirinRaceData';
import type { NarRaceData } from '../../src/domain/narRaceData';
import type { WorldRaceData } from '../../src/domain/worldRaceData';
import { AutoraceRaceDataUseCase } from '../../src/usecase/implement/autoraceRaceDataUseCase';
import { BoatraceRaceDataUseCase } from '../../src/usecase/implement/boatraceRaceDataUseCase';
import { JraRaceDataUseCase } from '../../src/usecase/implement/jraRaceDataUseCase';
import { KeirinRaceDataUseCase } from '../../src/usecase/implement/keirinRaceDataUseCase';
import { NarRaceDataUseCase } from '../../src/usecase/implement/narRaceDataUseCase';
import { WorldRaceDataUseCase } from '../../src/usecase/implement/worldRaceDataUseCase';
import type { IOldRaceDataUseCase } from '../../src/usecase/interface/IRaceDataUseCase';

// Usecaseの実装クラスをDIコンテナに登錄する
container.register<IOldRaceDataUseCase<NarRaceData>>('NarRaceDataUseCase', {
    useClass: NarRaceDataUseCase,
});
container.register<IOldRaceDataUseCase<JraRaceData>>('JraRaceDataUseCase', {
    useClass: JraRaceDataUseCase,
});
container.register<IOldRaceDataUseCase<KeirinRaceData>>(
    'KeirinRaceDataUseCase',
    {
        useClass: KeirinRaceDataUseCase,
    },
);
container.register<IOldRaceDataUseCase<WorldRaceData>>('WorldRaceDataUseCase', {
    useClass: WorldRaceDataUseCase,
});
container.register<IOldRaceDataUseCase<AutoraceRaceData>>(
    'AutoraceRaceDataUseCase',
    {
        useClass: AutoraceRaceDataUseCase,
    },
);
container.register<IOldRaceDataUseCase<BoatraceRaceData>>(
    'BoatraceRaceDataUseCase',
    {
        useClass: BoatraceRaceDataUseCase,
    },
);
