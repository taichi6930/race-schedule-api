import { container } from 'tsyringe';

import type { AutoracePlaceEntity } from '../../src/repository/entity/autoracePlaceEntity';
import type { BoatracePlaceEntity } from '../../src/repository/entity/boatracePlaceEntity';
import type { JraPlaceEntity } from '../../src/repository/entity/jraPlaceEntity';
import type { KeirinPlaceEntity } from '../../src/repository/entity/keirinPlaceEntity';
import type { NarPlaceEntity } from '../../src/repository/entity/narPlaceEntity';
import { AutoracePlaceDataService } from '../../src/service/implement/autoracePlaceDataService';
import { BoatracePlaceDataService } from '../../src/service/implement/boatracePlaceDataService';
import { JraPlaceDataService } from '../../src/service/implement/jraPlaceDataService';
import { KeirinPlaceDataService } from '../../src/service/implement/keirinPlaceDataService';
import { NarPlaceDataService } from '../../src/service/implement/narPlaceDataService';
import { PublicGamblingPlaceDataService } from '../../src/service/implement/publicGamblingPlaceDataService';
import type { IOldPlaceDataService } from '../../src/service/interface/IOldPlaceDataService';
import type { IPlaceDataService } from '../../src/service/interface/IPlaceDataService';

container.register<IOldPlaceDataService<JraPlaceEntity>>(
    'JraPlaceDataService',
    {
        useClass: JraPlaceDataService,
    },
);

container.register<IOldPlaceDataService<NarPlaceEntity>>(
    'NarPlaceDataService',
    {
        useClass: NarPlaceDataService,
    },
);

container.register<IOldPlaceDataService<KeirinPlaceEntity>>(
    'KeirinPlaceDataService',
    {
        useClass: KeirinPlaceDataService,
    },
);

container.register<IOldPlaceDataService<AutoracePlaceEntity>>(
    'AutoracePlaceDataService',
    {
        useClass: AutoracePlaceDataService,
    },
);

container.register<IOldPlaceDataService<BoatracePlaceEntity>>(
    'BoatracePlaceDataService',
    {
        useClass: BoatracePlaceDataService,
    },
);

container.register<IPlaceDataService>('PublicGamblingPlaceDataService', {
    useClass: PublicGamblingPlaceDataService,
});
