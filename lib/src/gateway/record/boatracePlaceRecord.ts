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
    type BoatraceRaceDate,
    validateBoatraceRaceDate,
} from '../../utility/data/boatrace/boatraceRaceDate';
import { type UpdateDate, validateUpdateDate } from '../../utility/updateDate';
import type { IRecord } from './iRecord';

/**
 * Repository層のRecord ボートレースのレース開催場所データ
 */
export class BoatracePlaceRecord implements IRecord<BoatracePlaceRecord> {
    /**
     * コンストラクタ
     *
     * @remarks
     * レース開催場所データを生成する
     * @param id - ID
     * @param dateTime - 開催日時
     * @param location - 開催場所
     * @param grade - グレード
     * @param updateDate - 更新日時
     */
    private constructor(
        public readonly id: BoatracePlaceId,
        public readonly dateTime: BoatraceRaceDate,
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
    static create(
        id: string,
        dateTime: Date,
        location: string,
        grade: string,
        updateDate: Date,
    ): BoatracePlaceRecord {
        try {
            return new BoatracePlaceRecord(
                validateBoatracePlaceId(id),
                validateBoatraceRaceDate(dateTime),
                validateBoatraceRaceCourse(location),
                validateBoatraceGradeType(grade),
                validateUpdateDate(updateDate),
            );
        } catch (e) {
            throw new Error(
                `Failed to create BoatracePlaceRecord: ${(e as Error).message}`,
            );
        }
    }

    /**
     * データのコピー
     * @param partial
     */
    copy(partial: Partial<BoatracePlaceRecord> = {}): BoatracePlaceRecord {
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
    toEntity(): BoatracePlaceEntity {
        return BoatracePlaceEntity.create(
            this.id,
            BoatracePlaceData.create(this.dateTime, this.location, this.grade),
            this.updateDate,
        );
    }
}
