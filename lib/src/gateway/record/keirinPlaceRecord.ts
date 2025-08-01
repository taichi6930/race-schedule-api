import { KeirinPlaceData } from '../../domain/keirinPlaceData';
import { KeirinPlaceEntity } from '../../repository/entity/keirinPlaceEntity';
import { validateGradeType } from '../../utility/data/common/gradeType';
import {
    type KeirinRaceCourse,
    validateRaceCourse,
} from '../../utility/data/common/raceCourse';
import {
    type RaceDateTime,
    validateRaceDateTime,
} from '../../utility/data/common/raceDateTime';
import type { KeirinGradeType } from '../../utility/data/keirin/keirinGradeType';
import {
    type KeirinPlaceId,
    validateKeirinPlaceId,
} from '../../utility/data/keirin/keirinPlaceId';
import { createErrorMessage } from '../../utility/error';
import { RaceType } from '../../utility/raceType';
import { type UpdateDate, validateUpdateDate } from '../../utility/updateDate';
import type { IRecord } from './iRecord';

/**
 * Repository層のRecord 競輪のレース開催場所データ
 */
export class KeirinPlaceRecord implements IRecord<KeirinPlaceRecord> {
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
        public readonly id: KeirinPlaceId,
        public readonly dateTime: RaceDateTime,
        public readonly location: KeirinRaceCourse,
        public readonly grade: KeirinGradeType,
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
    ): KeirinPlaceRecord {
        try {
            return new KeirinPlaceRecord(
                validateKeirinPlaceId(id),
                validateRaceDateTime(dateTime),
                validateRaceCourse(RaceType.KEIRIN, location),
                validateGradeType(RaceType.KEIRIN, grade),
                validateUpdateDate(updateDate),
            );
        } catch (error) {
            throw new Error(
                createErrorMessage('KeirinPlaceRecord create error', error),
            );
        }
    }

    /**
     * データのコピー
     * @param partial
     */
    public copy(partial: Partial<KeirinPlaceRecord> = {}): KeirinPlaceRecord {
        return KeirinPlaceRecord.create(
            partial.id ?? this.id,
            partial.dateTime ?? this.dateTime,
            partial.location ?? this.location,
            partial.grade ?? this.grade,
            partial.updateDate ?? this.updateDate,
        );
    }

    /**
     * Entityに変換する
     */
    public toEntity(): KeirinPlaceEntity {
        return KeirinPlaceEntity.create(
            this.id,
            KeirinPlaceData.create(this.dateTime, this.location, this.grade),
            this.updateDate,
        );
    }
}
