import { container } from 'tsyringe';

import type { AutoracePlaceEntity } from '../src/repository/entity/autoracePlaceEntity';
import type { AutoraceRaceEntity } from '../src/repository/entity/autoraceRaceEntity';
import type { JraPlaceEntity } from '../src/repository/entity/jraPlaceEntity';
import type { JraRaceEntity } from '../src/repository/entity/jraRaceEntity';
import type { KeirinPlaceEntity } from '../src/repository/entity/keirinPlaceEntity';
import type { KeirinRaceEntity } from '../src/repository/entity/keirinRaceEntity';
import type { NarPlaceEntity } from '../src/repository/entity/narPlaceEntity';
import type { NarRaceEntity } from '../src/repository/entity/narRaceEntity';
import type { WorldPlaceEntity } from '../src/repository/entity/worldPlaceEntity';
import type { WorldRaceEntity } from '../src/repository/entity/worldRaceEntity';
import { AutoracePlaceRepositoryFromHtmlImpl } from '../src/repository/implement/autoracePlaceRepositoryFromHtmlImpl';
import { AutoracePlaceRepositoryFromStorageImpl } from '../src/repository/implement/autoracePlaceRepositoryFromStorageImpl';
import { AutoraceRaceRepositoryFromHtmlImpl } from '../src/repository/implement/autoraceRaceRepositoryFromHtmlImpl';
import { AutoraceRaceRepositoryFromStorageImpl } from '../src/repository/implement/autoraceRaceRepositoryFromStorageImpl';
import { JraPlaceRepositoryFromHtmlImpl } from '../src/repository/implement/jraPlaceRepositoryFromHtmlImpl';
import { JraPlaceRepositoryFromS3Impl } from '../src/repository/implement/jraPlaceRepositoryFromS3Impl';
import { JraRaceRepositoryFromHtmlImpl } from '../src/repository/implement/jraRaceRepositoryFromHtmlImpl';
import { JraRaceRepositoryFromS3Impl } from '../src/repository/implement/jraRaceRepositoryFromS3Impl';
import { KeirinPlaceRepositoryFromHtmlImpl } from '../src/repository/implement/keirinPlaceRepositoryFromHtmlImpl';
import { KeirinPlaceRepositoryFromStorageImpl } from '../src/repository/implement/keirinPlaceRepositoryFromStorageImpl';
import { KeirinRaceRepositoryFromHtmlImpl } from '../src/repository/implement/keirinRaceRepositoryFromHtmlImpl';
import { KeirinRaceRepositoryFromStorageImpl } from '../src/repository/implement/keirinRaceRepositoryFromStorageImpl';
import { NarPlaceRepositoryFromHtmlImpl } from '../src/repository/implement/narPlaceRepositoryFromHtmlImpl';
import { NarPlaceRepositoryFromS3Impl } from '../src/repository/implement/narPlaceRepositoryFromS3Impl';
import { NarRaceRepositoryFromHtmlImpl } from '../src/repository/implement/narRaceRepositoryFromHtmlImpl';
import { NarRaceRepositoryFromS3Impl } from '../src/repository/implement/narRaceRepositoryFromS3Impl';
import { WorldRaceRepositoryFromHtmlImpl } from '../src/repository/implement/worldRaceRepositoryFromHtmlImpl';
import { WorldRaceRepositoryFromStorageImpl } from '../src/repository/implement/worldRaceRepositoryFromStorageImpl';
import type { IPlaceRepository } from '../src/repository/interface/IPlaceRepository';
import type { IRaceRepository } from '../src/repository/interface/IRaceRepository';
import { MockAutoracePlaceRepositoryFromHtmlImpl } from '../src/repository/mock/mockAutoracePlaceRepositoryFromHtmlImpl';
import { MockAutoraceRaceRepositoryFromHtmlImpl } from '../src/repository/mock/mockAutoraceRaceRepositoryFromHtmlImpl';
import { MockJraPlaceRepositoryFromHtmlImpl } from '../src/repository/mock/mockJraPlaceRepositoryFromHtmlImpl';
import { MockJraRaceRepositoryFromHtmlImpl } from '../src/repository/mock/mockJraRaceRepositoryFromHtmlImpl';
import { MockKeirinPlaceRepositoryFromHtmlImpl } from '../src/repository/mock/mockKeirinPlaceRepositoryFromHtmlImpl';
import { MockKeirinRaceRepositoryFromHtmlImpl } from '../src/repository/mock/mockKeirinRaceRepositoryFromHtmlImpl';
import { MockNarPlaceRepositoryFromHtmlImpl } from '../src/repository/mock/mockNarPlaceRepositoryFromHtmlImpl';
import { MockNarRaceRepositoryFromHtmlImpl } from '../src/repository/mock/mockNarRaceRepositoryFromHtmlImpl';
import { MockWorldRaceRepositoryFromHtmlImpl } from '../src/repository/mock/mockWorldRaceRepositoryFromHtmlImpl';
import { ENV } from '../src/utility/env';
// Repositoryの実装クラスをDIコンテナに登録する

// Narリポジトリの登録
container.register<IRaceRepository<NarRaceEntity, NarPlaceEntity>>(
    'NarRaceRepositoryFromS3',
    { useClass: NarRaceRepositoryFromS3Impl },
);
container.register<IPlaceRepository<NarPlaceEntity>>(
    'NarPlaceRepositoryFromS3',
    { useClass: NarPlaceRepositoryFromS3Impl },
);

// Jraリポジトリの登録
container.register<IRaceRepository<JraRaceEntity, JraPlaceEntity>>(
    'JraRaceRepositoryFromS3',
    { useClass: JraRaceRepositoryFromS3Impl },
);
container.register<IPlaceRepository<JraPlaceEntity>>(
    'JraPlaceRepositoryFromS3',
    { useClass: JraPlaceRepositoryFromS3Impl },
);

// Keirinリポジトリの登録
container.register<IRaceRepository<KeirinRaceEntity, KeirinPlaceEntity>>(
    'KeirinRaceRepositoryFromStorage',
    { useClass: KeirinRaceRepositoryFromStorageImpl },
);
container.register<IPlaceRepository<KeirinPlaceEntity>>(
    'KeirinPlaceRepositoryFromStorage',
    { useClass: KeirinPlaceRepositoryFromStorageImpl },
);

// Autoraceリポジトリの登録
container.register<IRaceRepository<AutoraceRaceEntity, AutoracePlaceEntity>>(
    'AutoraceRaceRepositoryFromStorage',
    { useClass: AutoraceRaceRepositoryFromStorageImpl },
);
container.register<IPlaceRepository<AutoracePlaceEntity>>(
    'AutoracePlaceRepositoryFromStorage',
    { useClass: AutoracePlaceRepositoryFromStorageImpl },
);

// Worldリポジトリの登録
container.register<IRaceRepository<WorldRaceEntity, WorldPlaceEntity>>(
    'WorldRaceRepositoryFromStorage',
    { useClass: WorldRaceRepositoryFromStorageImpl },
);

// 環境ごとの設定
switch (ENV) {
    case 'PRODUCTION':
    case 'LOCAL':
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
        break;
    case 'ITa':
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
        break;
}