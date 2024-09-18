import { container } from 'tsyringe';

import { JraPlaceData } from '../domain/jraPlaceData';
import { JraRaceData } from '../domain/jraRaceData';
import { NarPlaceData } from '../domain/narPlaceData';
import { NarRaceData } from '../domain/narRaceData';
import { JraPlaceRepositoryFromHtmlImpl } from '../repository/implement/jraPlaceRepositoryFromHtmlImpl';
import { JraPlaceRepositoryFromS3Impl } from '../repository/implement/jraPlaceRepositoryFromS3Impl';
import { JraRaceRepositoryFromHtmlImpl } from '../repository/implement/jraRaceRepositoryFromHtmlImpl';
import { JraRaceRepositoryFromS3Impl } from '../repository/implement/jraRaceRepositoryFromS3Impl';
import { NarPlaceRepositoryFromHtmlImpl } from '../repository/implement/narPlaceRepositoryFromHtmlImpl';
import { NarPlaceRepositoryFromS3Impl } from '../repository/implement/narPlaceRepositoryFromS3Impl';
import { NarRaceRepositoryFromHtmlImpl } from '../repository/implement/narRaceRepositoryFromHtmlImpl';
import { NarRaceRepositoryFromS3Impl } from '../repository/implement/narRaceRepositoryFromS3Impl';
import { IPlaceRepository } from '../repository/interface/IPlaceRepository';
import { IRaceRepository } from '../repository/interface/IRaceRepository';

// Repositoryの実装クラスをDIコンテナに登錄する
container.register<IRaceRepository<NarRaceData, NarPlaceData>>(
    'NarRaceRepositoryFromS3',
    { useClass: NarRaceRepositoryFromS3Impl },
);
container.register<IRaceRepository<JraRaceData, JraPlaceData>>(
    'JraRaceRepositoryFromS3',
    { useClass: JraRaceRepositoryFromS3Impl },
);
container.register<IPlaceRepository<NarPlaceData>>('NarPlaceRepositoryFromS3', {
    useClass: NarPlaceRepositoryFromS3Impl,
});
container.register<IPlaceRepository<JraPlaceData>>('JraPlaceRepositoryFromS3', {
    useClass: JraPlaceRepositoryFromS3Impl,
});
container.register<IRaceRepository<NarRaceData, NarPlaceData>>(
    'NarRaceRepositoryFromHtml',
    { useClass: NarRaceRepositoryFromHtmlImpl },
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