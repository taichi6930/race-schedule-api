import { container } from 'tsyringe';

import type { AutoracePlaceEntity } from '../../src/repository/entity/autoracePlaceEntity';
import type { AutoraceRaceEntity } from '../../src/repository/entity/autoraceRaceEntity';
import type { BoatracePlaceEntity } from '../../src/repository/entity/boatracePlaceEntity';
import type { BoatraceRaceEntity } from '../../src/repository/entity/boatraceRaceEntity';
import type { JraPlaceEntity } from '../../src/repository/entity/jraPlaceEntity';
import type { JraRaceEntity } from '../../src/repository/entity/jraRaceEntity';
import type { KeirinPlaceEntity } from '../../src/repository/entity/keirinPlaceEntity';
import type { KeirinRaceEntity } from '../../src/repository/entity/keirinRaceEntity';
import type { NarPlaceEntity } from '../../src/repository/entity/narPlaceEntity';
import type { NarRaceEntity } from '../../src/repository/entity/narRaceEntity';
import type { WorldPlaceEntity } from '../../src/repository/entity/worldPlaceEntity';
import type { WorldRaceEntity } from '../../src/repository/entity/worldRaceEntity';
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
import { WorldRaceRepositoryFromHtmlImpl } from '../../src/repository/implement/worldRaceRepositoryFromHtmlImpl';
import type { IPlaceRepository } from '../../src/repository/interface/IPlaceRepository';
import type { IRaceRepository } from '../../src/repository/interface/IRaceRepository';
import { MockAutoracePlaceRepositoryFromHtmlImpl } from '../../src/repository/mock/mockAutoracePlaceRepositoryFromHtmlImpl';
import { MockAutoraceRaceRepositoryFromHtmlImpl } from '../../src/repository/mock/mockAutoraceRaceRepositoryFromHtmlImpl';
import { MockBoatracePlaceRepositoryFromHtmlImpl } from '../../src/repository/mock/mockBoatracePlaceRepositoryFromHtmlImpl';
import { MockBoatraceRaceRepositoryFromHtmlImpl } from '../../src/repository/mock/mockBoatraceRaceRepositoryFromHtmlImpl';
import { MockJraPlaceRepositoryFromHtmlImpl } from '../../src/repository/mock/mockJraPlaceRepositoryFromHtmlImpl';
import { MockJraRaceRepositoryFromHtmlImpl } from '../../src/repository/mock/mockJraRaceRepositoryFromHtmlImpl';
import { MockKeirinPlaceRepositoryFromHtmlImpl } from '../../src/repository/mock/mockKeirinPlaceRepositoryFromHtmlImpl';
import { MockKeirinRaceRepositoryFromHtmlImpl } from '../../src/repository/mock/mockKeirinRaceRepositoryFromHtmlImpl';
import { MockNarPlaceRepositoryFromHtmlImpl } from '../../src/repository/mock/mockNarPlaceRepositoryFromHtmlImpl';
import { MockNarRaceRepositoryFromHtmlImpl } from '../../src/repository/mock/mockNarRaceRepositoryFromHtmlImpl';
import { MockWorldRaceRepositoryFromHtmlImpl } from '../../src/repository/mock/mockWorldRaceRepositoryFromHtmlImpl';
import { allowedEnvs, ENV } from '../../src/utility/env';
// Repositoryの実装クラスをDIコンテナに登録する

