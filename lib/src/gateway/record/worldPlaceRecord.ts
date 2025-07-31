import { WorldPlaceData } from '../../domain/worldPlaceData';
import { WorldPlaceEntity } from '../../repository/entity/worldPlaceEntity';
import type { WorldPlaceId } from '../../utility/data/world/worldPlaceId';
import { validateWorldPlaceId } from '../../utility/data/world/worldPlaceId';
import {
    validateWorldRaceCourse,
    type WorldRaceCourse,
} from '../../utility/data/world/worldRaceCourse';
import {
    validateWorldRaceDateTime,
    type WorldRaceDateTime,
} from '../../utility/data/world/worldRaceDateTime';
import { createErrorMessage } from '../../utility/error';
import { type UpdateDate, validateUpdateDate } from '../../utility/updateDate';
import type { IRecord } from './iRecord';

/**
 * Repository層のRecord 海外競馬のレース開催場所データ
 */
export class WorldPlaceRecord implements IRecord<WorldPlaceRecord> {
    /**
     * コンストラクタ
     * @param id - ID
     * @param dateTime - 開催日時
     * @param location - 開催場所
     * @param updateDate - 更新日時
     * @remarks
     * レース開催場所データを生成する
     */
    private constructor(
        public readonly id: WorldPlaceId,
        public readonly dateTime: WorldRaceDateTime,
        public readonly location: WorldRaceCourse,
        public readonly updateDate: UpdateDate,
    ) {}

    /**
     * インスタンス生成メソッド
     * @param id - ID
     * @param dateTime - 開催日時
     * @param location - 開催場所
     * @param updateDate - 更新日時
     */
    public static create(
        id: string,
        dateTime: Date,
        location: string,
        updateDate: Date,
    ): WorldPlaceRecord {
        try {
            return new WorldPlaceRecord(
                validateWorldPlaceId(id),
                validateWorldRaceDateTime(dateTime),
                validateWorldRaceCourse(location),
                validateUpdateDate(updateDate),
            );
        } catch (error) {
            throw new Error(
                createErrorMessage('WorldPlaceRecord create error', error),
            );
        }
    }

    /**
     * データのコピー
     * @param partial
     */
    public copy(partial: Partial<WorldPlaceRecord> = {}): WorldPlaceRecord {
        return WorldPlaceRecord.create(
            partial.id ?? this.id,
            partial.dateTime ?? this.dateTime,
            partial.location ?? this.location,
            partial.updateDate ?? this.updateDate,
        );
    }

    /**
     * Entityに変換する
     */
    public toEntity(): WorldPlaceEntity {
        return WorldPlaceEntity.create(
            this.id,
            WorldPlaceData.create(this.dateTime, this.location),
            this.updateDate,
        );
    }
}
