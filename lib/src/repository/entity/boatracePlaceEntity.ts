import type { BoatracePlaceData } from '../../domain/boatracePlaceData';
import { BoatracePlaceRecord } from '../../gateway/record/boatracePlaceRecord';
import {
    type PlaceId,
    validatePlaceId,
} from '../../utility/data/common/placeId';
import { generatePlaceId } from '../../utility/raceId';
import { RaceType } from '../../utility/raceType';
import { type UpdateDate, validateUpdateDate } from '../../utility/updateDate';
import type { IPlaceEntity } from './iPlaceEntity';

/**
 * Repository層のEntity ボートレースのレース開催場所データ
 */
export class BoatracePlaceEntity implements IPlaceEntity<BoatracePlaceEntity> {
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
        public readonly placeData: BoatracePlaceData,
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
        placeData: BoatracePlaceData,
        updateDate: Date,
    ): BoatracePlaceEntity {
        return new BoatracePlaceEntity(
            validatePlaceId(RaceType.BOATRACE, id),
            placeData,
            validateUpdateDate(updateDate),
        );
    }

    /**
     * idがない場合でのcreate
     * @param placeData - レース開催場所データ
     * @param updateDate - 更新日時
     */
    public static createWithoutId(
        placeData: BoatracePlaceData,
        updateDate: Date,
    ): BoatracePlaceEntity {
        return BoatracePlaceEntity.create(
            generatePlaceId(
                RaceType.BOATRACE,
                placeData.dateTime,
                placeData.location,
            ),
            placeData,
            updateDate,
        );
    }

    /**
     * データのコピー
     * @param partial
     */
    public copy(
        partial: Partial<BoatracePlaceEntity> = {},
    ): BoatracePlaceEntity {
        return BoatracePlaceEntity.create(
            partial.id ?? this.id,
            partial.placeData ?? this.placeData,
            partial.updateDate ?? this.updateDate,
        );
    }

    /**
     * BoatracePlaceRecordに変換する
     */
    public toRecord(): BoatracePlaceRecord {
        return BoatracePlaceRecord.create(
            this.id,
            this.placeData.dateTime,
            this.placeData.location,
            this.placeData.grade,
            this.updateDate,
        );
    }
}
