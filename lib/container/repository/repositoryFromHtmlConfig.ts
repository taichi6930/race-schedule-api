import { container } from 'tsyringe';

import type { HorseRacingPlaceEntity } from '../../src/repository/entity/horseRacingPlaceEntity';
import type { HorseRacingRaceEntity } from '../../src/repository/entity/horseRacingRaceEntity';
import type { JraPlaceEntity } from '../../src/repository/entity/jraPlaceEntity';
import type { JraRaceEntity } from '../../src/repository/entity/jraRaceEntity';
import type { MechanicalRacingPlaceEntity } from '../../src/repository/entity/mechanicalRacingPlaceEntity';
import type { MechanicalRacingRaceEntity } from '../../src/repository/entity/mechanicalRacingRaceEntity';
import { AutoracePlaceRepositoryFromHtmlImpl } from '../../src/repository/implement/autoracePlaceRepositoryFromHtmlImpl';
import { AutoraceRaceRepositoryFromHtmlImpl } from '../../src/repository/implement/autoraceRaceRepositoryFromHtmlImpl';
import { BoatracePlaceRepositoryFromHtmlImpl } from '../../src/repository/implement/boatracePlaceRepositoryFromHtmlImpl';
import { BoatraceRaceRepositoryFromHtmlImpl } from '../../src/repository/implement/boatraceRaceRepositoryFromHtmlImpl';
import { JraPlaceRepositoryFromHtmlImpl } from '../../src/repository/implement/jraPlaceRepositoryFromHtmlImpl';
import { JraRaceRepositoryFromHtmlImpl } from '../../src/repository/implement/jraRaceRepositoryFromHtmlImpl';
import { KeirinPlaceRepositoryFromHtmlImpl } from '../../src/repository/implement/keirinPlaceRepositoryFromHtmlImpl';
import { KeirinRaceRepositoryFromHtmlImpl } from '../../src/repository/implement/keirinRaceRepositoryFromHtmlImpl';
import { NarPlaceRepositoryFromHtmlImpl } from '../../src/repository/implement/narPlaceRepositoryFromHtmlImpl';
import { NarRaceRepositoryFromHtmlImpl } from '../../src/repository/implement/narRaceRepositoryFromHtmlImpl';
import { OverseasRaceRepositoryFromHtmlImpl } from '../../src/repository/implement/overseasRaceRepositoryFromHtmlImpl';
import type { IPlaceRepository } from '../../src/repository/interface/IPlaceRepository';
import type { IRaceRepository } from '../../src/repository/interface/IRaceRepository';
import { MockHorseRacingPlaceRepositoryFromHtmlImpl } from '../../src/repository/mock/mockHorseRacingPlaceRepositoryFromHtmlImpl';
import { MockHorseRacingRaceRepositoryFromHtmlImpl } from '../../src/repository/mock/mockHorseRacingRaceRepositoryFromHtmlImpl';
import { MockJraPlaceRepositoryFromHtmlImpl } from '../../src/repository/mock/mockJraPlaceRepositoryFromHtmlImpl';
import { MockJraRaceRepositoryFromHtmlImpl } from '../../src/repository/mock/mockJraRaceRepositoryFromHtmlImpl';
import { MockMechanicalRacingPlaceRepositoryFromHtmlImpl } from '../../src/repository/mock/mockMechanicalRacingPlaceRepositoryFromHtmlImpl';
import { MockMechanicalRacingRaceRepositoryFromHtmlImpl } from '../../src/repository/mock/mockMechanicalRacingRaceRepositoryFromHtmlImpl';
import { allowedEnvs, ENV } from '../../src/utility/env';
// Repositoryの実装クラスをDIコンテナに登録する

