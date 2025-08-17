import type { HeldDayData } from '../../domain/heldDayData';
import type { PlaceData } from '../../domain/placeData';
import { PlaceRecord } from '../../gateway/record/placeRecord';
import type { PlaceId } from '../../utility/data/common/placeId';
import {
    generatePlaceId,
    validatePlaceId,
} from '../../utility/data/common/placeId';
import { type UpdateDate, validateUpdateDate } from '../../utility/updateDate';
import type { IPlaceEntity } from './iPlaceEntity';

/**
 * Repository層のEntity 中央競馬のレース開催場所データ
 */
export class JraPlaceEntity implements IPlaceEntity<JraPlaceEntity> {
    /**
     * コンストラクタ
     * @param id - ID
     * @param placeData - レース開催場所データ
     * @param heldDayData - 開催日データ
     * @param updateDate - 更新日時
     * @remarks
     * レース開催場所データを生成する
     */
    private constructor(
        public readonly id: PlaceId,
        public readonly placeData: PlaceData,
        public readonly heldDayData: HeldDayData,
        public readonly updateDate: UpdateDate,
    ) {}

    /**
     * インスタンス生成メソッド
     * @param id - ID
     * @param placeData - レース開催場所データ
     * @param heldDayData - 開催日データ
     * @param updateDate - 更新日時
     */
    public static create(
        id: string,
        placeData: PlaceData,
        heldDayData: HeldDayData,
        updateDate: Date,
    ): JraPlaceEntity {
        return new JraPlaceEntity(
            validatePlaceId(placeData.raceType, id),
            placeData,
            heldDayData,
            validateUpdateDate(updateDate),
        );
    }

    /**
     * idがない場合でのcreate
     * @param placeData - レース開催場所データ
     * @param heldDayData
     * @param updateDate - 更新日時
     */
    public static createWithoutId(
        placeData: PlaceData,
        heldDayData: HeldDayData,
        updateDate: Date,
    ): JraPlaceEntity {
        return JraPlaceEntity.create(
            generatePlaceId(
                placeData.raceType,
                placeData.dateTime,
                placeData.location,
            ),
            placeData,
            heldDayData,
            updateDate,
        );
    }

    /**
     * HorseRacingPlaceRecordに変換する
     */
    public toRecord(): PlaceRecord {
        return PlaceRecord.create(
            this.id,
            this.placeData.raceType,
            this.placeData.dateTime,
            this.placeData.location,
            this.updateDate,
        );
    }

    /**
     * データのコピー
     * @param partial - 上書きする部分データ
     */
    public copy(partial: Partial<JraPlaceEntity> = {}): JraPlaceEntity {
        return JraPlaceEntity.create(
            partial.id ?? this.id,
            partial.placeData ?? this.placeData,
            partial.heldDayData ?? this.heldDayData,
            partial.updateDate ?? this.updateDate,
        );
    }
}
