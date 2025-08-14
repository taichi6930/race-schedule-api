import type { PlaceData } from '../../domain/placeData';
import { MechanicalRacingPlaceRecord } from '../../gateway/record/mechanicalRacingPlaceRecord';
import {
    type GradeType,
    validateGradeType,
} from '../../utility/data/common/gradeType';
import type { PlaceId } from '../../utility/data/common/placeId';
import {
    generatePlaceId,
    validatePlaceId,
} from '../../utility/data/common/placeId';
import type { RaceType } from '../../utility/raceType';
import { type UpdateDate, validateUpdateDate } from '../../utility/updateDate';
import type { IPlaceEntity } from './iPlaceEntity';

/**
 * Repository層のEntity レース開催場所データ
 */
export class MechanicalRacingPlaceEntity
    implements IPlaceEntity<MechanicalRacingPlaceEntity>
{
    /**
     * コンストラクタ
     * @param id - ID
     * @param raceType - レース種別
     * @param placeData - レース開催場所データ
     * @param grade - グレード
     * @param updateDate - 更新日時
     * @remarks
     * レース開催場所データを生成する
     */
    private constructor(
        public readonly id: PlaceId,
        public readonly raceType: RaceType,
        public readonly placeData: PlaceData,
        public readonly grade: GradeType,
        public readonly updateDate: UpdateDate,
    ) {}

    /**
     * インスタンス生成メソッド
     * @param id - ID
     * @param raceType - レース種別
     * @param placeData - レース開催場所データ
     * @param grade - グレード
     * @param updateDate - 更新日時
     */
    public static create(
        id: string,
        raceType: RaceType,
        placeData: PlaceData,
        grade: GradeType,
        updateDate: Date,
    ): MechanicalRacingPlaceEntity {
        return new MechanicalRacingPlaceEntity(
            validatePlaceId(raceType, id),
            raceType,
            placeData,
            validateGradeType(raceType, grade),
            validateUpdateDate(updateDate),
        );
    }

    /**
     * idがない場合でのcreate
     * @param raceType - レース種別
     * @param placeData - レース開催場所データ
     * @param grade - グレード
     * @param updateDate - 更新日時
     */
    public static createWithoutId(
        raceType: RaceType,
        placeData: PlaceData,
        grade: GradeType,
        updateDate: Date,
    ): MechanicalRacingPlaceEntity {
        return MechanicalRacingPlaceEntity.create(
            generatePlaceId(raceType, placeData.dateTime, placeData.location),
            raceType,
            placeData,
            grade,
            updateDate,
        );
    }

    /**
     * データのコピー
     * @param partial - 上書きする部分データ
     */
    public copy(
        partial: Partial<MechanicalRacingPlaceEntity> = {},
    ): MechanicalRacingPlaceEntity {
        return MechanicalRacingPlaceEntity.create(
            partial.id ?? this.id,
            partial.raceType ?? this.raceType,
            partial.placeData ?? this.placeData,
            partial.grade ?? this.grade,
            partial.updateDate ?? this.updateDate,
        );
    }

    /**
     * PlaceRecordに変換する
     */
    public toRecord(): MechanicalRacingPlaceRecord {
        return MechanicalRacingPlaceRecord.create(
            this.id,
            this.raceType,
            this.placeData.dateTime,
            this.placeData.location,
            this.grade,
            this.updateDate,
        );
    }
}