// 環境ごとの設定
switch (ENV) {
    case allowedEnvs.production:
    case allowedEnvs.local: {
        container.register<
            IRaceRepository<HorseRacingRaceEntity, HorseRacingPlaceEntity>
        >('NarRaceRepositoryFromHtml', {
            useClass: NarRaceRepositoryFromHtmlImpl,
        });
        container.register<IPlaceRepository<HorseRacingPlaceEntity>>(
            'NarPlaceRepositoryFromHtml',
            {
                useClass: NarPlaceRepositoryFromHtmlImpl,
            },
        );
        container.register<IRaceRepository<JraRaceEntity, JraPlaceEntity>>(
            'JraRaceRepositoryFromHtml',
            { useClass: JraRaceRepositoryFromHtmlImpl },
        );
        container.register<IPlaceRepository<JraPlaceEntity>>(
            'JraPlaceRepositoryFromHtml',
            {
                useClass: JraPlaceRepositoryFromHtmlImpl,
            },
        );
        container.register<
            IRaceRepository<
                MechanicalRacingRaceEntity,
                MechanicalRacingPlaceEntity
            >
        >('KeirinRaceRepositoryFromHtml', {
            useClass: KeirinRaceRepositoryFromHtmlImpl,
        });
        container.register<IPlaceRepository<MechanicalRacingPlaceEntity>>(
            'KeirinPlaceRepositoryFromHtml',
            { useClass: KeirinPlaceRepositoryFromHtmlImpl },
        );
        container.register<
            IRaceRepository<
                MechanicalRacingRaceEntity,
                MechanicalRacingPlaceEntity
            >
        >('AutoraceRaceRepositoryFromHtml', {
            useClass: AutoraceRaceRepositoryFromHtmlImpl,
        });
        container.register<IPlaceRepository<MechanicalRacingPlaceEntity>>(
            'AutoracePlaceRepositoryFromHtml',
            { useClass: AutoracePlaceRepositoryFromHtmlImpl },
        );
        container.register<
            IRaceRepository<HorseRacingRaceEntity, HorseRacingPlaceEntity>
        >('OverseasRaceRepositoryFromHtml', {
            useClass: OverseasRaceRepositoryFromHtmlImpl,
        });
        container.register<
            IRaceRepository<
                MechanicalRacingRaceEntity,
                MechanicalRacingPlaceEntity
            >
        >('AutoraceRaceRepositoryFromHtml', {
            useClass: AutoraceRaceRepositoryFromHtmlImpl,
        });
        container.register<IPlaceRepository<MechanicalRacingPlaceEntity>>(
            'BoatracePlaceRepositoryFromHtml',
            { useClass: BoatracePlaceRepositoryFromHtmlImpl },
        );
        container.register<
            IRaceRepository<
                MechanicalRacingRaceEntity,
                MechanicalRacingPlaceEntity
            >
        >('BoatraceRaceRepositoryFromHtml', {
            useClass: BoatraceRaceRepositoryFromHtmlImpl,
        });
        break;
    }
    case allowedEnvs.test:
    case allowedEnvs.localNoInitData:
    case allowedEnvs.localInitMadeData:
    case allowedEnvs.githubActionsCi: {
        container.register<
            IRaceRepository<HorseRacingRaceEntity, HorseRacingPlaceEntity>
        >('NarRaceRepositoryFromHtml', {
            useClass: MockHorseRacingRaceRepositoryFromHtmlImpl,
        });
        container.register<IPlaceRepository<HorseRacingPlaceEntity>>(
            'NarPlaceRepositoryFromHtml',
            {
                useClass: MockHorseRacingPlaceRepositoryFromHtmlImpl,
            },
        );
        container.register<IRaceRepository<JraRaceEntity, JraPlaceEntity>>(
            'JraRaceRepositoryFromHtml',
            { useClass: MockJraRaceRepositoryFromHtmlImpl },
        );
        container.register<IPlaceRepository<JraPlaceEntity>>(
            'JraPlaceRepositoryFromHtml',
            {
                useClass: MockJraPlaceRepositoryFromHtmlImpl,
            },
        );
        container.register<
            IRaceRepository<
                MechanicalRacingRaceEntity,
                MechanicalRacingPlaceEntity
            >
        >('KeirinRaceRepositoryFromHtml', {
            useClass: MockMechanicalRacingRaceRepositoryFromHtmlImpl,
        });
        container.register<IPlaceRepository<MechanicalRacingPlaceEntity>>(
            'KeirinPlaceRepositoryFromHtml',
            { useClass: MockMechanicalRacingPlaceRepositoryFromHtmlImpl },
        );
        container.register<
            IRaceRepository<
                MechanicalRacingRaceEntity,
                MechanicalRacingPlaceEntity
            >
        >('AutoraceRaceRepositoryFromHtml', {
            useClass: MockMechanicalRacingRaceRepositoryFromHtmlImpl,
        });
        container.register<IPlaceRepository<MechanicalRacingPlaceEntity>>(
            'AutoracePlaceRepositoryFromHtml',
            { useClass: MockMechanicalRacingPlaceRepositoryFromHtmlImpl },
        );
        container.register<
            IRaceRepository<HorseRacingRaceEntity, HorseRacingPlaceEntity>
        >('OverseasRaceRepositoryFromHtml', {
            useClass: MockHorseRacingRaceRepositoryFromHtmlImpl,
        });
        container.register<IPlaceRepository<MechanicalRacingPlaceEntity>>(
            'BoatracePlaceRepositoryFromHtml',
            { useClass: MockMechanicalRacingPlaceRepositoryFromHtmlImpl },
        );
        container.register<
            IRaceRepository<
                MechanicalRacingRaceEntity,
                MechanicalRacingPlaceEntity
            >
        >('BoatraceRaceRepositoryFromHtml', {
            useClass: MockMechanicalRacingRaceRepositoryFromHtmlImpl,
        });
        break;
    }
    default: {
        throw new Error('Invalid ENV value');
    }
}
