import { container } from 'tsyringe';

import { PublicGamblingPlaceDataService } from '../../src/service/implement/publicGamblingPlaceDataService';
import type { IPlaceDataService } from '../../src/service/interface/IPlaceDataService';

container.register<IPlaceDataService>('PublicGamblingPlaceDataService', {
    useClass: PublicGamblingPlaceDataService,
});
