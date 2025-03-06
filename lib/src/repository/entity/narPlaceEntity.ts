import type { NarPlaceData } from '../../domain/narPlaceData';
import { NarPlaceRecord } from '../../gateway/record/narPlaceRecord';
import {
    type NarPlaceId,
    validateNarPlaceId,
} from '../../utility/data/nar/narPlaceId';
import { generateNarPlaceId } from '../../utility/raceId';
import { type UpdateDate, validateUpdateDate } from '../../utility/updateDate';
import type { IPlaceEntity } from './iPlaceEntity';

/**
 * Repository層のEntity 地方競馬のレース開催場所データ
 */
export class NarPlaceEntity implements IPlaceEntity<NarPlaceEntity> {
    /**
     * コンストラクタ
     * @remarks
     * レース開催場所データを生成する
     * @param id - ID
     * @param placeData - レース開催場所データ
     * @param updateDate - 更新日時
     */
    private constructor(
        public readonly id: NarPlaceId,
        public readonly placeData: NarPlaceData,
        public readonly updateDate: UpdateDate,
    ) {}

    /**
     * インスタンス生成メソッド
     * @param id - ID
     * @param placeData - レース開催場所データ
     * @param updateDate - 更新日時
     */
    static create(
        id: string,
        placeData: NarPlaceData,
        updateDate: Date,
    ): NarPlaceEntity {
        return new NarPlaceEntity(
            validateNarPlaceId(id),
            placeData,
            validateUpdateDate(updateDate),
        );
    }

    /**
     * idがない場合でのcreate
     * @param placeData
     * @param updateDate
     */
    static createWithoutId(
        placeData: NarPlaceData,
        updateDate: Date,
    ): NarPlaceEntity {
        return NarPlaceEntity.create(
            generateNarPlaceId(placeData.dateTime, placeData.location),
            placeData,
            updateDate,
        );
    }

    /**
     * データのコピー
     * @param partial
     */
    copy(partial: Partial<NarPlaceEntity> = {}): NarPlaceEntity {
        return NarPlaceEntity.create(
            partial.id ?? this.id,
            partial.placeData ?? this.placeData,
            partial.updateDate ?? this.updateDate,
        );
    }

    /**
     * NarPlaceRecordに変換する
     */
    toRecord(): NarPlaceRecord {
        return NarPlaceRecord.create(
            this.id,
            this.placeData.dateTime,
            this.placeData.location,
            this.updateDate,
        );
    }
}
