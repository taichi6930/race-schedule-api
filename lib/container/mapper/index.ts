import { container } from 'tsyringe';

import { NarPlaceMapper } from '../../src/mapper/narPlaceMapper';
import { NarPlaceRepositoryFromSqliteImpl } from '../../src/repository/implement/narPlaceRepositoryFromSqliteImpl';

// Mapperの登録
container.register(NarPlaceMapper, {
    useClass: NarPlaceMapper,
});

// SQLiteリポジトリの登録
container.register('NarPlaceRepository', {
    useClass: NarPlaceRepositoryFromSqliteImpl,
});

export const registerRepositoryContainer = (): void => {
    // 必要に応じて追加の設定をここに記述
};
