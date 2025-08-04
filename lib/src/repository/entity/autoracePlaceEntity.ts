import type { PlaceData } from '../../domain/placeData';
import { PlaceRecord } from '../../gateway/record/placeRecord';
import type { PlaceId } from '../../utility/data/common/placeId';
import { validatePlaceId } from '../../utility/data/common/placeId';
import { generatePlaceId } from '../../utility/raceId';
import { RaceType } from '../../utility/raceType';
import { type UpdateDate, validateUpdateDate } from '../../utility/updateDate';
import type { IPlaceEntity } from './iPlaceEntity';

/**
 * Repository層のEntity レース開催場所データ
 */
export class PlaceEntity implements IPlaceEntity<PlaceEntity> {
    /**
     * コンストラクタ
     * @param id - ID
     * @param raceType - レース種別
     * @param placeData - レース開催場所データ
     * @param updateDate - 更新日時
     * @remarks
     * レース開催場所データを生成する
     */
    private constructor(
        public readonly id: PlaceId,
        public readonly raceType: RaceType,
        public readonly placeData: PlaceData,
        public readonly updateDate: UpdateDate,
    ) {}

    /**
     * インスタンス生成メソッド
     * @param id - ID
     * @param raceType - レース種別
     * @param placeData - レース開催場所データ
     * @param updateDate - 更新日時
     */
    public static create(
        id: string,
        raceType: RaceType,
        placeData: PlaceData,
        updateDate: Date,
    ): PlaceEntity {
        return new PlaceEntity(
            validatePlaceId(RaceType.AUTORACE, id),
            raceType,
            placeData,
            validateUpdateDate(updateDate),
        );
    }

    /**
     * idがない場合でのcreate
     * @param raceType
     * @param placeData
     * @param updateDate
     */
    public static createWithoutId(
        raceType: RaceType,
        placeData: PlaceData,
        updateDate: Date,
    ): PlaceEntity {
        return PlaceEntity.create(
            generatePlaceId(
                RaceType.AUTORACE,
                placeData.dateTime,
                placeData.location,
            ),
            raceType,
            placeData,
            updateDate,
        );
    }

    /**
     * データのコピー
     * @param partial
     */
    public copy(partial: Partial<PlaceEntity> = {}): PlaceEntity {
        return PlaceEntity.create(
            partial.id ?? this.id,
            partial.raceType ?? this.raceType,
            partial.placeData ?? this.placeData,
            partial.updateDate ?? this.updateDate,
        );
    }

    /**
     * AutoracePlaceRecordに変換する
     */
    public toRecord(): PlaceRecord {
        return PlaceRecord.create(
            this.id,
            this.raceType,
            this.placeData.dateTime,
            this.placeData.location,
            this.placeData.grade,
            this.updateDate,
        );
    }
}
