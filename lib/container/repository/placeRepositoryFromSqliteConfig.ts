import { container } from 'tsyringe';

import type { NarPlaceEntity } from '../../src/repository/entity/narPlaceEntity';
import { NarPlaceRepositoryFromSqliteImpl } from '../../src/repository/implement/narPlaceRepositoryFromSqliteImpl';
import type { IPlaceRepository } from '../../src/repository/interface/IPlaceRepository';

// NAR開催場所リポジトリの登録
container.register<IPlaceRepository<NarPlaceEntity>>('NarPlaceRepository', {
    useClass: NarPlaceRepositoryFromSqliteImpl,
});
