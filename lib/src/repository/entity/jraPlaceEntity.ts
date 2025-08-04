import type { JraPlaceData } from '../../domain/jraPlaceData';
import { JraPlaceRecord } from '../../gateway/record/jraPlaceRecord';
import type { PlaceId } from '../../utility/data/common/placeId';
import { validatePlaceId } from '../../utility/data/common/placeId';
import { generateJraPlaceId } from '../../utility/raceId';
import { RaceType } from '../../utility/raceType';
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
     * @param updateDate - 更新日時
     * @remarks
     * レース開催場所データを生成する
     */
    private constructor(
        public readonly id: PlaceId,
        public readonly placeData: JraPlaceData,
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
        placeData: JraPlaceData,
        updateDate: Date,
    ): JraPlaceEntity {
        return new JraPlaceEntity(
            validatePlaceId(RaceType.JRA, id),
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
        placeData: JraPlaceData,
        updateDate: Date,
    ): JraPlaceEntity {
        return JraPlaceEntity.create(
            generateJraPlaceId(placeData.dateTime, placeData.location),
            placeData,
            updateDate,
        );
    }

    /**
     * データのコピー
     * @param partial
     */
    public copy(partial: Partial<JraPlaceEntity> = {}): JraPlaceEntity {
        return JraPlaceEntity.create(
            partial.id ?? this.id,
            partial.placeData ?? this.placeData,
            partial.updateDate ?? this.updateDate,
        );
    }

    /**
     * JraPlaceRecordに変換する
     */
    public toRecord(): JraPlaceRecord {
        return JraPlaceRecord.create(
            this.id,
            this.placeData.dateTime,
            this.placeData.location,
            this.placeData.heldTimes,
            this.placeData.heldDayTimes,
            this.updateDate,
        );
    }
}
