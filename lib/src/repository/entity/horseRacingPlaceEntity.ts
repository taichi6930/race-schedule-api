import type { PlaceData } from '../../domain/placeData';
import { HorseRacingPlaceRecord } from '../../gateway/record/horseRacingPlaceRecord';
import type { PlaceId } from '../../utility/data/common/placeId';
import { validatePlaceId } from '../../utility/data/common/placeId';
import { generatePlaceId } from '../../utility/raceId';
import type { RaceType } from '../../utility/raceType';
import { type UpdateDate, validateUpdateDate } from '../../utility/updateDate';
import type { IPlaceEntity } from './iPlaceEntity';

/**
 * Repository層のEntity レース開催場所データ
 */
export class HorseRacingPlaceEntity
    implements IPlaceEntity<HorseRacingPlaceEntity>
{
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
    ): HorseRacingPlaceEntity {
        return new HorseRacingPlaceEntity(
            validatePlaceId(raceType, id),
            raceType,
            placeData,
            validateUpdateDate(updateDate),
        );
    }

    /**
     * idがない場合でのcreate
     * @param raceType - レース種別
     * @param placeData - レース開催場所データ
     * @param updateDate - 更新日時
     */
    public static createWithoutId(
        raceType: RaceType,
        placeData: PlaceData,
        updateDate: Date,
    ): HorseRacingPlaceEntity {
        return HorseRacingPlaceEntity.create(
            generatePlaceId(
                placeData.raceType,
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
     * @param partial - 上書きする部分データ
     */
    public copy(
        partial: Partial<HorseRacingPlaceEntity> = {},
    ): HorseRacingPlaceEntity {
        return HorseRacingPlaceEntity.create(
            partial.id ?? this.id,
            partial.raceType ?? this.raceType,
            partial.placeData ?? this.placeData,
            partial.updateDate ?? this.updateDate,
        );
    }

    /**
     * PlaceRecordに変換する
     */
    public toRecord(): HorseRacingPlaceRecord {
        return HorseRacingPlaceRecord.create(
            this.id,
            this.raceType,
            this.placeData.dateTime,
            this.placeData.location,
            this.updateDate,
        );
    }
}
