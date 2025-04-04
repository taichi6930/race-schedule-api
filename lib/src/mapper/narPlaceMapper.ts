import type { Database } from 'better-sqlite3';
import { injectable } from 'tsyringe';
import { z } from 'zod';

import { NarPlaceData } from '../domain/narPlaceData';
import { NarPlaceEntity } from '../repository/entity/narPlaceEntity';

/**
 * SQLiteのレコードの型定義
 */
const PlaceRecordSchema = z.object({
    id: z.string(),
    dateTime: z.string(),
    location: z.string(),
    updated_at: z.string(),
});

/**
 * 地方競馬の開催場所データのマッパー
 */
@injectable()
export class NarPlaceMapper {
    private readonly TABLE_NAME = 'places';
    private readonly TYPE = 'nar';

    /**
     * 日付範囲検索のSQLを生成
     */
    public createFetchQuery(): string {
        return `
            SELECT id, dateTime, location, updated_at
            FROM ${this.TABLE_NAME}
            WHERE type = '${this.TYPE}'
            AND dateTime BETWEEN @startDate AND @endDate
        `;
    }

    /**
     * INSERT/UPDATE用のSQLを生成
     */
    public createUpsertQuery(): string {
        return `
            INSERT OR REPLACE INTO ${this.TABLE_NAME} (
                id,
                dateTime,
                location,
                type,
                updated_at
            ) VALUES (
                @id,
                @dateTime,
                @location,
                @type,
                @updated_at
            )
        `;
    }

    /**
     * SQLパラメータに変換
     */
    public toParams(entity: NarPlaceEntity): Record<string, string> {
        return {
            id: entity.id,
            dateTime: entity.placeData.dateTime.toISOString(),
            location: entity.placeData.location,
            type: this.TYPE,
            updated_at: entity.updateDate.toISOString(),
        };
    }

    /**
     * レコードからエンティティに変換
     */
    public toEntity(record: unknown): NarPlaceEntity {
        const validRecord = PlaceRecordSchema.parse(record);

        const placeData = NarPlaceData.create(
            new Date(validRecord.dateTime),
            validRecord.location,
        );

        return NarPlaceEntity.create(
            validRecord.id,
            placeData,
            new Date(validRecord.updated_at),
        );
    }

    /**
     * ステートメントを準備
     */
    public prepareStatements(db: Database): {
        fetchStmt: ReturnType<Database['prepare']>;
        upsertStmt: ReturnType<Database['prepare']>;
    } {
        return {
            fetchStmt: db.prepare(this.createFetchQuery()),
            upsertStmt: db.prepare(this.createUpsertQuery()),
        };
    }
}
