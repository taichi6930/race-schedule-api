import type { AutoracePlaceData } from '../../domain/autoracePlaceData';
import { AutoracePlaceRecord } from '../../gateway/record/autoracePlaceRecord';
import {
    type AutoracePlaceId,
    validateAutoracePlaceId,
} from '../../utility/data/autorace/autoracePlaceId';
import { generateAutoracePlaceId } from '../../utility/raceId';
import { type UpdateDate, validateUpdateDate } from '../../utility/updateDate';
import type { IPlaceEntity } from './iPlaceEntity';

/**
 * Repository層のEntity オートレースのレース開催場所データ
 */
export class AutoracePlaceEntity implements IPlaceEntity<AutoracePlaceEntity> {
    /**
     * コンストラクタ
     * @remarks
     * レース開催場所データを生成する
     * @param id - ID
     * @param placeData - レース開催場所データ
     * @param updateDate - 更新日時
     */
    private constructor(
        public readonly id: AutoracePlaceId,
        public readonly placeData: AutoracePlaceData,
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
        placeData: AutoracePlaceData,
        updateDate: Date,
    ): AutoracePlaceEntity {
        return new AutoracePlaceEntity(
            validateAutoracePlaceId(id),
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
        placeData: AutoracePlaceData,
        updateDate: Date,
    ): AutoracePlaceEntity {
        return AutoracePlaceEntity.create(
            generateAutoracePlaceId(placeData.dateTime, placeData.location),
            placeData,
            updateDate,
        );
    }

    /**
     * データのコピー
     * @param partial
     */
    public copy(
        partial: Partial<AutoracePlaceEntity> = {},
    ): AutoracePlaceEntity {
        return AutoracePlaceEntity.create(
            partial.id ?? this.id,
            partial.placeData ?? this.placeData,
            partial.updateDate ?? this.updateDate,
        );
    }

    /**
     * AutoracePlaceRecordに変換する
     */
    public toRecord(): AutoracePlaceRecord {
        return AutoracePlaceRecord.create(
            this.id,
            this.placeData.dateTime,
            this.placeData.location,
            this.placeData.grade,
            this.updateDate,
        );
    }
}
