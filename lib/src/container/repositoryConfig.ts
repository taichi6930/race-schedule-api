import { container } from 'tsyringe';

import { JraPlaceData } from '../domain/jraPlaceData';
import { JraRaceData } from '../domain/jraRaceData';
import { NarPlaceData } from '../domain/narPlaceData';
import { NarRaceData } from '../domain/narRaceData';
import { KeirinPlaceEntity } from '../repository/entity/keirinPlaceEntity';
import { KeirinRaceInfoEntity } from '../repository/entity/keirinRaceInfoEntity';
import { JraPlaceRepositoryFromHtmlImpl } from '../repository/implement/jraPlaceRepositoryFromHtmlImpl';
import { JraPlaceRepositoryFromS3Impl } from '../repository/implement/jraPlaceRepositoryFromS3Impl';
import { JraRaceRepositoryFromHtmlImpl } from '../repository/implement/jraRaceRepositoryFromHtmlImpl';
import { JraRaceRepositoryFromS3Impl } from '../repository/implement/jraRaceRepositoryFromS3Impl';
import { KeirinPlaceRepositoryFromHtmlImpl } from '../repository/implement/keirinPlaceRepositoryFromHtmlImpl';
import { KeirinPlaceRepositoryFromStorageImpl } from '../repository/implement/keirinPlaceRepositoryFromStorageImpl';
import { KeirinRaceRepositoryFromHtmlImpl } from '../repository/implement/keirinRaceRepositoryFromHtmlImpl';
import { KeirinRaceRepositoryFromStorageImpl } from '../repository/implement/keirinRaceRepositoryFromStorageImpl';
import { NarPlaceRepositoryFromHtmlImpl } from '../repository/implement/narPlaceRepositoryFromHtmlImpl';
import { NarPlaceRepositoryFromS3Impl } from '../repository/implement/narPlaceRepositoryFromS3Impl';
import { NarRaceRepositoryFromHtmlImpl } from '../repository/implement/narRaceRepositoryFromHtmlImpl';
import { NarRaceRepositoryFromS3Impl } from '../repository/implement/narRaceRepositoryFromS3Impl';
import { IPlaceRepository } from '../repository/interface/IPlaceRepository';
import { IRaceRepository } from '../repository/interface/IRaceRepository';
import { MockKeirinPlaceRepositoryFromHtmlImpl } from '../repository/mock/mockKeirinPlaceRepositoryFromHtmlImpl';

// Repositoryの実装クラスをDIコンテナに登錄する
container.register<IRaceRepository<NarRaceData, NarPlaceData>>(
    'NarRaceRepositoryFromS3',
    { useClass: NarRaceRepositoryFromS3Impl },
);
container.register<IRaceRepository<JraRaceData, JraPlaceData>>(
    'JraRaceRepositoryFromS3',
    { useClass: JraRaceRepositoryFromS3Impl },
);
container.register<IRaceRepository<KeirinRaceInfoEntity, KeirinPlaceEntity>>(
    'KeirinRaceRepositoryFromStorage',
    { useClass: KeirinRaceRepositoryFromStorageImpl },
);
container.register<IPlaceRepository<NarPlaceData>>('NarPlaceRepositoryFromS3', {
    useClass: NarPlaceRepositoryFromS3Impl,
});
container.register<IPlaceRepository<JraPlaceData>>('JraPlaceRepositoryFromS3', {
    useClass: JraPlaceRepositoryFromS3Impl,
});
container.register<IPlaceRepository<KeirinPlaceEntity>>(
    'KeirinPlaceRepositoryFromStorage',
    { useClass: KeirinPlaceRepositoryFromStorageImpl },
);
container.register<IRaceRepository<NarRaceData, NarPlaceData>>(
    'NarRaceRepositoryFromHtml',
    { useClass: NarRaceRepositoryFromHtmlImpl },
);
container.register<IRaceRepository<KeirinRaceInfoEntity, KeirinPlaceEntity>>(
    'KeirinRaceRepositoryFromHtml',
    { useClass: KeirinRaceRepositoryFromHtmlImpl },
);
container.register<IRaceRepository<JraRaceData, JraPlaceData>>(
    'JraRaceRepositoryFromHtml',
    { useClass: JraRaceRepositoryFromHtmlImpl },
);
container.register<IPlaceRepository<NarPlaceData>>(
    'NarPlaceRepositoryFromHtml',
    { useClass: NarPlaceRepositoryFromHtmlImpl },
);
container.register<IPlaceRepository<JraPlaceData>>(
    'JraPlaceRepositoryFromHtml',
    { useClass: JraPlaceRepositoryFromHtmlImpl },
);
switch (process.env.ENV) {
    case 'production':
        container.register<IPlaceRepository<KeirinPlaceEntity>>(
            'KeirinPlaceRepositoryFromHtml',
            { useClass: KeirinPlaceRepositoryFromHtmlImpl },
        );
        break;
    case 'local':
        container.register<IPlaceRepository<KeirinPlaceEntity>>(
            'KeirinPlaceRepositoryFromHtml',
            { useClass: MockKeirinPlaceRepositoryFromHtmlImpl },
        );
        break;
    default:
        container.register<IPlaceRepository<KeirinPlaceEntity>>(
            'KeirinPlaceRepositoryFromHtml',
            { useClass: MockKeirinPlaceRepositoryFromHtmlImpl },
        );
        break;
}
