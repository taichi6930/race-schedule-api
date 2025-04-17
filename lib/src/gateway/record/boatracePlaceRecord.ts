import { BoatracePlaceData } from '../../domain/boatracePlaceData';
import { BoatracePlaceEntity } from '../../repository/entity/boatracePlaceEntity';
import {
    type BoatraceGradeType,
    validateBoatraceGradeType,
} from '../../utility/data/boatrace/boatraceGradeType';
import {
    type BoatracePlaceId,
    validateBoatracePlaceId,
} from '../../utility/data/boatrace/boatracePlaceId';
import {
    type BoatraceRaceCourse,
    validateBoatraceRaceCourse,
} from '../../utility/data/boatrace/boatraceRaceCourse';
import {
    type BoatraceRaceDateTime,
    validateBoatraceRaceDateTime,
} from '../../utility/data/boatrace/boatraceRaceDateTime';
import { createErrorMessage } from '../../utility/error';
import { type UpdateDate, validateUpdateDate } from '../../utility/updateDate';
import type { IRecord } from './iRecord';

/**
 * Repository層のRecord ボートレースのレース開催場所データ
 */
export class BoatracePlaceRecord implements IRecord<BoatracePlaceRecord> {
    /**
     * コンストラクタ
     * @param id - ID
     * @param dateTime - 開催日時
     * @param location - 開催場所
     * @param grade - グレード
     * @param updateDate - 更新日時
     * @remarks
     * レース開催場所データを生成する
     */
    private constructor(
        public readonly id: BoatracePlaceId,
        public readonly dateTime: BoatraceRaceDateTime,
        public readonly location: BoatraceRaceCourse,
        public readonly grade: BoatraceGradeType,
        public readonly updateDate: UpdateDate,
    ) {}

    /**
     * インスタンス生成メソッド
     * @param id - ID
     * @param dateTime - 開催日時
     * @param location - 開催場所
     * @param grade - グレード
     * @param updateDate - 更新日時
     */
    public static create(
        id: string,
        dateTime: Date,
        location: string,
        grade: string,
        updateDate: Date,
    ): BoatracePlaceRecord {
        try {
            return new BoatracePlaceRecord(
                validateBoatracePlaceId(id),
                validateBoatraceRaceDateTime(dateTime),
                validateBoatraceRaceCourse(location),
                validateBoatraceGradeType(grade),
                validateUpdateDate(updateDate),
            );
        } catch (error) {
            throw new Error(
                createErrorMessage(
                    'Failed to create BoatracePlaceRecord',
                    error,
                ),
            );
        }
    }

    /**
     * データのコピー
     * @param partial
     */
    public copy(
        partial: Partial<BoatracePlaceRecord> = {},
    ): BoatracePlaceRecord {
        return BoatracePlaceRecord.create(
            partial.id ?? this.id,
            partial.dateTime ?? this.dateTime,
            partial.location ?? this.location,
            partial.grade ?? this.grade,
            partial.updateDate ?? this.updateDate,
        );
    }

    /**
     * BoatracePlaceEntityに変換する
     */
    public toEntity(): BoatracePlaceEntity {
        return BoatracePlaceEntity.create(
            this.id,
            BoatracePlaceData.create(this.dateTime, this.location, this.grade),
            this.updateDate,
        );
    }
}
