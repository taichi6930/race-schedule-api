import { container } from 'tsyringe';

import { NarPlaceMapper } from '../../src/mapper/narPlaceMapper';

// Mapperの登録
container.register('NarPlaceMapper', {
    useClass: NarPlaceMapper,
});