// 環境ごとの設定
switch (ENV) {
    case allowedEnvs.production:
    case allowedEnvs.local: {
        container.register<IRaceRepository<NarRaceEntity, NarPlaceEntity>>(
            'NarRaceRepositoryFromHtml',
            { useClass: NarRaceRepositoryFromHtmlImpl },
        );
        container.register<IPlaceRepository<NarPlaceEntity>>(
            'NarPlaceRepositoryFromHtml',
            { useClass: NarPlaceRepositoryFromHtmlImpl },
        );
        container.register<IRaceRepository<JraRaceEntity, JraPlaceEntity>>(
            'JraRaceRepositoryFromHtml',
            { useClass: JraRaceRepositoryFromHtmlImpl },
        );
        container.register<IPlaceRepository<JraPlaceEntity>>(
            'JraPlaceRepositoryFromHtml',
            { useClass: JraPlaceRepositoryFromHtmlImpl },
        );
        container.register<
            IRaceRepository<KeirinRaceEntity, KeirinPlaceEntity>
        >('KeirinRaceRepositoryFromHtml', {
            useClass: KeirinRaceRepositoryFromHtmlImpl,
        });
        container.register<IPlaceRepository<KeirinPlaceEntity>>(
            'KeirinPlaceRepositoryFromHtml',
            { useClass: KeirinPlaceRepositoryFromHtmlImpl },
        );
        container.register<
            IRaceRepository<AutoraceRaceEntity, AutoracePlaceEntity>
        >('AutoraceRaceRepositoryFromHtml', {
            useClass: AutoraceRaceRepositoryFromHtmlImpl,
        });
        container.register<IPlaceRepository<AutoracePlaceEntity>>(
            'AutoracePlaceRepositoryFromHtml',
            { useClass: AutoracePlaceRepositoryFromHtmlImpl },
        );
        container.register<IRaceRepository<WorldRaceEntity, WorldPlaceEntity>>(
            'WorldRaceRepositoryFromHtml',
            { useClass: WorldRaceRepositoryFromHtmlImpl },
        );
        container.register<
            IRaceRepository<AutoraceRaceEntity, AutoracePlaceEntity>
        >('AutoraceRaceRepositoryFromHtml', {
            useClass: AutoraceRaceRepositoryFromHtmlImpl,
        });
        container.register<IPlaceRepository<BoatracePlaceEntity>>(
            'BoatracePlaceRepositoryFromHtml',
            { useClass: BoatracePlaceRepositoryFromHtmlImpl },
        );
        container.register<
            IRaceRepository<BoatraceRaceEntity, BoatracePlaceEntity>
        >('BoatraceRaceRepositoryFromHtml', {
            useClass: BoatraceRaceRepositoryFromHtmlImpl,
        });
        break;
    }
    case allowedEnvs.test:
    case allowedEnvs.localNoInitData:
    case allowedEnvs.localInitMadeData:
    case allowedEnvs.githubActionsCi: {
        container.register<IRaceRepository<NarRaceEntity, NarPlaceEntity>>(
            'NarRaceRepositoryFromHtml',
            { useClass: MockNarRaceRepositoryFromHtmlImpl },
        );
        container.register<IPlaceRepository<NarPlaceEntity>>(
            'NarPlaceRepositoryFromHtml',
            { useClass: MockNarPlaceRepositoryFromHtmlImpl },
        );
        container.register<IRaceRepository<JraRaceEntity, JraPlaceEntity>>(
            'JraRaceRepositoryFromHtml',
            { useClass: MockJraRaceRepositoryFromHtmlImpl },
        );
        container.register<IPlaceRepository<JraPlaceEntity>>(
            'JraPlaceRepositoryFromHtml',
            { useClass: MockJraPlaceRepositoryFromHtmlImpl },
        );
        container.register<
            IRaceRepository<KeirinRaceEntity, KeirinPlaceEntity>
        >('KeirinRaceRepositoryFromHtml', {
            useClass: MockKeirinRaceRepositoryFromHtmlImpl,
        });
        container.register<IPlaceRepository<KeirinPlaceEntity>>(
            'KeirinPlaceRepositoryFromHtml',
            { useClass: MockKeirinPlaceRepositoryFromHtmlImpl },
        );
        container.register<
            IRaceRepository<AutoraceRaceEntity, AutoracePlaceEntity>
        >('AutoraceRaceRepositoryFromHtml', {
            useClass: MockAutoraceRaceRepositoryFromHtmlImpl,
        });
        container.register<IPlaceRepository<AutoracePlaceEntity>>(
            'AutoracePlaceRepositoryFromHtml',
            { useClass: MockAutoracePlaceRepositoryFromHtmlImpl },
        );
        container.register<IRaceRepository<WorldRaceEntity, WorldPlaceEntity>>(
            'WorldRaceRepositoryFromHtml',
            { useClass: MockWorldRaceRepositoryFromHtmlImpl },
        );
        container.register<IPlaceRepository<BoatracePlaceEntity>>(
            'BoatracePlaceRepositoryFromHtml',
            { useClass: MockBoatracePlaceRepositoryFromHtmlImpl },
        );
        container.register<
            IRaceRepository<BoatraceRaceEntity, BoatracePlaceEntity>
        >('BoatraceRaceRepositoryFromHtml', {
            useClass: MockBoatraceRaceRepositoryFromHtmlImpl,
        });
        break;
    }
    default: {
        throw new Error('Invalid ENV value');
    }
}
