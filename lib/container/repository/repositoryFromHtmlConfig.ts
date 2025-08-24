import { container } from 'tsyringe';

import { AutoraceRaceRepositoryFromHtml } from '../../src/repository/implement/autoraceRaceRepositoryFromHtml';
import { BoatracePlaceRepositoryFromHtml } from '../../src/repository/implement/boatracePlaceRepositoryFromHtml';
import { BoatraceRaceRepositoryFromHtml } from '../../src/repository/implement/boatraceRaceRepositoryFromHtml';
import { JraPlaceRepositoryFromHtml } from '../../src/repository/implement/jraPlaceRepositoryFromHtml';
import { JraRaceRepositoryFromHtml } from '../../src/repository/implement/jraRaceRepositoryFromHtml';
import { KeirinRaceRepositoryFromHtml } from '../../src/repository/implement/keirinRaceRepositoryFromHtml';
import { MechanicalRacingPlaceRepositoryFromHtml } from '../../src/repository/implement/mechanicalRacingPlaceRepositoryFromHtml';
import { NarPlaceRepositoryFromHtml } from '../../src/repository/implement/narPlaceRepositoryFromHtml';
import { NarRaceRepositoryFromHtml } from '../../src/repository/implement/narRaceRepositoryFromHtml';
import { OverseasRaceRepositoryFromHtml } from '../../src/repository/implement/overseasRaceRepositoryFromHtml';
import type { IPlaceRepository } from '../../src/repository/interface/IPlaceRepository';
import type { IRaceRepository } from '../../src/repository/interface/IRaceRepository';
import { MockHorseRacingRaceRepositoryFromHtml } from '../../src/repository/mock/mockHorseRacingRaceRepositoryFromHtml';
import { MockMechanicalRacingRaceRepositoryFromHtml } from '../../src/repository/mock/mockMechanicalRacingRaceRepositoryFromHtml';
import { MockPlaceRepositoryFromHtml } from '../../src/repository/mock/mockPlaceRepositoryFromHtml';
import { allowedEnvs, ENV } from '../../src/utility/env';
// Repositoryの実装クラスをDIコンテナに登録する

// 環境ごとの設定
switch (ENV) {
    case allowedEnvs.production:
    case allowedEnvs.local: {
        container.register<IRaceRepository>('NarRaceRepositoryFromHtml', {
            useClass: NarRaceRepositoryFromHtml,
        });
        container.register<IPlaceRepository>('NarPlaceRepositoryFromHtml', {
            useClass: NarPlaceRepositoryFromHtml,
        });
        container.register<IRaceRepository>('JraRaceRepositoryFromHtml', {
            useClass: JraRaceRepositoryFromHtml,
        });
        container.register<IPlaceRepository>('JraPlaceRepositoryFromHtml', {
            useClass: JraPlaceRepositoryFromHtml,
        });
        container.register<IRaceRepository>('KeirinRaceRepositoryFromHtml', {
            useClass: KeirinRaceRepositoryFromHtml,
        });
        container.register<IPlaceRepository>('KeirinPlaceRepositoryFromHtml', {
            useClass: MechanicalRacingPlaceRepositoryFromHtml,
        });
        container.register<IRaceRepository>('AutoraceRaceRepositoryFromHtml', {
            useClass: AutoraceRaceRepositoryFromHtml,
        });
        container.register<IPlaceRepository>(
            'AutoracePlaceRepositoryFromHtml',
            { useClass: MechanicalRacingPlaceRepositoryFromHtml },
        );
        container.register<IRaceRepository>('OverseasRaceRepositoryFromHtml', {
            useClass: OverseasRaceRepositoryFromHtml,
        });
        container.register<IRaceRepository>('AutoraceRaceRepositoryFromHtml', {
            useClass: AutoraceRaceRepositoryFromHtml,
        });
        container.register<IPlaceRepository>(
            'BoatracePlaceRepositoryFromHtml',
            { useClass: BoatracePlaceRepositoryFromHtml },
        );
        container.register<IRaceRepository>('BoatraceRaceRepositoryFromHtml', {
            useClass: BoatraceRaceRepositoryFromHtml,
        });
        break;
    }
    case allowedEnvs.test:
    case allowedEnvs.localNoInitData:
    case allowedEnvs.localInitMadeData:
    case allowedEnvs.githubActionsCi: {
        container.register<IRaceRepository>('NarRaceRepositoryFromHtml', {
            useClass: MockHorseRacingRaceRepositoryFromHtml,
        });
        container.register<IPlaceRepository>('NarPlaceRepositoryFromHtml', {
            useClass: MockPlaceRepositoryFromHtml,
        });
        container.register<IRaceRepository>('JraRaceRepositoryFromHtml', {
            useClass: MockHorseRacingRaceRepositoryFromHtml,
        });
        container.register<IPlaceRepository>('JraPlaceRepositoryFromHtml', {
            useClass: MockPlaceRepositoryFromHtml,
        });
        container.register<IRaceRepository>('KeirinRaceRepositoryFromHtml', {
            useClass: MockMechanicalRacingRaceRepositoryFromHtml,
        });
        container.register<IPlaceRepository>('KeirinPlaceRepositoryFromHtml', {
            useClass: MockPlaceRepositoryFromHtml,
        });
        container.register<IRaceRepository>('AutoraceRaceRepositoryFromHtml', {
            useClass: MockMechanicalRacingRaceRepositoryFromHtml,
        });
        container.register<IPlaceRepository>(
            'AutoracePlaceRepositoryFromHtml',
            { useClass: MockPlaceRepositoryFromHtml },
        );
        container.register<IRaceRepository>('OverseasRaceRepositoryFromHtml', {
            useClass: MockHorseRacingRaceRepositoryFromHtml,
        });
        container.register<IPlaceRepository>(
            'BoatracePlaceRepositoryFromHtml',
            { useClass: MockPlaceRepositoryFromHtml },
        );
        container.register<IRaceRepository>('BoatraceRaceRepositoryFromHtml', {
            useClass: MockMechanicalRacingRaceRepositoryFromHtml,
        });
        break;
    }
    default: {
        throw new Error('Invalid ENV value');
    }
}
