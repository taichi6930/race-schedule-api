import '../../utility/format';

import type { Database } from 'better-sqlite3';
import { inject, injectable } from 'tsyringe';

import { NarPlaceMapper } from '../../mapper/narPlaceMapper';
import { Logger } from '../../utility/logger';
import { withDatabase } from '../../utility/sqlite';
import { NarPlaceEntity } from '../entity/narPlaceEntity';
import { SearchPlaceFilterEntity } from '../entity/searchPlaceFilterEntity';
import { IPlaceRepository } from '../interface/IPlaceRepository';

@injectable()
export class NarPlaceRepositoryFromSqliteImpl
    implements IPlaceRepository<NarPlaceEntity>
{
    public constructor(
        @inject('NarPlaceMapper') private readonly mapper: NarPlaceMapper,
    ) {}

    /**
     * 開催データを取得する
     * このメソッドで日付の範囲を指定して開催データを取得する
     * @param searchFilter
     */
    @Logger
    public async fetchPlaceEntityList(
        searchFilter: SearchPlaceFilterEntity,
    ): Promise<NarPlaceEntity[]> {
        const result = await Promise.resolve(
            withDatabase((db: Database) => {
                const { fetchStmt } = this.mapper.prepareStatements(db);
                const params = {
                    startDate: searchFilter.startDate.toISOString(),
                    endDate: searchFilter.finishDate.toISOString(),
                };

                const rows = fetchStmt.all(params);
                return (Array.isArray(rows) ? rows : []).map((row) =>
                    this.mapper.toEntity(row),
                );
            }),
        );

        return result;
    }

    /**
     * 開催データを登録する
     * @param placeEntityList
     */
    @Logger
    public async registerPlaceEntityList(
        placeEntityList: NarPlaceEntity[],
    ): Promise<void> {
        // データベース操作をPromiseで包む
        const dbOperation = new Promise<void>((resolve) => {
            withDatabase((db: Database) => {
                const { upsertStmt } = this.mapper.prepareStatements(db);

                db.transaction((entities: NarPlaceEntity[]) => {
                    for (const entity of entities) {
                        upsertStmt.run(this.mapper.toParams(entity));
                    }
                })(placeEntityList);

                resolve();
            });
        });

        await dbOperation;
    }
}
