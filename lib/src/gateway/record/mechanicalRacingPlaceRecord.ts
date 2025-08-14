import { PlaceData } from '../../domain/placeData';
import { MechanicalRacingPlaceEntity } from '../../repository/entity/mechanicalRacingPlaceEntity';
import type { GradeType } from '../../utility/data/common/gradeType';
import { validateGradeType } from '../../utility/data/common/gradeType';
import type { PlaceId } from '../../utility/data/common/placeId';
import { validatePlaceId } from '../../utility/data/common/placeId';
import type { RaceCourse } from '../../utility/data/common/raceCourse';
import { validateRaceCourse } from '../../utility/data/common/raceCourse';
import type { RaceDateTime } from '../../utility/data/common/raceDateTime';
import { validateRaceDateTime } from '../../utility/data/common/raceDateTime';
import { createErrorMessage } from '../../utility/error';
import type { RaceType } from '../../utility/raceType';
import type { UpdateDate } from '../../utility/updateDate';
import { validateUpdateDate } from '../../utility/updateDate';
import type { IRecord } from './iRecord';

/**
 * Repository層のRecord レース開催場所データ
 */
export class MechanicalRacingPlaceRecord
    implements IRecord<MechanicalRacingPlaceRecord>
{
    /**
     * コンストラクタ
     * @param id - ID
     * @param raceType - レース種別
     * @param dateTime - 開催日時
     * @param location - 開催場所
     * @param grade - グレード
     * @param updateDate - 更新日時
     * @remarks
     * レース開催場所データを生成する
     */
    private constructor(
        public readonly id: PlaceId,
        public readonly raceType: RaceType,
        public readonly dateTime: RaceDateTime,
        public readonly location: RaceCourse,
        public readonly grade: GradeType,
        public readonly updateDate: UpdateDate,
    ) {}

    /**
     * インスタンス生成メソッド
     * @param id - ID
     * @param raceType - レース種別
     * @param dateTime - 開催日時
     * @param location - 開催場所
     * @param grade - グレード
     * @param updateDate - 更新日時
     */
    public static create(
        id: PlaceId,
        raceType: RaceType,
        dateTime: Date,
        location: string,
        grade: string,
        updateDate: Date,
    ): MechanicalRacingPlaceRecord {
        try {
            return new MechanicalRacingPlaceRecord(
                validatePlaceId(raceType, id),
                raceType,
                validateRaceDateTime(dateTime),
                validateRaceCourse(raceType, location),
                validateGradeType(raceType, grade),
                validateUpdateDate(updateDate),
            );
        } catch (error) {
            throw new Error(
                createErrorMessage('Failed to create PlaceRecord', error),
            );
        }
    }

    /**
     * データのコピー
     * @param partial - 上書きする部分データ
     */
    public copy(
        partial: Partial<MechanicalRacingPlaceRecord> = {},
    ): MechanicalRacingPlaceRecord {
        return MechanicalRacingPlaceRecord.create(
            partial.id ?? this.id,
            partial.raceType ?? this.raceType,
            partial.dateTime ?? this.dateTime,
            partial.location ?? this.location,
            partial.grade ?? this.grade,
            partial.updateDate ?? this.updateDate,
        );
    }

    /**
     * PlaceEntityに変換する
     */
    public toEntity(): MechanicalRacingPlaceEntity {
        return MechanicalRacingPlaceEntity.create(
            this.id,
            PlaceData.create(this.raceType, this.dateTime, this.location),
            this.grade,
            this.updateDate,
        );
    }
}
