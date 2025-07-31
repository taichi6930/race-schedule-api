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
import type { AutoraceGradeType } from '../../src/utility/data/autorace/autoraceGradeType';
import type { AutoraceRaceCourse } from '../../src/utility/data/autorace/autoraceRaceCourse';
import type { AutoraceRaceStage } from '../../src/utility/data/autorace/autoraceRaceStage';
import type { BoatraceGradeType } from '../../src/utility/data/boatrace/boatraceGradeType';
import type { BoatraceRaceCourse } from '../../src/utility/data/boatrace/boatraceRaceCourse';
import type { BoatraceRaceStage } from '../../src/utility/data/boatrace/boatraceRaceStage';
import type { JraGradeType } from '../../src/utility/data/jra/jraGradeType';
import type { JraRaceCourse } from '../../src/utility/data/jra/jraRaceCourse';
import type { KeirinGradeType } from '../../src/utility/data/keirin/keirinGradeType';
import type { KeirinRaceCourse } from '../../src/utility/data/keirin/keirinRaceCourse';
import type { KeirinRaceStage } from '../../src/utility/data/keirin/keirinRaceStage';
import type { NarGradeType } from '../../src/utility/data/nar/narGradeType';
import type { NarRaceCourse } from '../../src/utility/data/nar/narRaceCourse';
import type { WorldGradeType } from '../../src/utility/data/world/worldGradeType';
import type { WorldRaceCourse } from '../../src/utility/data/world/worldRaceCourse';

// Usecaseの実装クラスをDIコンテナに登錄する
container.register<
    IOldRaceDataUseCase<NarRaceData, NarGradeType, NarRaceCourse, undefined>
>('NarRaceDataUseCase', {
    useClass: NarRaceDataUseCase,
});
container.register<
    IOldRaceDataUseCase<JraRaceData, JraGradeType, JraRaceCourse, undefined>
>('JraRaceDataUseCase', {
    useClass: JraRaceDataUseCase,
});
container.register<
    IOldRaceDataUseCase<
        KeirinRaceData,
        KeirinGradeType,
        KeirinRaceCourse,
        KeirinRaceStage
    >
>('KeirinRaceDataUseCase', {
    useClass: KeirinRaceDataUseCase,
});
container.register<
    IOldRaceDataUseCase<
        WorldRaceData,
        WorldGradeType,
        WorldRaceCourse,
        undefined
    >
>('WorldRaceDataUseCase', {
    useClass: WorldRaceDataUseCase,
});
container.register<
    IOldRaceDataUseCase<
        AutoraceRaceData,
        AutoraceGradeType,
        AutoraceRaceCourse,
        AutoraceRaceStage
    >
>('AutoraceRaceDataUseCase', {
    useClass: AutoraceRaceDataUseCase,
});
container.register<
    IOldRaceDataUseCase<
        BoatraceRaceData,
        BoatraceGradeType,
        BoatraceRaceCourse,
        BoatraceRaceStage
    >
>('BoatraceRaceDataUseCase', {
    useClass: BoatraceRaceDataUseCase,
});
