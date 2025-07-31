import type { WorldPlaceData } from '../../domain/worldPlaceData';
import { WorldPlaceRecord } from '../../gateway/record/worldPlaceRecord';
import type { WorldPlaceId } from '../../utility/data/world/worldPlaceId';
import { generateWorldPlaceId } from '../../utility/raceId';
import { type UpdateDate, validateUpdateDate } from '../../utility/updateDate';
import type { IPlaceEntity } from './iPlaceEntity';

/**
 * Repository層のEntity 地方競馬のレース開催場所データ
 */
export class WorldPlaceEntity implements IPlaceEntity<WorldPlaceEntity> {
    /**
     * コンストラクタ
     * @param id - ID
     * @param placeData - レース開催場所データ
     * @param updateDate - 更新日時
     * @remarks
     * レース開催場所データを生成する
     */
    private constructor(
        public readonly id: WorldPlaceId,
        public readonly placeData: WorldPlaceData,
        public readonly updateDate: UpdateDate,
    ) {}

    /**
     * インスタンス生成メソッド
     * @param id - ID
     * @param placeData - レース開催場所データ
     * @param updateDate - 更新日時
     */
    public static create(
        id: string,
        placeData: WorldPlaceData,
        updateDate: Date,
    ): WorldPlaceEntity {
        return new WorldPlaceEntity(
            id,
            placeData,
            validateUpdateDate(updateDate),
        );
    }

    /**
     * idがない場合でのcreate
     * @param placeData
     * @param updateDate
     */
    public static createWithoutId(
        placeData: WorldPlaceData,
        updateDate: Date,
    ): WorldPlaceEntity {
        return WorldPlaceEntity.create(
            generateWorldPlaceId(placeData.dateTime, placeData.location),
            placeData,
            updateDate,
        );
    }

    /**
     * データのコピー
     * @param partial
     */
    public copy(partial: Partial<WorldPlaceEntity> = {}): WorldPlaceEntity {
        return WorldPlaceEntity.create(
            partial.id ?? this.id,
            partial.placeData ?? this.placeData,
            partial.updateDate ?? this.updateDate,
        );
    }

    /**
     * WorldPlaceRecordに変換する
     */
    public toRecord(): WorldPlaceRecord {
        return WorldPlaceRecord.create(
            this.id,
            this.placeData.dateTime,
            this.placeData.location,
            this.updateDate,
        );
    }
}
